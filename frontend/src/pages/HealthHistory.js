import React, { useState, useEffect } from 'react';
import { healthAPI } from '../api';

function HealthHistory() {
  const [healthData, setHealthData] = useState([]);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHealthHistory();
  }, [days]);

  const fetchHealthHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await healthAPI.getHistory(days);
      setHealthData(response.data);
    } catch (err) {
      setError('Failed to load health history');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard container">
      <h1>Health History</h1>

      <div style={{ marginBottom: '20px' }}>
        <label style={{ marginRight: '10px' }}>Filter by days:</label>
        <select
          value={days}
          onChange={(e) => setDays(parseInt(e.target.value))}
          style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ddd' }}
        >
          <option value={1}>1 Day</option>
          <option value={7}>7 Days</option>
          <option value={30}>30 Days</option>
          <option value={90}>90 Days</option>
        </select>
      </div>

      {error && <div className="alert alert-danger">{error}</div>}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>
      ) : healthData.length === 0 ? (
        <div className="alert alert-info">No health data available for the selected period.</div>
      ) : (
        <table className="health-data-table">
          <thead>
            <tr>
              <th>Date & Time</th>
              <th>Heart Rate</th>
              <th>Temperature</th>
              <th>Notes</th>
            </tr>
          </thead>
          <tbody>
            {healthData.map((data) => (
              <tr key={data.id}>
                <td>
                  {new Date(data.recorded_at).toLocaleString()}
                </td>
                <td className="heart-rate">
                  {Math.round(data.heart_rate)} bpm
                </td>
                <td className="temperature">
                  {data.temperature.toFixed(1)}°C
                </td>
                <td>
                  {data.notes || '-'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default HealthHistory;
