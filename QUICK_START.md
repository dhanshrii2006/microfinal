# 🚀 Acadify - Quick Start

## What You Have

✅ **Acadify Learning Management System** integrated at: `e:\hii\acad\acadify\`

**Components:**
- 📱 Frontend: Modern HTML/CSS/JS student dashboard
- 📡 Backend: Express.js API with JWT authentication  
- 💾 Database: PostgreSQL with user/course schema
- 🔐 Auth: Email/password login with role-based access

---

## 30-Second Start

### 1️⃣ Install & Setup Database
```bash
cd e:\hii\acad\acadify
npm install
cd server && npm install && npm run db:migrate && npm run db:seed
cd ..
```

### 2️⃣ Start the App
```bash
npm run dev
```

### 3️⃣ Open Browser
```
http://localhost:5173
```

### 4️⃣ Login with Demo Account
```
Email: student@acadify.dev
Password: password123
```

---

## 📚 Project Structure

```
acadify/
├── server/           # Backend API (Express.js)
├── client/           # Frontend UI (Your HTML pages)
├── SETUP.md          # 📖 Complete setup guide
├── INTEGRATION_SUMMARY.md  # 📊 What was integrated
└── README.md         # Original backend guide
```

## What's Inside `client/`

✅ **15 HTML pages** with full authentication:
- `index.html` - Login page (entry point)
- `dashboard.html` - Main dashboard
- `my-courses.html` - Your courses
- `browse-courses.html` - Browse all courses
- `lesson.html` - Video lessons
- `quiz.html` - Quizzes
- `assignment.html` - Assignments
- `progress.html` - Learning analytics
- `setting.html` - Account settings
- `calendar.html` - Schedule
- `api.js` - API communication module ⭐
- `app.js` - Auth & navigation logic
- `style.css` - Styling

## What's Inside `server/`

✅ **Express.js API with:**
- JWT authentication
- 10 database tables (users, courses, videos, quizzes, etc.)
- Auth endpoints working
- CORS configured
- PostgreSQL integration

---

## 🔐 Demo Accounts

After running `npm run db:seed`, you get:

| Role | Email | Password |
|------|-------|----------|
| 👨‍🎓 Student | `student@acadify.dev` | `password123` |
| 👨‍🏫 Teacher | `teacher@acadify.dev` | `password123` |
| 👨‍💼 Admin | `admin@acadify.dev` | `password123` |

---

## ⚡ Key Features

### ✅ Working Now
- User authentication (login/logout)
- Protected pages (auto-redirect if not logged in)
- User profile display
- Role-based UI
- Clean dashboard with stats
- Sidebar navigation
- Logout functionality

### ⏳ Ready for Backend Development
- Course loading (API structure in place)
- User enrollment
- Video progress tracking
- Quiz submissions
- Assignment tracking
- Discussion forums

---

## 📖 For Detailed Instructions

See **`SETUP.md`** in `acadify/` folder for:
- Prerequisites ✓
- Database setup ✓
- Environment configuration ✓
- Troubleshooting ✓
- API documentation ✓

See **`INTEGRATION_SUMMARY.md`** for:
- What was integrated
- Architecture diagram
- Next steps for development
- Connection flow

---

## 🐛 Quick Troubleshooting

### Port Already in Use?
```bash
# Find what's using port 5000
Get-NetTCPConnection -LocalPort 5000

# Kill it (replace PID)
Stop-Process -Id <PID> -Force
```

### Database Connection Error?
```bash
# Make sure PostgreSQL is running and database exists
psql -U postgres -c "CREATE DATABASE acadify;"
```

### Can't Login?
```bash
# Run seed to create demo accounts
cd server
npm run db:seed
```

### Dependencies Missing?
```bash
npm install
cd server && npm install
cd ../client && npm install
```

---

## 📱 Frontend Pages

Each page automatically:
- ✅ Checks if user is logged in
- ✅ Redirects to login if not authenticated
- ✅ Shows user name & avatar
- ✅ Has logout button
- ✅ Has working navigation

Try logging in and:
- Click around sidebar
- See how pages load
- Try logout button  
- Notice auto-redirect when session expires

---

## 🎯 Next Steps

### Immediate (Development)
1. Run `npm run dev`
2. Test login with demo accounts
3. Explore all pages
4. Check browser console (F12) for API calls

### Short-term (Backend Features)
1. Implement course endpoints
2. Connect real course data
3. Add video player
4. Set up quiz system

### Long-term (Polish)
1. Mobile responsive design
2. Dark mode
3. Real-time notifications
4. Advanced analytics

---

## 📞 File Locations

- **Frontend Code**: `e:\hii\acad\acadify\client\`
- **Backend Code**: `e:\hii\acad\acadify\server\src\`
- **Database Setup**: `e:\hii\acad\acadify\server\src\db\`
- **Configuration**: `e:\hii\acad\acadify\server\.env`
- **Original UI Backup**: `e:\hii\acad\student\` (kept for reference)

---

**You're all set! 🎓**

Start with:
```bash
cd e:\hii\acad\acadify
npm run dev
```

Then open: `http://localhost:5173`

Enjoy! 🚀
