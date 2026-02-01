# Hostel Complaint & Maintenance Tracking System

A full-stack web application for managing hostel complaints and maintenance requests with role-based access for students and wardens.

## Technology Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database
- **JWT** authentication
- **bcrypt** for password hashing
- **Multer** for file uploads
- **CORS** enabled

### Frontend
- **React** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## Setup Instructions

### Prerequisites
- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn

### 1. Backend Setup

```bash
cd backend
npm install
```

#### Configure Environment Variables
Copy `.env.example` to `.env` and update with your configuration:
```env
PORT=5000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=hostel_complaints
DB_USER=root
DB_PASSWORD=your_password_here
JWT_SECRET=your_secure_jwt_secret_here
JWT_EXPIRE=7d
CORS_ORIGIN=http://localhost:5173
```

#### Set Up MySQL Database
```bash
# Using MySQL command line:
mysql -u root -p < database/schema.sql

# Or manually:
mysql -u root -p
source database/schema.sql;
```

#### Start the Backend Server
```bash
npm run dev    # Development mode with auto-restart
npm start      # Production mode
```

Backend runs on `http://localhost:5000`

### 2. Frontend Setup

```bash
cd frontend
npm install
```

#### Configure Environment Variables
Copy `.env.example` to `.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

#### Start the Frontend Development Server
```bash
npm run dev
```

Frontend runs on `http://localhost:5173`

## Features

### For Students
- Raise complaints with category, description, location, urgency, and images
- Track all submitted complaints with status updates
- Dashboard with complaint statistics
- Provide feedback on resolved complaints

### For Wardens
- View all complaints from all students
- Assign complaints to maintenance teams
- Update complaint status
- View analytics and statistics
- Filter complaints by category, status, and priority

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user info

### Complaints
- `POST /api/complaints` - Create new complaint
- `GET /api/complaints` - Get complaints (filtered by role)
- `GET /api/complaints/:id` - Get specific complaint
- `PUT /api/complaints/:id/status` - Update status (warden only)
- `PUT /api/complaints/:id/assign` - Assign complaint (warden only)
- `DELETE /api/complaints/:id` - Delete complaint
- `GET /api/complaints/stats/dashboard` - Get statistics

### Feedback
- `POST /api/feedback` - Submit feedback
- `GET /api/feedback/:complaintId` - Get complaint feedback
- `GET /api/feedback/stats/average` - Get feedback stats (warden only)

## Testing the Application

1. **Create Student Account**: Sign up with role "Student", provide hostel name and room number
2. **Create Warden Account**: Sign up with role "Warden"
3. **Test Student Features**: Login as student, raise complaints, view dashboard
4. **Test Warden Features**: Login as warden, view all complaints, assign and update status

## TroubleshootingMySQL is running and .env credentials are correct
- **Frontend can't connect**: Verify backend is running on port 5000 and CORS is configured
- **Database errors**: Ensure `hostel_complaints` database exists and schema.sql has been executed
- **Authentication errors**: Clear browser localStorage and check JWT_SECRET is set
- **MySQL connection errors**: Verify MySQL service is running and credentials in .env are correconfigured
- **Database errors**: Ensure `hostel_complaints` database exists and schema.sql has been executed
- **Authentication errors**: Clear browser localStorage and check JWT_SECRET is set

## Project Structure

```
backend/
  ├── config/database.js       # PostgreSQL connection
  ├── database/schema.sql      # Database schema
  ├── middleware/auth.js       # JWT authentication
  ├── routes/                  # API routes
  └── server.js               # Main server

frontend/
  ├── src/
  │   ├── components/         # React components
  │   ├── pages/             # Page components
  │   ├── services/api.js    # API service layer
  │   └── App.jsx
  └── package.json
```

## License

MIT License
