# Hostel Complaint & Maintenance Tracking System - Backend

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env` and update the values:
```bash
cp .env.example .env
```

Update the following in `.env`:
- `DB_PASSWORD`: Your PostgreSQL password
- `JWT_SECRET`: A secure random string for JWT tokens

### 3. Set Up MySQL Database
Make sure MySQL is installed and running.

Create the database and tables:
```bash
mysql -u root -p < database/schema.sql
```

Or manually:
```bash
mysql -u root -p
# Enter password, then run:
source database/schema.sql;
```

Or using MySQL Workbench:
- Open MySQL Workbench
- Connect to your MySQL server
- File → Run SQL Script → Select database/schema.sql

### 4. Start the Server

Development mode (with auto-restart):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

The server will run on `http://localhost:5000`

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info (requires auth)

### Complaints
- `POST /api/complaints` - Create new complaint (requires auth)
- `GET /api/complaints` - Get all complaints (filtered by role)
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id/status` - Update complaint status (warden only)
- `PUT /api/complaints/:id/assign` - Assign complaint to team (warden only)
- `DELETE /api/complaints/:id` - Delete complaint
- `GET /api/complaints/stats/dashboard` - Get dashboard statistics

### Feedback
- `POST /api/feedback` - Submit feedback for complaint
- `GET /api/feedback/:complaintId` - Get feedback for complaint
- `GET /api/feedback/stats/average` - Get feedback statistics (warden only)

## Database Schema

### Users Table
- id, full_name, email, password, role, hostel_name, room_number

### Complaints Table
- id, user_id, title, category, description, location, urgency, status, image_path, assigned_to, deadline, student_name, room_number

### Feedback Table
- id, complaint_id, user_id, rating, comment

## File Uploads
Images are stored in the `uploads/` directory with a 5MB size limit.
Supported formats: JPEG, JPG, PNG, GIF

## Authentication
Uses JWT tokens with Bearer authentication.
Include token in requests: `Authorization: Bearer <token>`
