# SHMS Frontend Setup and Run Guide

## Quick Start

### 1. Install Dependencies
```bash
cd frontend
npm install
```

### 2. Start Development Server
```bash
npm start
```

The app will open at `http://localhost:3000`

### 3. Making sure Backend is Running
Before using the frontend, ensure the Flask backend is running:
```bash
cd backend
python run.py
```

Backend will be at `http://localhost:5000`

## Available Pages

- **Login/Register** - Authentication
- **Dashboard** - Latest health metrics and unread alerts
- **Health History** - View all health readings
- **Stats** - Health statistics and trends
- **Alerts** - All health alerts
- **Profile** - User information management
- **Settings** - Alert threshold configuration

## How to Use

### First Time
1. Navigate to `/register` to create an account
2. Fill in your details and create a password
3. You'll be logged in automatically

### Testing with Simulator
1. Start the backend and frontend
2. Register a test user or use the simulator's auto-registration
3. Run the IoT simulator:
   ```bash
   cd iot-simulator
   python simulator.py
   ```
4. Watch health data appear in real-time on the dashboard

### Customizing Alerts
1. Go to Settings page
2. Adjust the thresholds for heart rate and temperature
3. Save changes
4. Alerts will be generated based on new thresholds

## Environment Variables

If you need to change the backend URL, add a `.env` file in the frontend directory:

```
REACT_APP_API_URL=http://localhost:5000/api
```

Then restart the dev server.

## Build for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Troubleshooting

### Port 3000 already in use
If port 3000 is already in use, the dev server will ask to run on a different port.

### Can't connect to backend
- Ensure Flask backend is running on `http://localhost:5000`
- Check if CORS is enabled in the Flask app
- Check browser console for errors (F12)

### Alerts not triggering
- Make sure health data exceeds the thresholds
- Check the Settings page for current thresholds
- Verify the simulator is running and sending data

## Project Structure

```
src/
├── pages/
│   ├── Login.js
│   ├── Register.js
│   ├── Dashboard.js
│   ├── HealthHistory.js
│   ├── HealthStats.js
│   ├── Alerts.js
│   ├── Profile.js
│   └── Settings.js
├── components/
│   ├── Navbar.js
│   └── PrivateRoute.js
├── api.js          # API client
├── App.js          # Main app with routing
├── App.css         # Global styles
├── index.js        # React entry point
└── index.css       # Global CSS
```
