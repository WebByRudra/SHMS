# SHMS Complete Setup Guide

## System Requirements

- **Python 3.8+** for backend
- **Node.js 14+** and **npm 6+** for frontend
- 500MB disk space minimum

## Quick Start (All Platforms)

The application has three main components:

1. **Backend API** (Flask) - Port 5000
2. **Frontend** (React) - Port 3000
3. **IoT Simulator** (Python) - For testing

## Setup Instructions

### Option 1: Automated Setup (Windows)

If you're on Windows, simply run:
```bash
start.bat
```

This will automatically:
- Set up the Python virtual environment
- Install all backend dependencies
- Install all frontend dependencies
- Start both backend and frontend servers

### Option 2: Manual Setup (All Platforms)

#### Step 1: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask server
python run.py
```

✓ Backend running on: `http://localhost:5000`

#### Step 2: Frontend Setup

In a **new terminal** window:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start React development server
npm start
```

✓ Frontend running on: `http://localhost:3000`

#### Step 3: IoT Simulator (Optional, for Testing)

In a **third terminal** window:

```bash
# Navigate to simulator directory
cd iot-simulator

# Install requests library (if not already installed)
pip install requests

# Run the simulator
python simulator.py
```

✓ Simulator will auto-register a test user and send health data

## First Run Walkthrough

### 1. Access the Application

Open your browser and go to: `http://localhost:3000`

You'll see the login page.

### 2. Create an Account

- Click "Register here"
- Fill in the form:
  - Username: `myuser`
  - Email: `myuser@example.com`
  - Password: `mypassword`
  - Full Name: Your name
  - Age: Your age
  - Gender: Select from dropdown
- Click "Register"

You'll be logged in automatically and redirected to the dashboard.

### 3. Test with IoT Simulator

- Make sure the simulator is running (from Step 3 above)
- Go back to the browser and refresh the dashboard
- You'll see:
  - Latest heart rate and temperature readings
  - Any triggered alerts
  - System is working! ✓

### 4. Explore Features

#### Dashboard
- View latest health readings
- See unread alerts
- Quick health status overview

#### Health History
- View all health recordings
- Filter by time period (1, 7, 30, 90 days)
- See notes for each reading

#### Statistics
- View health statistics
- Min/max/average values
- Reading counts

#### Alerts
- See all generated alerts
- Mark alerts as read
- Filter unread alerts only

#### Profile
- View and edit user information
- Add medical conditions
- Update personal details

#### Settings
- Customize alert thresholds
- Set heart rate limits (bpm)
- Set temperature limits (°C)
- Reference guidelines included

## Configuration

### Change API URL (if needed)

If your backend is running on a different URL, create a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://your-api-url:5000/api
```

Then restart the frontend server.

### Backend Configuration

Edit `backend/app/__init__.py` to change:
- Database URL
- JWT secret key
- Token expiration time

For production, set the `JWT_SECRET_KEY` environment variable.

## Troubleshooting

### Issue: "Port 5000/3000 already in use"

**Solution:** Kill the process using the port or change the port in the respective files.

**For Windows:**
```bash
# Kill process on port 5000
netstat -ano | findstr :5000
taskkill /PID <PID> /F

# Or use different port
# Change port 5000 in backend/run.py
# Change port 3000 in frontend package.json
```

**For macOS/Linux:**
```bash
kill -9 $(lsof -t -i :5000)
kill -9 $(lsof -t -i :3000)
```

### Issue: "Module not found" errors

**Solution:** Reinstall dependencies

```bash
# Backend
cd backend
pip install --upgrade -r requirements.txt

# Frontend
cd frontend
npm install
npm cache clean --force
npm install
```

### Issue: "Can't connect to backend"

1. Check if Flask is running: `http://localhost:5000`
2. Check browser console (F12) for CORS errors
3. Restart both backend and frontend

### Issue: "Database locked"

**Solution:** The SQLite database is being used by another process.

```bash
# Delete the database file
cd backend/app
rm shms.db  # or del shms.db on Windows
# Restart backend - database will be recreated
```

### Issue: Simulator fails to connect

1. Check backend is running
2. Run simulator from the iot-simulator directory
3. Check if test user credentials are correct in simulator.py

## Development Tips

### Hot Reload
- Frontend changes auto-reload in browser
- Backend changes require restart

### Database Reset
To start fresh:
```bash
rm backend/app/shms.db
# Restart backend
python run.py
```

### API Testing
Use tools like:
- Postman
- Insomnia
- cURL

Example:
```bash
# Register
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username":"test","email":"test@test.com","password":"pass","full_name":"Test User","age":30,"gender":"Male"}'
```

### Viewing Logs
- **Backend**: Logs appear in terminal running Flask
- **Frontend**: Browser console (F12)
- **Simulator**: Shows real-time data sending

## Production Deployment

### Backend (Flask)

1. Install Gunicorn:
   ```bash
   pip install gunicorn
   ```

2. Run with Gunicorn:
   ```bash
   gunicorn -w 4 -b 0.0.0.0:5000 app:create_app()
   ```

3. Set environment variables:
   ```bash
   export JWT_SECRET_KEY=<strong-secret-key>
   export FLASK_ENV=production
   ```

### Frontend (React)

1. Build the application:
   ```bash
   npm run build
   ```

2. Deploy the `build/` folder to any static hosting (Vercel, Netlify, AWS S3, etc.)

## Next Steps

1. ✅ Backend and Frontend are running
2. ✅ Test with IoT Simulator
3. 📱 Explore all features
4. ⚙️ Customize thresholds to your needs
5. 📊 Add your own health monitoring devices
6. 🚀 Deploy to production

## Support & Documentation

- See `README.md` for project overview
- See `backend/README.md` for API documentation
- See `frontend/README.md` for frontend details

## Common Port Issues

If ports are already in use, you can change them:

**Backend:**
Edit `backend/run.py`:
```python
app.run(debug=True, host='0.0.0.0', port=5001)  # Change 5000 to 5001
```

**Frontend:**
Edit `frontend/package.json`:
```json
"start": "PORT=3001 react-scripts start"
```

Then update `REACT_APP_API_URL` in `.env` if needed.

## Getting Help

1. **Check error messages** in browser console (F12) and terminal
2. **Verify services are running**:
   - Backend: `http://localhost:5000`
   - Frontend: `http://localhost:3000`
3. **Restart services** - often solves issues
4. **Clear browser cache** - Ctrl+Shift+Del (Chrome)
5. **Delete node_modules and reinstall** - `npm install`
