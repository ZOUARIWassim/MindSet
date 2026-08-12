# MindSet - Life Discipline Tracker

A comprehensive web application designed to help you maintain discipline across all areas of life, including:
- 🏋️ Physical fitness and workout tracking
- 🥗 Nutrition and meal logging
- 🕌 Spiritual practices (prayers, Quran reading)
- 💼 Work and study habits
- 📊 Progress analytics and insights
- 🎯 Custom habit tracking

Built with modern technologies and designed with AI integration in mind for future intelligent recommendations.

## Project Structure

```
mindset/
├── backend/          # Node.js + Express + MongoDB API
│   ├── src/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── server.ts
│   └── package.json
├── frontend/         # React + TypeScript + Tailwind CSS
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── contexts/
│   │   ├── services/
│   │   └── App.tsx
│   └── package.json
└── README.md
```

## Tech Stack

### Backend
- **Node.js** with **Express** - RESTful API server
- **TypeScript** - Type safety and better developer experience
- **MongoDB** with **Mongoose** - Flexible NoSQL database
- **JWT** - Secure authentication
- **Bcrypt** - Password hashing

### Frontend
- **React 18** - Modern UI library
- **TypeScript** - Type-safe frontend code
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first styling
- **Recharts** - Data visualization (for analytics)

## Prerequisites

Before you begin, ensure you have the following installed:

1. **Node.js** (v18 or higher)
2. **npm** (comes with Node.js)
3. **MongoDB** (local installation or MongoDB Atlas account)
4. **Git** (for version control)

### Installing Node.js

If Node.js is not installed, choose one of these methods:

#### Option 1: Using NodeSource (Recommended for Ubuntu/Debian)
```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs
```

#### Option 2: Using NVM (Node Version Manager)
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 20
nvm use 20
```

#### Option 3: Using system package manager
```bash
sudo apt update
sudo apt install nodejs npm
```

Verify installation:
```bash
node --version  # Should show v18.x or higher
npm --version   # Should show 9.x or higher
```

### Installing MongoDB

#### Option 1: Local MongoDB (Ubuntu)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

#### Option 2: MongoDB Atlas (Cloud - Recommended)
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster
4. Get your connection string
5. Use it in your `.env` file

## Installation & Setup

### 1. Clone or navigate to the project
```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env and configure:
# - MONGODB_URI (your MongoDB connection string)
# - JWT_SECRET (generate a secure random string)
# - PORT (default: 5000)
nano .env
```

Example `.env` configuration:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindset
JWT_SECRET=your_super_secure_random_string_here_change_this
NODE_ENV=development
```

To generate a secure JWT secret:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

### 3. Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd ../frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# The default configuration should work if backend is on port 5000
```

## Running the Application

You'll need **two terminal windows** - one for backend, one for frontend.

### Terminal 1: Start Backend Server

```bash
cd backend
npm run dev
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
📍 Health check: http://localhost:5000/health
📍 API base URL: http://localhost:5000/api
```

### Terminal 2: Start Frontend Development Server

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x ready in xxx ms

➜  Local:   http://localhost:3000/
➜  Network: use --host to expose
```

### 3. Open the Application

Open your browser and navigate to:
```
http://localhost:3000
```

You should see the MindSet login page!

## First Steps

1. **Create an account**: Click "Sign up" and register with your email
2. **Login**: Use your credentials to log in
3. **Explore the dashboard**: View the initial habit tracking interface
4. **Check spiritual habits**: Mark your daily prayers and Quran reading
5. **Track daily habits**: Monitor work/study, exercise, diet, and sleep

## Current Features (MVP)

✅ User authentication (signup/login)
✅ Secure JWT-based sessions
✅ Protected routes
✅ Dashboard with today's overview
✅ Spiritual habits checklist (5 prayers, Quran)
✅ Daily habits tracker
✅ Responsive design
✅ Clean, modern UI

## Coming Soon

🚧 Full custom habit tracking system
🚧 Detailed workout logging
🚧 Nutrition tracking with macro counting
🚧 Progress analytics with charts
🚧 Streak tracking and achievements
🚧 AI-powered insights and recommendations
🚧 Mobile app (React Native)
🚧 Push notifications
🚧 Social features and challenges

## Development Workflow

### Backend Development
```bash
cd backend
npm run dev        # Start with auto-reload
npm run build      # Compile TypeScript
npm start          # Run production build
```

### Frontend Development
```bash
cd frontend
npm run dev        # Start dev server
npm run build      # Build for production
npm run preview    # Preview production build
```

## API Testing

Test the backend API using curl:

### Health Check
```bash
curl http://localhost:5000/health
```

### Sign Up
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

## Troubleshooting

### Backend won't start
- Check MongoDB is running: `sudo systemctl status mongodb`
- Verify `.env` file exists and has correct values
- Check port 5000 is not in use: `lsof -i :5000`

### Frontend can't connect to backend
- Ensure backend is running on port 5000
- Check `.env` file in frontend has correct API URL
- Clear browser cache and localStorage

### MongoDB connection issues
- If using local MongoDB: `sudo systemctl start mongodb`
- If using Atlas: verify connection string and IP whitelist

### npm install errors
- Clear npm cache: `npm cache clean --force`
- Delete `node_modules` and `package-lock.json`, then reinstall

## Project Roadmap

### Phase 1: Foundation ✅ (Current)
- Backend API with authentication
- Frontend with React and TypeScript
- Basic dashboard UI

### Phase 2: Core Features (In Progress)
- Flexible habit tracking system
- Workout logging
- Nutrition tracking

### Phase 3: Analytics & Insights
- Progress charts and graphs
- Streak tracking
- Statistical analysis

### Phase 4: AI Integration
- Workout recommendations
- Nutrition suggestions
- Pattern recognition
- Smart reminders

### Phase 5: Mobile & Scale
- React Native mobile apps
- PWA features
- Social features
- Community challenges

## Contributing

This is a personal project, but suggestions and feedback are welcome!

## License

MIT License - Feel free to use this as inspiration for your own projects

## Author

**Wassim** - Building MindSet to achieve discipline and excellence in all areas of life

---

**Stay disciplined. Stay focused. Build your MindSet.** 💪
