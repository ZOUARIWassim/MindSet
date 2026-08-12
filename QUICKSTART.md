# MindSet - Quick Start Guide

Get MindSet running in 5 minutes!

## Step 1: Install Node.js

```bash
# Check if Node.js is already installed
node --version

# If not installed, install Node.js 20:
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Verify
node --version  # Should show v20.x
npm --version   # Should show 10.x
```

## Step 2: Install MongoDB

### Option A: Local MongoDB (Quick)
```bash
sudo apt-get install -y mongodb
sudo systemctl start mongodb
sudo systemctl enable mongodb
```

### Option B: MongoDB Atlas (Recommended)
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free
3. Create a cluster
4. Get connection string (something like: `mongodb+srv://username:password@cluster.mongodb.net/mindset`)

## Step 3: Setup Backend

```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env file (use nano, vim, or any editor)
nano .env
```

Edit the `.env` file to look like this:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/mindset
JWT_SECRET=my_super_secret_jwt_key_12345678
NODE_ENV=development
```

**Important**: Replace `JWT_SECRET` with a secure random string!

Generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
```

## Step 4: Setup Frontend

```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset/frontend

# Install dependencies
npm install

# Create .env file (uses default backend URL)
echo "VITE_API_URL=http://localhost:5000/api" > .env
```

## Step 5: Run the Application

Open **TWO terminal windows**:

### Terminal 1 - Backend:
```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset/backend
npm run dev
```

Wait for:
```
✅ MongoDB connected successfully
🚀 Server running on port 5000
```

### Terminal 2 - Frontend:
```bash
cd /home/wassim/Desktop/Wassim_Zephyrus/mindset/frontend
npm run dev
```

Wait for:
```
➜  Local:   http://localhost:3000/
```

## Step 6: Open Your Browser

Navigate to: **http://localhost:3000**

You should see the MindSet login page!

## Step 7: Create Your Account

1. Click "Sign up"
2. Fill in your details:
   - Name
   - Email
   - Password (minimum 6 characters)
   - Goals (optional)
3. Click "Sign Up"
4. You'll be automatically logged in!

## Step 8: Start Tracking!

- ✅ Mark your daily prayers
- ✅ Track your Quran reading
- ✅ Log your work/study hours
- ✅ Monitor your exercise
- ✅ Track healthy eating
- ✅ Monitor sleep

---

## Troubleshooting

### "npm: command not found"
→ Node.js is not installed. Go back to Step 1.

### "MongoDB connection failed"
→ MongoDB is not running. Run: `sudo systemctl start mongodb`

### "Port 5000 already in use"
→ Another app is using port 5000. Change PORT in backend/.env to 5001

### Frontend shows connection error
→ Make sure backend is running first

### "Cannot find module" errors
→ Run `npm install` again in the directory showing the error

---

## Need Help?

Check the full README.md for detailed documentation, or the backend/README.md and frontend/README.md for specific component documentation.

---

**You're ready to build your MindSet!** 🚀
