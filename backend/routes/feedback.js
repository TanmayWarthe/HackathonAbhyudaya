const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const db = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

// @route   POST /api/feedback
// @desc    Submit feedback for a resolved complaint
// @access  Private
router.post(
  '/',
  authMiddleware,
  [
    body('complaintId').isInt().withMessage('Valid complaint ID is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').optional().trim(),
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { complaintId, rating, comment } = req.body;
      const userId = req.user.id;

      // Check if complaint exists and belongs to user
      const complaintResult = await db.query(
        'SELECT * FROM complaints WHERE id = $1 AND user_id = $2',
        [complaintId, userId]
      );

      if (complaintResult.rows.length === 0) {
        return res.status(404).json({ message: 'Complaint not found' });
      }

      // Check if feedback already exists
      const existingFeedback = await db.query(
        'SELECT * FROM feedback WHERE complaint_id = $1 AND user_id = $2',
        [complaintId, userId]
      );

      if (existingFeedback.rows.length > 0) {
        return res.status(400).json({ message: 'Feedback already submitted for this complaint' });
      }

      // Insert feedback
      const result = await db.query(
        'INSERT INTO feedback (complaint_id, user_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
        [complaintId, userId, rating, comment || null]
      );

      res.status(201).json({
        message: 'Feedback submitted successfully',
        feedback: result.rows[0],
      });
    } catch (error) {
      console.error('Submit feedback error:', error);
      res.status(500).json({ message: 'Server error while submitting feedback' });
    }
  }
);

// @route   GET /api/feedback/:complaintId
// @desc    Get feedback for a specific complaint
// @access  Private
router.get('/:complaintId', authMiddleware, async (req, res) => {
  try {
    const { complaintId } = req.params;

    const result = await db.query(
      `SELECT f.*, u.full_name 
       FROM feedback f 
       JOIN users u ON f.user_id = u.id 
       WHERE f.complaint_id = $1`,
      [complaintId]
    );

    res.json({
      feedback: result.rows,
      count: result.rows.length,
    });
  } catch (error) {
    console.error('Get feedback error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback' });
  }
});

// @route   GET /api/feedback/stats/average
// @desc    Get average rating statistics (warden only)
// @access  Private (Warden)
router.get('/stats/average', authMiddleware, async (req, res) => {
  try {
    if (req.user.role !== 'warden') {
      return res.status(403).json({ message: 'Access denied. Warden only.' });
    }

    const result = await db.query(
      `SELECT 
         AVG(rating) as average_rating,
         COUNT(*) as total_feedback,
         COUNT(CASE WHEN rating >= 4 THEN 1 END) as positive_feedback,
         COUNT(CASE WHEN rating <= 2 THEN 1 END) as negative_feedback
       FROM feedback`
    );

    res.json({
      averageRating: parseFloat(result.rows[0].average_rating).toFixed(2),
      totalFeedback: parseInt(result.rows[0].total_feedback),
      positiveFeedback: parseInt(result.rows[0].positive_feedback),
      negativeFeedback: parseInt(result.rows[0].negative_feedback),
    });
  } catch (error) {
    console.error('Get feedback stats error:', error);
    res.status(500).json({ message: 'Server error while fetching feedback statistics' });
  }
});

module.exports = router;
