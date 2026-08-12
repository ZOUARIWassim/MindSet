# MindSet - Currently Running! 🚀

**Date**: August 12, 2026  
**Status**: ✅ LIVE AND RUNNING

## Server Status

### Backend API Server ✅
- **URL**: http://localhost:5000
- **Health Check**: http://localhost:5000/health
- **API Base**: http://localhost:5000/api
- **MongoDB**: Connected to Docker container `mongodb` (mongo:8)
- **Database**: `mindset` on `localhost:27017`
- **Process**: Running (PID: 45534, 45546)

### Frontend Web App ✅
- **URL**: http://localhost:3000
- **Framework**: React 18 + TypeScript + Vite
- **Process**: Running (PID: 45764)
- **Status**: Serving and hot-reloading enabled

## Quick Access

**Open MindSet App**: http://localhost:3000

Click the link above or paste it in your browser to access your app!

## Configuration Summary

### Backend Environment
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindset
JWT_SECRET=1e7885352bd58ac80c080549d3b76051560d19aed12907b84db811c6d24b6ea6e8c2ac637046dee0b81e8c32b7a4515ee0ffec5b1ee919bf1c05e52c371d0281
NODE_ENV=development
```

### MongoDB Docker Container
- **Container Name**: mongodb
- **Image**: mongo:8 (version 8.2.12)
- **Port**: 27017
- **Status**: Running

## What You Can Do Now

1. **Create an Account**
   - Go to http://localhost:3000/signup
   - Fill in your name, email, and password
   - Optionally add your goals

2. **Add Habits**
   - Click "+ Add New Habit"
   - Choose from categories: Spiritual, Workout, Nutrition, Personal
   - Set habit type (checkbox, numeric, duration, text)

3. **Track Your Progress**
   - Check off habits as you complete them
   - Watch your daily completion percentage
   - Build consistency day by day

4. **Quick Start with Templates**
   - Use the API to initialize default habits:
   ```bash
   # After login, get your token and run:
   curl -X POST http://localhost:5000/api/templates/initialize \
     -H "Authorization: Bearer YOUR_TOKEN"
   ```

## API Endpoints Available

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login
- `GET /api/auth/me` - Get profile
- `PUT /api/auth/profile` - Update profile

### Habits
- `GET /api/habits` - Get all habits
- `POST /api/habits` - Create habit
- `PUT /api/habits/:id` - Update habit
- `DELETE /api/habits/:id` - Delete habit
- `POST /api/habits/:id/entries` - Log completion
- `GET /api/habits/entries/today` - Today's entries
- `GET /api/habits/:id/stats` - Get statistics

### Templates
- `GET /api/templates` - List all templates
- `POST /api/templates/initialize` - Create default habits
- `POST /api/templates/create` - Create from selected templates

## Stopping the Servers

When you're done working:

```bash
# Find the process IDs
ps aux | grep -E "ts-node-dev|vite" | grep -v grep

# Kill backend
pkill -f "ts-node-dev"

# Kill frontend
pkill -f "vite"

# Or kill by PID
kill 45534 45546 45764
```

## Restarting the Servers

### Terminal 1 - Backend:
```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset/backend
npm run dev
```

### Terminal 2 - Frontend:
```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset/frontend
npm run dev
```

## Logs Location

- **Backend Logs**: `/tmp/mindset-backend.log`
- **Frontend Logs**: `/tmp/mindset-frontend.log`

View logs in real-time:
```bash
# Backend
tail -f /tmp/mindset-backend.log

# Frontend
tail -f /tmp/mindset-frontend.log
```

## Troubleshooting

### "Port already in use" error
```bash
# Find what's using the port
lsof -i :5000  # Backend
lsof -i :3000  # Frontend

# Kill the process
kill <PID>
```

### MongoDB connection failed
```bash
# Check Docker container is running
docker ps | grep mongo

# Restart if needed
docker restart mongodb
```

### Frontend can't reach backend
- Verify backend is running: `curl http://localhost:5000/health`
- Check `.env` in frontend has correct API URL
- Clear browser cache (Ctrl+Shift+R)

## Performance Tips

- Frontend has hot-reload - changes appear instantly
- Backend auto-restarts on file changes (ts-node-dev)
- MongoDB indexes are optimized for queries
- API responses are fast with proper indexing

## What's Working

✅ User authentication (signup, login, logout)
✅ JWT token management
✅ Habit creation and management
✅ Daily habit tracking with checkboxes
✅ Category-based organization
✅ Real-time updates (auto-save on check)
✅ Persistent data storage
✅ MongoDB Docker connection
✅ API endpoints all functional
✅ Frontend-backend integration
✅ Protected routes
✅ Statistics calculation (backend ready)

## Next Development Steps

When you're ready to continue building:

1. **Add Analytics Dashboard** - Visualize streaks and progress
2. **Workout Logging** - Track exercises, sets, reps
3. **Nutrition Tracking** - Log meals and macros
4. **Habit Editing UI** - Edit existing habits
5. **Date Picker** - Log past entries
6. **Streak Display** - Show current streaks on dashboard

---

**Your MindSet app is fully operational!** 🎉

Start building your discipline journey at: **http://localhost:3000**
