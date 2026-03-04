from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from app import db
from app.models import User, HealthData, Alert, ThresholdSettings
from datetime import datetime, timedelta
from sqlalchemy import and_, desc

# Blueprints
auth_bp = Blueprint('auth', __name__)
health_bp = Blueprint('health', __name__)
user_bp = Blueprint('users', __name__)
alert_bp = Blueprint('alerts', __name__)

# ==================== AUTH ROUTES ====================

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('email') or not data.get('password'):
        return jsonify({'error': 'Missing required fields'}), 400
    
    if User.query.filter_by(username=data['username']).first():
        return jsonify({'error': 'Username already exists'}), 409
    
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'error': 'Email already exists'}), 409
    
    user = User(
        username=data['username'],
        email=data['email'],
        full_name=data.get('full_name', ''),
        age=data.get('age'),
        gender=data.get('gender')
    )
    user.set_password(data['password'])
    
    db.session.add(user)
    db.session.commit()
    
    # Create default threshold settings
    thresholds = ThresholdSettings(user_id=user.id)
    db.session.add(thresholds)
    db.session.commit()
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'User registered successfully',
        'user': user.to_dict(),
        'access_token': access_token
    }), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    
    if not data or not data.get('username') or not data.get('password'):
        return jsonify({'error': 'Missing username or password'}), 400
    
    user = User.query.filter_by(username=data['username']).first()
    
    if not user or not user.check_password(data['password']):
        return jsonify({'error': 'Invalid username or password'}), 401
    
    access_token = create_access_token(identity=user.id)
    
    return jsonify({
        'message': 'Login successful',
        'user': user.to_dict(),
        'access_token': access_token
    }), 200

# ==================== HEALTH DATA ROUTES ====================

@health_bp.route('/add', methods=['POST'])
@jwt_required()
def add_health_data():
    user_id = get_jwt_identity()
    data = request.get_json()
    
    if not data or 'heart_rate' not in data or 'temperature' not in data:
        return jsonify({'error': 'Missing heart_rate or temperature'}), 400
    
    user = User.query.get(user_id)
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    health_data = HealthData(
        user_id=user_id,
        heart_rate=data['heart_rate'],
        temperature=data['temperature'],
        notes=data.get('notes', '')
    )
    
    db.session.add(health_data)
    db.session.commit()
    
    # Check thresholds and create alerts if needed
    thresholds = ThresholdSettings.query.filter_by(user_id=user_id).first()
    
    alerts_created = []
    
    if thresholds:
        if data['heart_rate'] > thresholds.high_heart_rate:
            alert = Alert(
                user_id=user_id,
                alert_type='high_heart_rate',
                message=f"High heart rate detected: {data['heart_rate']} bpm",
                health_data_id=health_data.id
            )
            db.session.add(alert)
            alerts_created.append(alert.to_dict())
        
        elif data['heart_rate'] < thresholds.low_heart_rate:
            alert = Alert(
                user_id=user_id,
                alert_type='low_heart_rate',
                message=f"Low heart rate detected: {data['heart_rate']} bpm",
                health_data_id=health_data.id
            )
            db.session.add(alert)
            alerts_created.append(alert.to_dict())
        
        if data['temperature'] > thresholds.high_temperature:
            alert = Alert(
                user_id=user_id,
                alert_type='high_temperature',
                message=f"High temperature detected: {data['temperature']}°C",
                health_data_id=health_data.id
            )
            db.session.add(alert)
            alerts_created.append(alert.to_dict())
        
        elif data['temperature'] < thresholds.low_temperature:
            alert = Alert(
                user_id=user_id,
                alert_type='low_temperature',
                message=f"Low temperature detected: {data['temperature']}°C",
                health_data_id=health_data.id
            )
            db.session.add(alert)
            alerts_created.append(alert.to_dict())
    
    db.session.commit()
    
    return jsonify({
        'message': 'Health data recorded successfully',
        'health_data': health_data.to_dict(),
        'alerts_created': alerts_created
    }), 201

@health_bp.route('/latest', methods=['GET'])
@jwt_required()
def get_latest_health_data():
    user_id = get_jwt_identity()
    
    health_data = HealthData.query.filter_by(user_id=user_id).order_by(desc(HealthData.recorded_at)).first()
    
    if not health_data:
        return jsonify({'error': 'No health data found'}), 404
    
    return jsonify(health_data.to_dict()), 200

@health_bp.route('/history', methods=['GET'])
@jwt_required()
def get_health_history():
    user_id = get_jwt_identity()
    days = request.args.get('days', 7, type=int)
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    health_data = HealthData.query.filter(
        and_(HealthData.user_id == user_id, HealthData.recorded_at >= start_date)
    ).order_by(desc(HealthData.recorded_at)).all()
    
    return jsonify([data.to_dict() for data in health_data]), 200

@health_bp.route('/stats', methods=['GET'])
@jwt_required()
def get_health_stats():
    user_id = get_jwt_identity()
    days = request.args.get('days', 7, type=int)
    
    start_date = datetime.utcnow() - timedelta(days=days)
    
    health_data = HealthData.query.filter(
        and_(HealthData.user_id == user_id, HealthData.recorded_at >= start_date)
    ).all()
    
    if not health_data:
        return jsonify({'error': 'No data available'}), 404
    
    heart_rates = [data.heart_rate for data in health_data]
    temperatures = [data.temperature for data in health_data]
    
    stats = {
        'heart_rate': {
            'average': sum(heart_rates) / len(heart_rates),
            'min': min(heart_rates),
            'max': max(heart_rates),
            'readings_count': len(heart_rates)
        },
        'temperature': {
            'average': sum(temperatures) / len(temperatures),
            'min': min(temperatures),
            'max': max(temperatures),
            'readings_count': len(temperatures)
        }
    }
    
    return jsonify(stats), 200

# ==================== USER ROUTES ====================

@user_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    return jsonify(user.to_dict()), 200

@user_bp.route('/profile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    
    if not user:
        return jsonify({'error': 'User not found'}), 404
    
    data = request.get_json()
    
    user.full_name = data.get('full_name', user.full_name)
    user.age = data.get('age', user.age)
    user.gender = data.get('gender', user.gender)
    user.medical_conditions = data.get('medical_conditions', user.medical_conditions)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Profile updated successfully',
        'user': user.to_dict()
    }), 200

@user_bp.route('/thresholds', methods=['GET'])
@jwt_required()
def get_thresholds():
    user_id = get_jwt_identity()
    thresholds = ThresholdSettings.query.filter_by(user_id=user_id).first()
    
    if not thresholds:
        return jsonify({'error': 'Thresholds not found'}), 404
    
    return jsonify(thresholds.to_dict()), 200

@user_bp.route('/thresholds', methods=['PUT'])
@jwt_required()
def update_thresholds():
    user_id = get_jwt_identity()
    thresholds = ThresholdSettings.query.filter_by(user_id=user_id).first()
    
    if not thresholds:
        return jsonify({'error': 'Thresholds not found'}), 404
    
    data = request.get_json()
    
    thresholds.high_heart_rate = data.get('high_heart_rate', thresholds.high_heart_rate)
    thresholds.low_heart_rate = data.get('low_heart_rate', thresholds.low_heart_rate)
    thresholds.high_temperature = data.get('high_temperature', thresholds.high_temperature)
    thresholds.low_temperature = data.get('low_temperature', thresholds.low_temperature)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Thresholds updated successfully',
        'thresholds': thresholds.to_dict()
    }), 200

# ==================== ALERT ROUTES ====================

@alert_bp.route('/list', methods=['GET'])
@jwt_required()
def get_alerts():
    user_id = get_jwt_identity()
    unread_only = request.args.get('unread_only', False, type=bool)
    
    query = Alert.query.filter_by(user_id=user_id)
    
    if unread_only:
        query = query.filter_by(is_read=False)
    
    alerts = query.order_by(desc(Alert.created_at)).all()
    
    return jsonify([alert.to_dict() for alert in alerts]), 200

@alert_bp.route('/<int:alert_id>/read', methods=['PUT'])
@jwt_required()
def mark_alert_as_read(alert_id):
    user_id = get_jwt_identity()
    alert = Alert.query.filter_by(id=alert_id, user_id=user_id).first()
    
    if not alert:
        return jsonify({'error': 'Alert not found'}), 404
    
    alert.is_read = True
    db.session.commit()
    
    return jsonify({
        'message': 'Alert marked as read',
        'alert': alert.to_dict()
    }), 200

@alert_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_alerts_as_read():
    user_id = get_jwt_identity()
    
    Alert.query.filter_by(user_id=user_id, is_read=False).update({'is_read': True})
    db.session.commit()
    
    return jsonify({'message': 'All alerts marked as read'}), 200
