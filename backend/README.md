# MindSet Backend API

Backend API for MindSet - Life Discipline Tracker

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- npm or yarn

## Installation

1. **Install Node.js** (if not already installed):
   ```bash
   # Using NodeSource repository
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   
   # Verify installation
   node --version
   npm --version
   ```

2. **Install dependencies**:
   ```bash
   cd backend
   npm install
   ```

3. **Set up environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and update the values:
   - `MONGODB_URI`: Your MongoDB connection string
   - `JWT_SECRET`: A secure random string for JWT tokens
   - `PORT`: Server port (default: 5000)

4. **Install and run MongoDB** (if using local MongoDB):
   ```bash
   # Install MongoDB
   sudo apt-get install -y mongodb
   
   # Start MongoDB service
   sudo systemctl start mongodb
   sudo systemctl enable mongodb
   ```

## Running the Server

### Development mode (with auto-reload):
```bash
npm run dev
```

### Production mode:
```bash
npm run build
npm start
```

## API Endpoints

### Authentication

#### POST `/api/auth/signup`
Register a new user
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "goals": "Get fit and disciplined"
}
```

#### POST `/api/auth/login`
Login user
```json
{
  "email": "john@example.com",
  "password": "password123"
}
```

#### GET `/api/auth/me`
Get current user profile (requires auth token)

Headers: `Authorization: Bearer <token>`

#### PUT `/api/auth/profile`
Update user profile (requires auth token)

Headers: `Authorization: Bearer <token>`
```json
{
  "name": "John Updated",
  "goals": "Updated goals"
}
```

## Testing with curl

### Signup:
```bash
curl -X POST http://localhost:5000/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"test123"}'
```

### Login:
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"test123"}'
```

### Get Profile (replace TOKEN with your JWT):
```bash
curl -X GET http://localhost:5000/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

## Project Structure

```
backend/
├── src/
│   ├── config/          # Configuration files
│   │   └── database.ts  # MongoDB connection
│   ├── controllers/     # Route controllers
│   │   └── authController.ts
│   ├── middleware/      # Express middleware
│   │   ├── auth.ts      # JWT authentication
│   │   └── errorHandler.ts
│   ├── models/          # MongoDB models
│   │   └── User.ts
│   ├── routes/          # API routes
│   │   └── auth.ts
│   ├── types/           # TypeScript types
│   │   └── index.ts
│   └── server.ts        # Entry point
├── package.json
├── tsconfig.json
└── .env
```

## Next Steps

- Add Habit tracking models and routes
- Implement Workout tracking
- Add Nutrition tracking
- Create Dashboard aggregation service
- Build Analytics endpoints
