const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const multer = require('multer');
const path = require('path');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'complaint-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'));
    }
  }
});

// @route   POST /api/complaints
// @desc    Create a new complaint
// @access  Private
router.post(
  '/',
  authMiddleware,
  upload.single('image'),
  [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('category').isIn(['Electrical', 'Plumbing', 'Furniture', 'Cleaning', 'Other']).withMessage('Invalid category'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('location').trim().notEmpty().withMessage('Location is required'),
    body('urgency').isIn(['low', 'medium', 'high']).withMessage('Invalid urgency level'),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { title, category, description, location, urgency } = req.body;
      const userId = req.user.id;
      const imagePath = req.file ? req.file.path : null;

      // Get user details
      const userResult = await db.query('SELECT full_name, room_number FROM users WHERE id = ?', [userId]);
      const user = userResult.rows[0];

      const result = await db.query(
        `INSERT INTO complaints (user_id, title, category, description, location, urgency, image_path, student_name, room_number, status) 
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'submitted')`,
        [userId, title, category, description, location, urgency, imagePath, user.full_name, user.room_number]
      );

      // Get the created complaint
      const complaintResult = await db.query('SELECT * FROM complaints WHERE id = ?', [result.rows.insertId]);

      res.status(201).json({
        message: 'Complaint created successfully',
        complaint: complaintResult.rows[0],
      });
    } catch (error) {
      console.error('Create complaint error:', error);
      res.status(500).json({ message: 'Server error while creating complaint' });
    }
  }
);

// @route   GET /api/complaints
// @desc    Get all complaints (for warden) or user's complaints (for student)
// @access  Private
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { role, id: userId } = req.user;
    const { status, category, urgency } = req.query;

    let query = 'SELECT * FROM complaints';
    let params = [];
    let conditions = [];

    // Students can only see their own complaints
    if (role === 'student') {
      conditions.push('user_id = ?');
      params.push(userId);
    }

    // Apply filters
    if (status) {
      conditions.push('status = ?');
      params.push(status);
    }
    if (category) {
      conditions.push('category = ?');
      params.push(category);
    }
    if (urgency) {
      conditions.push('urgency = ?');
      params.push(urgency);
    }

    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }

    query += ' ORDER BY created_at DESC';

    const result = await db.query(query, params);

    res.json({
      complaints: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get complaints error:', error);
    res.status(500).json({ message: 'Server error while fetching complaints' });
  }
});

// @route   GET /api/complaints/:id
// @desc    Get a specific complaint by ID
// @access  Private
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    let query = 'SELECT * FROM complaints WHERE id = ?';
    const params = [id];

    // Students can only view their own complaints
    if (role === 'student') {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const result = await db.query(query, params);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    res.json({ complaint: result.rows[0] });
  } catch (error) {
    console.error('Get complaint error:', error);
    res.status(500).json({ message: 'Server error while fetching complaint' });
  }
});

// @route   PUT /api/complaints/:id
// @desc    Update complaint status (warden only)
// @access  Private (Warden)
router.put('/:id/status', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'warden') {
      return res.status(403).json({ message: 'Access denied. Warden only.' });
    }

    const { id } = req.params;
    const { status } = req.body;

    if (!['submitted', 'assigned', 'in-progress', 'resolved', 'overdue'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await db.query(
      'UPDATE complaints SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [status, id]
    );

    if (result.rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Get the updated complaint
    const complaintResult = await db.query('SELECT * FROM complaints WHERE id = ?', [id]);

    res.json({
      message: 'Complaint status updated successfully',
      complaint: complaintResult.rows[0],
    });
  } catch (error) {
    console.error('Update complaint status error:', error);
    res.status(500).json({ message: 'Server error while updating complaint' });
  }
});

// @route   PUT /api/complaints/:id/assign
// @desc    Assign complaint to team (warden only)
// @access  Private (Warden)
router.put('/:id/assign', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'warden') {
      return res.status(403).json({ message: 'Access denied. Warden only.' });
    }

    const { id } = req.params;
    const { assignedTo, urgency, deadline } = req.body;

    const result = await db.query(
      `UPDATE complaints 
       SET assigned_to = ?, urgency = ?, deadline = ?, status = 'assigned', updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [assignedTo, urgency || 'medium', deadline || null, id]
    );

    if (result.rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found' });
    }

    // Get the updated complaint
    const complaintResult = await db.query('SELECT * FROM complaints WHERE id = ?', [id]);

    res.json({
      message: 'Complaint assigned successfully',
      complaint: complaintResult.rows[0],
    });
  } catch (error) {
    console.error('Assign complaint error:', error);
    res.status(500).json({ message: 'Server error while assigning complaint' });
  }
});

// @route   DELETE /api/complaints/:id
// @desc    Delete a complaint (student can delete their own)
// @access  Private
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = req.user;

    let query = 'DELETE FROM complaints WHERE id = ?';
    const params = [id];

    // Students can only delete their own complaints
    if (role === 'student') {
      query += ' AND user_id = ?';
      params.push(userId);
    }

    const result = await db.query(query, params);

    if (result.rows.affectedRows === 0) {
      return res.status(404).json({ message: 'Complaint not found or unauthorized' });
    }

    res.json({ message: 'Complaint deleted successfully' });
  } catch (error) {
    console.error('Delete complaint error:', error);
    res.status(500).json({ message: 'Server error while deleting complaint' });
  }
});

// @route   GET /api/complaints/stats/dashboard
// @desc    Get dashboard statistics
// @access  Private
router.get('/stats/dashboard', authMiddleware, async (req, res) => {
  try {
    const { role, id: userId } = req.user;

    let whereClause = role === 'student' ? `WHERE user_id = ${userId}` : '';

    const totalResult = await db.query(`SELECT COUNT(*) as total FROM complaints ${whereClause}`);
    const submittedResult = await db.query(`SELECT COUNT(*) as count FROM complaints ${whereClause} ${whereClause ? 'AND' : 'WHERE'} status = 'submitted'`);
    const inProgressResult = await db.query(`SELECT COUNT(*) as count FROM complaints ${whereClause} ${whereClause ? 'AND' : 'WHERE'} status IN ('assigned', 'in-progress')`);
    const resolvedResult = await db.query(`SELECT COUNT(*) as count FROM complaints ${whereClause} ${whereClause ? 'AND' : 'WHERE'} status = 'resolved'`);
    const overdueResult = await db.query(`SELECT COUNT(*) as count FROM complaints ${whereClause} ${whereClause ? 'AND' : 'WHERE'} status = 'overdue'`);

    res.json({
      total: parseInt(totalResult.rows[0].total),
      submitted: parseInt(submittedResult.rows[0].count),
      inProgress: parseInt(inProgressResult.rows[0].count),
      resolved: parseInt(resolvedResult.rows[0].count),
      overdue: parseInt(overdueResult.rows[0].count),
    });
  } catch (error) {
    console.error('Get stats error:', error);
    res.status(500).json({ message: 'Server error while fetching statistics' });
  }
});

module.exports = router;
