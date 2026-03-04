# SHMS Backend Setup Guide

## Quick Start

### 1. Create Virtual Environment
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies
```bash
pip install -r requirements.txt
```

### 3. Run the Server
```bash
python run.py
```

The API will be available at `http://localhost:5000`

## API Documentation

### Authentication Endpoints

#### Register
- **Endpoint:** `POST /api/auth/register`
- **Body:**
  ```json
  {
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123",
    "full_name": "Test User",
    "age": 30,
    "gender": "Male"
  }
  ```
- **Response:** User object + JWT access token

#### Login
- **Endpoint:** `POST /api/auth/login`
- **Body:**
  ```json
  {
    "username": "testuser",
    "password": "password123"
  }
  ```
- **Response:** User object + JWT access token

### Health Data Endpoints (Requires Authentication)

#### Add Health Data
- **Endpoint:** `POST /api/health/add`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "heart_rate": 75,
    "temperature": 37.5,
    "notes": "Optional notes"
  }
  ```
- **Response:** Health data object + any triggered alerts

#### Get Latest Health Data
- **Endpoint:** `GET /api/health/latest`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Latest health data object

#### Get Health History
- **Endpoint:** `GET /api/health/history?days=7`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `days` (1, 7, 30, 90)
- **Response:** Array of health data objects

#### Get Health Statistics
- **Endpoint:** `GET /api/health/stats?days=7`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `days` (1, 7, 30, 90)
- **Response:** Statistics object with avg, min, max values

### User Profile Endpoints

#### Get Profile
- **Endpoint:** `GET /api/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** User object with all profile data

#### Update Profile
- **Endpoint:** `PUT /api/users/profile`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "full_name": "Updated Name",
    "age": 31,
    "gender": "Male",
    "medical_conditions": "Optional medical history"
  }
  ```

### Threshold Settings Endpoints

#### Get Thresholds
- **Endpoint:** `GET /api/users/thresholds`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Threshold settings object

#### Update Thresholds
- **Endpoint:** `PUT /api/users/thresholds`
- **Headers:** `Authorization: Bearer <token>`
- **Body:**
  ```json
  {
    "high_heart_rate": 100,
    "low_heart_rate": 60,
    "high_temperature": 38.0,
    "low_temperature": 36.0
  }
  ```

### Alert Endpoints

#### Get Alerts
- **Endpoint:** `GET /api/alerts/list?unread_only=false`
- **Headers:** `Authorization: Bearer <token>`
- **Query Params:** `unread_only` (true/false)
- **Response:** Array of alert objects

#### Mark Alert as Read
- **Endpoint:** `PUT /api/alerts/<alert_id>/read`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Updated alert object

#### Mark All Alerts as Read
- **Endpoint:** `PUT /api/alerts/read-all`
- **Headers:** `Authorization: Bearer <token>`
- **Response:** Success message

## Database Models

### User
```python
- id (Integer, Primary Key)
- username (String, Unique)
- email (String, Unique)
- password_hash (String)
- full_name (String)
- age (Integer)
- gender (String)
- medical_conditions (Text)
- created_at (DateTime)
- updated_at (DateTime)
```

### HealthData
```python
- id (Integer, Primary Key)
- user_id (Integer, Foreign Key)
- heart_rate (Float)
- temperature (Float)
- recorded_at (DateTime)
- notes (Text)
```

### Alert
```python
- id (Integer, Primary Key)
- user_id (Integer, Foreign Key)
- alert_type (String)
- message (String)
- health_data_id (Integer, Foreign Key)
- is_read (Boolean)
- created_at (DateTime)
```

### ThresholdSettings
```python
- id (Integer, Primary Key)
- user_id (Integer, Foreign Key)
- high_heart_rate (Float)
- low_heart_rate (Float)
- high_temperature (Float)
- low_temperature (Float)
- updated_at (DateTime)
```

## Alert Types

- `high_heart_rate` - Heart rate exceeds high threshold
- `low_heart_rate` - Heart rate falls below low threshold
- `high_temperature` - Temperature exceeds high threshold
- `low_temperature` - Temperature falls below low threshold

## Configuration

The Flask app can be configured in `app/__init__.py`:

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shms.db'
app.config['JWT_SECRET_KEY'] = 'your-secret-key'
app.config['JWT_ACCESS_TOKEN_EXPIRES'] = timedelta(days=30)
```

For production, set the `JWT_SECRET_KEY` environment variable:
```bash
export JWT_SECRET_KEY=your-production-secret-key
```

## Running Tests

To test the API manually:
1. Use the provided `iot-simulator.py` for automated testing
2. Or use a tool like Postman/Insomnia for manual testing

## Deployment

For production deployment:
1. Install a production WSGI server (e.g., Gunicorn)
2. Change `debug=False` in `run.py`
3. Set strong `JWT_SECRET_KEY`
4. Use PostgreSQL instead of SQLite
5. Enable HTTPS
6. Set appropriate CORS origins

## Troubleshooting

### Database locked error
Delete `shms.db` and restart the application. The database will be recreated.

### JWT token expired
Tokens expire after 30 days by default. User needs to login again.

### CORS errors
Ensure Flask-CORS is properly initialized in `__init__.py`.
