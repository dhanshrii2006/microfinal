# Acadify - Complete Setup & Running Guide

This is the integrated Acadify Learning Management System with a full-stack setup including backend API and modern frontend.

## 📋 Prerequisites

- **Node.js** 18+ ([Download](https://nodejs.org/))
- **PostgreSQL** 14+ ([Download](https://www.postgresql.org/))
- **npm** 9+ (comes with Node.js)
- **Git** (optional, for version control)

**Check your versions:**
```bash
node --version
npm --version
psql --version
```

---

## 🚀 Quick Start (5 minutes)

### 1. Create PostgreSQL Database

Open PostgreSQL terminal (psql) and run:
```sql
CREATE DATABASE acadify;
```

### 2. Install Dependencies

```bash
# From project root (e:\hii\acad\acadify\)
npm install
cd server && npm install
cd ../client && npm install
cd ..
```

### 3. Configure Environment

```bash
cd server
cp .env.example .env
```

Edit `.env` and set these variables:
```
DATABASE_URL=postgresql://postgres:password@localhost:5432/acadify
JWT_SECRET=your_super_secret_jwt_key_change_this
COOKIE_SECRET=your_super_secret_cookie_key_change_this
PORT=5000
JWT_EXPIRY=7d
```

**Replace `password` with your PostgreSQL password!**

### 4. Setup Database Schema

```bash
npm run db:migrate
npm run db:seed
```

This creates all tables and populates demo users:
- **Admin**: `admin@acadify.dev` / `password123`
- **Teacher**: `teacher@acadify.dev` / `password123`  
- **Student**: `student@acadify.dev` / `password123`

### 5. Start the Application

```bash
# From project root
npm run dev
```

This starts:
- **Backend Server** on `http://localhost:5000`
- **Frontend** on `http://localhost:5173`

Open `http://localhost:5173` in your browser!

---

## 📁 Project Structure

```
acadify/
├── server/                 # Express.js Backend API
│   ├── src/
│   │   ├── index.js       # Main server file
│   │   ├── controllers/   # Business logic
│   │   ├── routes/        # API endpoints
│   │   ├── middleware/    # Auth & validation
│   │   └── db/            # Database config & migrations
│   ├── .env               # Environment variables
│   └── package.json
│
├── client/                 # Frontend (Static HTML + JavaScript)
│   ├── index.html         # Login page
│   ├── dashboard.html     # Main dashboard
│   ├── my-courses.html    # Student courses
│   ├── browse-courses.html # Course catalog
│   ├── api.js             # API client utilities
│   ├── app.js             # Authentication & navigation
│   ├── style.css          # Styling
│   └── [other pages]
│
├── package.json           # Root config (workspaces)
└── README.md
```

---

## 🔐 Authentication Flow

1. **Register/Login** → User credentials validated against database
2. **JWT Token** → Created and stored in HttpOnly cookie (secure!)
3. **Protected Routes** → All pages check authentication before loading
4. **Auto-redirect** → Unauthorized users sent back to login page
5. **Logout** → Clears session and JWT cookie

---

## 📚 API Endpoints (Currently Implemented)

### Authentication
- `POST /api/auth/register` - Create new account
- `POST /api/auth/login` - Login (returns JWT)
- `POST /api/auth/logout` - Logout (clears session)
- `GET /api/auth/me` - Get current user info

### Health Check
- `GET /api/health` - Server status

---

## 💻 Development Tips

### Start Only Backend
```bash
cd server
npm run dev
```
Runs on `http://localhost:5000`

### Start Only Frontend
```bash
cd client
npm run dev
```
Runs on `http://localhost:5173`

### View Database
```bash
psql -U postgres -d acadify
```

Common commands:
- `\dt` - List all tables
- `SELECT * FROM users;` - View users
- `\q` - Exit

### Reset Everything (Fresh Setup)
```bash
# Drop and recreate database
psql -U postgres -c "DROP DATABASE IF EXISTS acadify;"
psql -U postgres -c "CREATE DATABASE acadify;"

# Reset
npm run db:migrate
npm run db:seed
npm run dev
```

---

## 🧪 Testing Features

### Demo Login
1. Open `http://localhost:5173`
2. Use any demo account:
   - Email: `student@acadify.dev`
   - Password: `password123`
3. Explore dashboard and pages
4. Click "Logout" to return to login

### Test API Directly (curl or Postman)
```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"student@acadify.dev","password":"password123"}'

# Get current user
curl http://localhost:5000/api/auth/me
```

---

## ✅ Troubleshooting

### Port Already in Use
If port 5000 or 5173 is already in use:
```bash
# Find process using port (Windows PowerShell)
Get-NetTCPConnection -LocalPort 5000 -ErrorAction SilentlyContinue

# Kill it if needed
Stop-Process -Id <PID> -Force
```

### Database Connection Error
- Verify PostgreSQL is running
- Check `.env` DATABASE_URL is correct
- Ensure database `acadify` exists

### CORS Error
- Backend and frontend must be running on different ports
- Check CORS settings in `server/src/index.js`

### Login Not Working
- Verify `npm run db:seed` was executed (creates demo users)
- Check browser console for API errors
- Ensure backend is running on port 5000

---

## 📖 Frontend Features

### Pages Available
- **Dashboard** - Overview, stats, course cards
- **My Courses** - Enrolled courses
- **Browse Courses** - Find and enroll in new courses
- **Lessons** - Video content area
- **Quizzes** - Assessment module
- **Assignments** - Submission area
- **Progress** - Learning analytics
- **Settings** - Profile & preferences
- **Calendar** - Schedule view

### Authentication Features
- ✅ Login with email/password
- ✅ Role-based UI (Student, Teacher, Admin)
- ✅ Logout functionality
- ✅ Session persistence
- ✅ Auto-redirect on auth failure

---

## 🔄 Next Steps

### Phase 2 Implementation (Backend Needed)
- [ ] Course CRUD endpoints
- [ ] Enrollment management
- [ ] Video progress tracking
- [ ] Quiz submission & grading
- [ ] Discussion forum
- [ ] User profile updates
- [ ] Role-based permissions

### Phase 3 (Frontend Enhancements)
- [ ] Real-time course data loading
- [ ] Video player integration
- [ ] Interactive quizzes
- [ ] Discussion threads
- [ ] Progress analytics
- [ ] Mobile responsiveness
- [ ] Dark mode

---

## 📞 Support

For issues or questions:
1. Check backend logs: `npm run dev` output
2. Check browser console: F12 → Console tab
3. Verify database: `psql -d acadify`
4. Review API: `http://localhost:5000/api/health`

---

## 📝 Important Notes

- **Security**: Never commit `.env` file to Git (it's in `.gitignore`)
- **Passwords**: Always change `JWT_SECRET` and `COOKIE_SECRET` in production
- **Database**: Fresh `npm run db:seed` overwrites demo data
- **CORS**: Frontend on 5173, Backend on 5000 - keep these different!

---

**Happy Learning! 🎓**
