import React, { useState, useEffect } from 'react';
import { userAPI } from '../api';

function Settings() {
  const [thresholds, setThresholds] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchThresholds();
  }, []);

  const fetchThresholds = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getThresholds();
      setThresholds(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load thresholds');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: parseFloat(value),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.updateThresholds(formData);
      setThresholds(response.data.thresholds);
      setSuccess('Thresholds updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update thresholds');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  if (!thresholds) {
    return <div className="container"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="dashboard container" style={{ maxWidth: '600px' }}>
      <h1>Health Thresholds Settings</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        <div className="card-header">
          <h3>Alert Thresholds</h3>
          <p style={{ color: '#666', fontSize: '14px', margin: '10px 0 0 0' }}>
            Set the limits for health metrics. Alerts will be generated when values exceed or fall below these thresholds.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <h4 style={{ marginTop: '20px', marginBottom: '15px', color: '#333' }}>
            Heart Rate (bpm)
          </h4>

          <div className="form-group">
            <label>High Heart Rate Threshold</label>
            <input
              type="number"
              name="high_heart_rate"
              value={formData.high_heart_rate || ''}
              onChange={handleChange}
              step="0.1"
              required
            />
            <small style={{ color: '#666' }}>
              Alert when heart rate exceeds this value
            </small>
          </div>

          <div className="form-group">
            <label>Low Heart Rate Threshold</label>
            <input
              type="number"
              name="low_heart_rate"
              value={formData.low_heart_rate || ''}
              onChange={handleChange}
              step="0.1"
              required
            />
            <small style={{ color: '#666' }}>
              Alert when heart rate falls below this value
            </small>
          </div>

          <h4 style={{ marginTop: '25px', marginBottom: '15px', color: '#333' }}>
            Temperature (°C)
          </h4>

          <div className="form-group">
            <label>High Temperature Threshold</label>
            <input
              type="number"
              name="high_temperature"
              value={formData.high_temperature || ''}
              onChange={handleChange}
              step="0.1"
              required
            />
            <small style={{ color: '#666' }}>
              Alert when temperature exceeds this value
            </small>
          </div>

          <div className="form-group">
            <label>Low Temperature Threshold</label>
            <input
              type="number"
              name="low_temperature"
              value={formData.low_temperature || ''}
              onChange={handleChange}
              step="0.1"
              required
            />
            <small style={{ color: '#666' }}>
              Alert when temperature falls below this value
            </small>
          </div>

          <button type="submit" className="btn btn-primary" style={{ marginTop: '20px' }}>
            Save Thresholds
          </button>
        </form>
      </div>

      <div className="card" style={{ marginTop: '20px' }}>
        <div className="card-header">
          <h3>Default Thresholds (Reference)</h3>
        </div>
        <div style={{ display: 'grid', gap: '15px' }}>
          <div>
            <strong>Heart Rate:</strong> 60-100 bpm
          </div>
          <div>
            <strong>Temperature:</strong> 36.0-38.0°C
          </div>
          <p style={{ color: '#666', fontSize: '13px', marginTop: '15px' }}>
            These are general guidelines. Consult with your healthcare provider for thresholds specific to your health condition.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Settings;
