# 🚀 IAS Blog Application - Setup & Troubleshooting Guide

## ✅ Current Status

- ✅ Backend running on `http://localhost:8000`
- ✅ Frontend running on `http://localhost:5173`
- ✅ MongoDB connected
- ✅ Sample data added
- ✅ Admin user created
- ⚠️ Google OAuth needs configuration

---

## 🔐 Login Credentials

### Admin Account
```
📧 Email:    admin@iasuuwu.com
🔑 Password: passwordadmin
```

### Sample Users
```
📧 john@example.com        Password: Password123!
📧 sarah@example.com       Password: SecurePass456!
📧 mike@example.com        Password: AdminPass789!
📧 emma@example.com        Password: Emma2025@
```

---

## 🐛 Common Issues & Solutions

### Issue 1: CORS Error (Fixed ✅)
**Error**: `Access to XMLHttpRequest... has been blocked by CORS policy`

**Solution**: CORS is now configured for localhost:
- Backend sends `Access-Control-Allow-Origin: http://localhost:5173`
- All methods and headers are allowed

### Issue 2: Google OAuth Not Working
**Error**: `The given origin is not allowed for the given client ID`

**Reason**: Current Google Client ID is configured for a different domain

**Solutions**:

#### Option A: Use Google OAuth with New Configuration (Recommended for Production)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials for your domain
3. Add authorized redirect URIs:
   - `http://localhost:5173` (for development)
   - `https://your-domain.com` (for production)
4. Update `VITE_GOOGLE_CLIENT_ID` in `.env`

#### Option B: Use Email/Password Login (For Now)
- ✅ Fully functional
- All features work perfectly
- Google button will show error (handled gracefully)
- Users can still login with email and password

#### Option C: Register New Google App for Localhost
1. Create new Google Project
2. Add OAuth consent screen
3. Create OAuth 2.0 Web Application credentials
4. Add `http://localhost:5173` as authorized origin
5. Use new Client ID

---

## 🛠️ Running the Application

### Terminal 1: Start Backend
```bash
cd my-project-backend
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000
```

### Terminal 2: Start Frontend
```bash
cd my-project
npm run dev
```

### Terminal 3 (Optional): Monitor Logs
```bash
tail -f backend.log  # Unix/Mac
Get-Content -Tail 20 -Wait backend.log  # Windows
```

---

## 📊 Testing the Application

### 1. Home Page
- ✅ Articles display correctly
- ✅ Featured articles shown
- ✅ Metrics displayed
- ✅ All components render

### 2. Authentication
```bash
# Test Login
1. Go to http://localhost:5173/login
2. Use: admin@iasuuwu.com / passwordadmin
3. Should redirect to dashboard

# Test Registration
1. Go to http://localhost:5173/register
2. Create new account
3. Should auto-login after registration
```

### 3. Articles
```bash
# View Articles
1. Articles load on home page
2. Click article to read full content
3. Like button works
4. View count increments

# Submit Article (Need to login first)
1. Go to http://localhost:5173/submit
2. Fill form and submit
3. Article appears in your dashboard as "pending"
```

### 4. Admin Dashboard
```bash
# Access Dashboard
1. Login as admin@iasuuwu.com / passwordadmin
2. Go to http://localhost:5173/admin
3. View stats and manage content
```

---

## 🔧 API Endpoints (for testing)

```bash
# Health Check
curl http://localhost:8000/health/

# Get Articles
curl http://localhost:8000/articles/?status=approved&limit=10

# Login
curl -X POST http://localhost:8000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@iasuuwu.com","password":"passwordadmin"}'

# Get Current User (requires token)
curl -H "Authorization: Bearer YOUR_TOKEN" \
  http://localhost:8000/api/auth/me
```

---

## 📝 Database Scripts

### Add Sample Data
```bash
python -c "import asyncio; from add_sample_data import add_sample_data; asyncio.run(add_sample_data())"
```

### Add Admin User
```bash
python -c "import asyncio; from add_admin_user import add_admin_user; asyncio.run(add_admin_user())"
```

### Create Custom User
Create a new script similar to `add_admin_user.py` to add more users:

```python
admin_doc = {
    "email": "your@email.com",
    "full_name": "Your Name",
    "hashed_password": get_password_hash("yourpassword"),
    "is_active": True,
    "is_superuser": False,  # True for admin
    "created_at": datetime.utcnow(),
}
result = await db[settings.users_collection].insert_one(admin_doc)
```

---

## 🚀 Deployment Checklist

- [ ] Google OAuth configured for production domain
- [ ] Environment variables set on Render/hosting
- [ ] Database backups configured
- [ ] HTTPS enabled on frontend and backend
- [ ] Frontend built with `npm run build`
- [ ] Backend deployed without `--reload` flag
- [ ] Monitoring and logging set up
- [ ] Error tracking configured (Sentry)

---

## 📱 Frontend Features

- ✅ Home page with featured articles
- ✅ Article browsing and filtering by category
- ✅ Search functionality
- ✅ User authentication (register/login)
- ✅ Article submission by users
- ✅ Admin dashboard
- ✅ Like button for articles
- ✅ Article view count
- ✅ Responsive design
- ⚠️ Google OAuth (needs configuration for your domain)

---

## 🔌 Backend Features

- ✅ User authentication with JWT
- ✅ Article CRUD operations
- ✅ Comment system
- ✅ Admin controls
- ✅ File uploads with Cloudinary
- ✅ Metrics and statistics
- ✅ Google OAuth integration
- ✅ MongoDB integration
- ✅ CORS enabled
- ✅ Logging and error handling

---

## 📚 Project Structure

```
my-project/
├── src/
│   ├── components/       # React components
│   ├── pages/           # Page components
│   ├── context/         # React context (Auth, Toast)
│   ├── services/        # API calls
│   ├── hooks/           # Custom hooks
│   └── assets/          # Images, videos
│
my-project-backend/
├── app/
│   ├── api/
│   │   ├── routes/      # API endpoints
│   │   └── dependencies.py
│   ├── core/            # Config, security
│   ├── db/              # Database setup
│   ├── schemas/         # Pydantic models
│   └── main.py          # FastAPI app
├── add_sample_data.py    # Sample data
└── add_admin_user.py     # Admin user creation
```

---

## 🆘 Still Having Issues?

1. **Check Backend Logs**
   ```bash
   # Look for errors in terminal
   # Check CORS headers with browser DevTools
   ```

2. **Verify Connections**
   ```bash
   # Test MongoDB connection
   # Check API endpoints with curl
   ```

3. **Clear Cache**
   ```bash
   # Frontend: Ctrl+Shift+R (hard refresh)
   # Browser: Clear localStorage and cookies
   ```

4. **Restart Everything**
   ```bash
   # Kill all processes
   # Clear Python cache: find . -type d -name __pycache__ -exec rm -r {} +
   # Restart backend and frontend
   ```

---

## 🎯 Next Steps

1. ✅ **Test all features** with sample data
2. ✅ **Configure Google OAuth** for your domain
3. ✅ **Deploy to production** (Render + Vercel)
4. ✅ **Set up CI/CD** pipeline
5. ✅ **Monitor application** performance

---

**Last Updated**: January 8, 2026
**Status**: Development Ready ✅
