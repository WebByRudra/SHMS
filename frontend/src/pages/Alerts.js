import React, { useState, useEffect } from 'react';
import { alertAPI } from '../api';

function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unreadOnly, setUnreadOnly] = useState(false);

  useEffect(() => {
    fetchAlerts();
  }, [unreadOnly]);

  const fetchAlerts = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await alertAPI.getAlerts(unreadOnly);
      setAlerts(response.data);
    } catch (err) {
      setError('Failed to load alerts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (alertId) => {
    try {
      await alertAPI.markAsRead(alertId);
      setAlerts(alerts.map((a) =>
        a.id === alertId ? { ...a, is_read: true } : a
      ));
    } catch (err) {
      console.error('Failed to mark alert as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await alertAPI.markAllAsRead();
      setAlerts(alerts.map((a) => ({ ...a, is_read: true })));
    } catch (err) {
      console.error('Failed to mark all alerts as read');
    }
  };

  const getAlertColor = (alertType) => {
    if (alertType.includes('high') || alertType.includes('low')) {
      return 'danger';
    }
    return 'warning';
  };

  return (
    <div className="dashboard container">
      <h1>Alerts</h1>

      {error && <div className="alert alert-danger">{error}</div>}

      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <label>
          <input
            type="checkbox"
            checked={unreadOnly}
            onChange={(e) => setUnreadOnly(e.target.checked)}
          />
          <span style={{ marginLeft: '5px' }}>Show unread only</span>
        </label>
        {alerts.some((a) => !a.is_read) && (
          <button
            className="btn btn-secondary"
            onClick={handleMarkAllAsRead}
            style={{ marginLeft: 'auto' }}
          >
            Mark all as read
          </button>
        )}
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : alerts.length === 0 ? (
        <div className="alert alert-success">
          {unreadOnly ? 'No unread alerts!' : 'No alerts yet.'}
        </div>
      ) : (
        <div className="alerts-container">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`alert-item ${getAlertColor(alert.alert_type)} ${
                alert.is_read ? 'read' : ''
              }`}
            >
              <div className="alert-content">
                <div className="message">
                  {alert.alert_type.replace(/_/g, ' ').toUpperCase()}
                </div>
                <div style={{ color: '#333', marginBottom: '5px' }}>
                  {alert.message}
                </div>
                <div className="time">
                  {new Date(alert.created_at).toLocaleString()}
                </div>
              </div>
              {!alert.is_read && (
                <div className="alert-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => handleMarkAsRead(alert.id)}
                  >
                    Mark as read
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Alerts;
