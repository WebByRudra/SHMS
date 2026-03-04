import React, { useState, useEffect } from 'react';
import { healthAPI } from '../api';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function HealthStats() {
  const [stats, setStats] = useState(null);
  const [days, setDays] = useState(7);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, [days]);

  const fetchStats = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await healthAPI.getStats(days);
      setStats(response.data);
    } catch (err) {
      setError('Failed to load statistics');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  if (error) {
    return <div className="container"><div className="alert alert-danger">{error}</div></div>;
  }

  if (!stats) {
    return <div className="container"><div className="alert alert-info">No statistics available yet.</div></div>;
  }

  return (
    <div className="dashboard container">
      <h1>Health Statistics</h1>

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

      <div className="grid" style={{ marginTop: '30px' }}>
        <div className="stat-card">
          <div className="label">Heart Rate - Average</div>
          <div className="value">
            {Math.round(stats.heart_rate.average)}
            <span className="unit">bpm</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Heart Rate - Min</div>
          <div className="value">
            {Math.round(stats.heart_rate.min)}
            <span className="unit">bpm</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Heart Rate - Max</div>
          <div className="value">
            {Math.round(stats.heart_rate.max)}
            <span className="unit">bpm</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Readings Count</div>
          <div className="value">
            {stats.heart_rate.readings_count}
          </div>
        </div>
      </div>

      <div className="grid">
        <div className="stat-card">
          <div className="label">Temperature - Average</div>
          <div className="value">
            {stats.temperature.average.toFixed(1)}
            <span className="unit">°C</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Temperature - Min</div>
          <div className="value">
            {stats.temperature.min.toFixed(1)}
            <span className="unit">°C</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Temperature - Max</div>
          <div className="value">
            {stats.temperature.max.toFixed(1)}
            <span className="unit">°C</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="label">Readings Count</div>
          <div className="value">
            {stats.temperature.readings_count}
          </div>
        </div>
      </div>
    </div>
  );
}

export default HealthStats;
