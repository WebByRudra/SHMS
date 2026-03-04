import requests
import random
import time
from datetime import datetime

API_BASE_URL = 'http://localhost:5001/api'
AUTH_TOKEN = None

def register_test_user():
    """Register a test user"""
    global AUTH_TOKEN
    
    response = requests.post(f'{API_BASE_URL}/auth/register', json={
        'username': 'testuser',
        'email': 'test@example.com',
        'password': 'testpass123',
        'full_name': 'Test User',
        'age': 30,
        'gender': 'Male'
    })
    
    if response.status_code == 201:
        AUTH_TOKEN = response.json()['access_token']
        print(f"✓ Test user registered: {response.json()['user']['username']}")
        return True
    elif response.status_code == 409:
        # User already exists, try to login
        response = requests.post(f'{API_BASE_URL}/auth/login', json={
            'username': 'testuser',
            'password': 'testpass123'
        })
        if response.status_code == 200:
            AUTH_TOKEN = response.json()['access_token']
            print("✓ Logged in with existing test user")
            return True
    
    print(f"✗ Failed to register/login: {response.status_code}")
    return False

def send_health_data():
    """Send simulated health data"""
    global AUTH_TOKEN
    
    if not AUTH_TOKEN:
        print("Not authenticated")
        return False
    
    # Simulate sensor readings with some randomness
    heart_rate = random.gauss(75, 10)  # Average 75 bpm, std dev 10
    temperature = random.gauss(37.0, 0.3)  # Average 37°C, std dev 0.3
    
    heart_rate = max(60, min(150, heart_rate))  # Clamp between 60-150
    temperature = max(35, min(40, temperature))  # Clamp between 35-40
    
    headers = {'Authorization': f'Bearer {AUTH_TOKEN}'}
    
    response = requests.post(f'{API_BASE_URL}/health/add', json={
        'heart_rate': round(heart_rate, 2),
        'temperature': round(temperature, 2),
        'notes': 'Simulated sensor reading'
    }, headers=headers)
    
    if response.status_code == 201:
        data = response.json()
        print(f"[{datetime.now().strftime('%H:%M:%S')}] ♥ HR: {data['health_data']['heart_rate']} bpm | 🌡 Temp: {data['health_data']['temperature']}°C", end='')
        
        if data['alerts_created']:
            print(f" | ⚠ {len(data['alerts_created'])} alert(s)", end='')
        print()
        
        return True
    else:
        print(f"✗ Failed to send data: {response.status_code}")
        return False

def get_stats():
    """Get health statistics"""
    global AUTH_TOKEN
    
    if not AUTH_TOKEN:
        return False
    
    headers = {'Authorization': f'Bearer {AUTH_TOKEN}'}
    
    response = requests.get(f'{API_BASE_URL}/health/stats?days=1', headers=headers)
    
    if response.status_code == 200:
        stats = response.json()
        print("\n=== Daily Statistics ===")
        print(f"Heart Rate - Avg: {stats['heart_rate']['average']:.1f}, Min: {stats['heart_rate']['min']:.1f}, Max: {stats['heart_rate']['max']:.1f}")
        print(f"Temperature - Avg: {stats['temperature']['average']:.2f}°C, Min: {stats['temperature']['min']:.2f}°C, Max: {stats['temperature']['max']:.2f}°C")
        print(f"Total readings: {stats['heart_rate']['readings_count']}")
        return True
    
    return False

def get_alerts():
    """Get recent alerts"""
    global AUTH_TOKEN
    
    if not AUTH_TOKEN:
        return False
    
    headers = {'Authorization': f'Bearer {AUTH_TOKEN}'}
    
    response = requests.get(f'{API_BASE_URL}/alerts/list', headers=headers)
    
    if response.status_code == 200:
        alerts = response.json()
        if alerts:
            print("\n=== Recent Alerts ===")
            for alert in alerts[:5]:  # Show last 5
                status = "✓" if alert['is_read'] else "!"
                print(f"{status} {alert['message']}")
        return True
    
    return False

def main():
    print("=== SHMS IoT Simulator ===\n")
    
    # Setup
    print("1. Setting up test user...")
    if not register_test_user():
        return
    
    print("\n2. Starting sensor simulation (sending data every 5 seconds)...")
    print("   Press Ctrl+C to stop\n")
    
    try:
        counter = 0
        while True:
            send_health_data()
            counter += 1
            
            # Show stats and alerts every 10 readings
            if counter % 10 == 0:
                get_stats()
                get_alerts()
                print()
            
            time.sleep(5)  # Send data every 5 seconds
    
    except KeyboardInterrupt:
        print("\n\n✓ Simulator stopped")
        get_stats()
        get_alerts()

if __name__ == '__main__':
    main()
