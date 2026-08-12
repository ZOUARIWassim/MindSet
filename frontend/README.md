# MindSet Frontend

Frontend web application for MindSet - Life Discipline Tracker

## Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## Installation

1. **Install dependencies**:
   ```bash
   cd frontend
   npm install
   ```

2. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   The `.env` file should contain:
   ```
   VITE_API_URL=http://localhost:5000/api
   ```

## Running the Application

### Development mode (with hot reload):
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build for production:
```bash
npm run build
```

### Preview production build:
```bash
npm run preview
```

## Features

### Authentication
- User registration with email/password
- Secure login with JWT tokens
- Protected routes
- User profile management

### Dashboard (MVP)
- Today's progress overview
- Spiritual habits checklist (5 daily prayers, Quran reading)
- Daily habits tracker (work/study, exercise, diet, sleep)
- Quick stats display

### Coming Soon
- Full custom habit tracking system
- Workout logging and progress tracking
- Nutrition tracking with calorie/macro counting
- Analytics dashboard with charts
- Streak tracking and achievements
- AI-powered recommendations

## Project Structure

```
frontend/
├── public/              # Static assets
├── src/
│   ├── components/      # Reusable UI components
│   │   └── ProtectedRoute.tsx
│   ├── contexts/        # React context providers
│   │   └── AuthContext.tsx
│   ├── pages/           # Page components
│   │   ├── Login.tsx
│   │   ├── Signup.tsx
│   │   └── Dashboard.tsx
│   ├── services/        # API service layer
│   │   ├── api.ts
│   │   └── authService.ts
│   ├── types/           # TypeScript type definitions
│   │   └── index.ts
│   ├── App.tsx          # Main app component
│   ├── main.tsx         # Entry point
│   └── index.css        # Global styles
├── index.html
├── package.json
├── tsconfig.json
├── vite.config.ts
└── tailwind.config.js
```

## Tech Stack

- **React 18** - UI library
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework
- **Recharts** - Charts and data visualization (ready for analytics)

## API Integration

The frontend communicates with the backend API at `http://localhost:5000/api` (configurable via `.env`).

All authenticated requests automatically include the JWT token from localStorage.

## Development Tips

- Make sure the backend server is running before starting the frontend
- JWT tokens are stored in localStorage
- Protected routes automatically redirect to login if not authenticated
- API responses with 401 status automatically log out the user
