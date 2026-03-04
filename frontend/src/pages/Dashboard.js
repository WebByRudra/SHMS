import React, { useState, useEffect } from 'react';
import { healthAPI, alertAPI } from '../api';

function Dashboard() {
  const [latestHealth, setLatestHealth] = useState(null);
  const [unreadAlerts, setUnreadAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    setError('');
    try {
      const [healthRes, alertsRes] = await Promise.all([
        healthAPI.getLatest(),
        alertAPI.getAlerts(true),
      ]);
      setLatestHealth(healthRes.data);
      setUnreadAlerts(alertsRes.data);
    } catch (err) {
      setError('Failed to load dashboard data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  return (
    <div className="dashboard container">
      <h1>Welcome to SHMS</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      {latestHealth && (
        <>
          <h2 style={{ marginBottom: '20px', marginTop: '30px' }}>Latest Health Data</h2>
          <div className="grid">
            <div className="stat-card">
              <div className="label">Heart Rate</div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div className="value">
                  {Math.round(latestHealth.heart_rate)}
                </div>
                <div className="unit">bpm</div>
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                Last reading: {new Date(latestHealth.recorded_at).toLocaleString()}
              </div>
            </div>

            <div className="stat-card">
              <div className="label">Temperature</div>
              <div style={{ display: 'flex', alignItems: 'baseline' }}>
                <div className="value">
                  {latestHealth.temperature.toFixed(1)}
                </div>
                <div className="unit">°C</div>
              </div>
              <div style={{ fontSize: '12px', color: '#999', marginTop: '10px' }}>
                Last reading: {new Date(latestHealth.recorded_at).toLocaleString()}
              </div>
            </div>
          </div>
        </>
      )}

      {unreadAlerts.length > 0 && (
        <>
          <h2 style={{ marginBottom: '20px', marginTop: '30px' }}>⚠ Unread Alerts ({unreadAlerts.length})</h2>
          <div style={{ maxWidth: '600px' }}>
            {unreadAlerts.slice(0, 5).map((alert) => (
              <div key={alert.id} className="alert alert-danger">
                <strong>{alert.alert_type.replace('_', ' ').toUpperCase()}</strong>
                <p style={{ margin: '5px 0 0 0', fontSize: '14px' }}>{alert.message}</p>
                <small style={{ color: '#666' }}>
                  {new Date(alert.created_at).toLocaleString()}
                </small>
              </div>
            ))}
            {unreadAlerts.length > 5 && (
              <p style={{ marginTop: '10px', color: '#666' }}>
                +{unreadAlerts.length - 5} more alerts
              </p>
            )}
          </div>
        </>
      )}

      {unreadAlerts.length === 0 && latestHealth && (
        <div style={{ marginTop: '40px', padding: '20px', textAlign: 'center', background: '#d4edda', color: '#155724', borderRadius: '8px' }}>
          ✓ No alerts! Your health metrics are within normal range.
        </div>
      )}

      <div style={{ marginTop: '40px', padding: '20px', background: '#e7f3ff', color: '#004085', borderRadius: '8px' }}>
        <strong>💡 Tip:</strong> The IoT Simulator sends health data every 5 seconds. Run it to test the system!
      </div>
    </div>
  );
}

export default Dashboard;
