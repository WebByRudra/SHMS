# Smart Health Management System (SHMS)

A comprehensive health monitoring system with real-time IoT sensor data collection, alerts, and analytics.

## Project Structure

```
SHMS/
├── backend/              # Flask REST API
│   ├── app/
│   │   ├── __init__.py
│   │   ├── models.py     # Database models
│   │   └── routes.py     # API endpoints
│   ├── requirements.txt
│   └── run.py
├── frontend/             # React web application
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api.js
│   │   └── App.js
│   └── package.json
└── iot-simulator/        # IoT simulator for testing
    └── simulator.py
```

## Features

- **User Authentication**: Register, login, and manage user accounts
- **Health Monitoring**: Track heart rate and temperature in real-time
- **Alerts**: Automatic alerts when health metrics exceed defined thresholds
- **Health Statistics**: View daily, weekly, and monthly health trends
- **Customizable Thresholds**: Set personalized alert thresholds
- **Health History**: View complete health records
- **User Profile**: Manage personal health information

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Run the Flask server:
   ```bash
   python run.py
   ```

The API will be available at `http://localhost:5000`

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will open at `http://localhost:3000`

### IoT Simulator Setup

1. Navigate to the simulator directory:
   ```bash
   cd iot-simulator
   ```

2. Install dependencies:
   ```bash
   pip install requests
   ```

3. Run the simulator:
   ```bash
   python simulator.py
   ```

The simulator will:
- Create a test user (if not exists)
- Send health data every 5 seconds
- Display statistics and alerts periodically

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Health Data
- `POST /api/health/add` - Add health data reading
- `GET /api/health/latest` - Get latest health data
- `GET /api/health/history?days=7` - Get health history
- `GET /api/health/stats?days=7` - Get health statistics

### User
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update user profile
- `GET /api/users/thresholds` - Get alert thresholds
- `PUT /api/users/thresholds` - Update alert thresholds

### Alerts
- `GET /api/alerts/list` - Get user alerts
- `PUT /api/alerts/<id>/read` - Mark alert as read
- `PUT /api/alerts/read-all` - Mark all alerts as read

## Database

The system uses SQLite for local development. The database file `shms.db` is created automatically in the backend/app directory.

**Models:**
- User: Stores user account information
- HealthData: Stores health readings (heart rate, temperature)
- Alert: Stores health alerts
- ThresholdSettings: Stores customizable alert thresholds

## Default Alert Thresholds

- Heart Rate: 60-100 bpm
- Temperature: 36.0-38.0°C

These can be customized per user through the Settings page.

## Testing

1. Start the backend server
2. Start the frontend application
3. Run the IoT simulator

The simulator will automatically:
- Register a test user (`testuser`)
- Send simulated health data
- Trigger alerts when thresholds are exceeded

You can then:
- View the data in the dashboard
- Check alerts and health statistics
- Customize thresholds in settings
- Update your profile

## Technology Stack

**Backend:**
- Flask - Web framework
- Flask-SQLAlchemy - ORM
- Flask-JWT-Extended - JWT authentication
- Flask-CORS - CORS handling

**Frontend:**
- React 18+ - UI framework
- React Router - Navigation
- Axios - HTTP client
- Chart.js - Data visualization

**Database:**
- SQLite - Local database

## Future Enhancements

- [ ] Real IoT device integration
- [ ] Multiple device support
- [ ] Advanced analytics and predictions
- [ ] Mobile app
- [ ] Email/SMS notifications
- [ ] Data export (PDF, CSV)
- [ ] Doctor consultation integration
- [ ] Medication reminders

## License

This project is open source and available under the MIT License.
