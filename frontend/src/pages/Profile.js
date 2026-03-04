import React, { useState, useEffect } from 'react';
import { userAPI } from '../api';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await userAPI.getProfile();
      setProfile(response.data);
      setFormData(response.data);
    } catch (err) {
      setError('Failed to load profile');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await userAPI.updateProfile(formData);
      setProfile(response.data.user);
      setIsEditing(false);
      setSuccess('Profile updated successfully!');
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Failed to update profile');
      console.error(err);
    }
  };

  if (loading) {
    return <div className="container" style={{ textAlign: 'center', padding: '40px' }}>Loading...</div>;
  }

  if (!profile) {
    return <div className="container"><div className="alert alert-danger">{error}</div></div>;
  }

  return (
    <div className="dashboard container" style={{ maxWidth: '600px' }}>
      <h1>User Profile</h1>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}

      <div className="card">
        {!isEditing ? (
          <>
            <div className="card-header">
              <h3>Profile Information</h3>
            </div>
            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label style={{ color: '#666', fontSize: '13px' }}>Username</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {profile.username}
                </div>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '13px' }}>Email</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {profile.email}
                </div>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '13px' }}>Full Name</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {profile.full_name || '-'}
                </div>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '13px' }}>Age</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {profile.age || '-'}
                </div>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '13px' }}>Gender</label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {profile.gender || '-'}
                </div>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '13px' }}>
                  Medical Conditions
                </label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {profile.medical_conditions || '-'}
                </div>
              </div>
              <div>
                <label style={{ color: '#666', fontSize: '13px' }}>
                  Member Since
                </label>
                <div style={{ fontSize: '16px', fontWeight: '500' }}>
                  {new Date(profile.created_at).toLocaleDateString()}
                </div>
              </div>
            </div>
            <button
              className="btn btn-primary"
              onClick={() => setIsEditing(true)}
              style={{ marginTop: '20px' }}
            >
              Edit Profile
            </button>
          </>
        ) : (
          <>
            <div className="card-header">
              <h3>Edit Profile</h3>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  name="full_name"
                  value={formData.full_name || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Age</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age || ''}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender || ''}
                  onChange={handleChange}
                >
                  <option value="">Select...</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div className="form-group">
                <label>Medical Conditions</label>
                <textarea
                  name="medical_conditions"
                  value={formData.medical_conditions || ''}
                  onChange={handleChange}
                  rows="4"
                />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" className="btn btn-primary">
                  Save Changes
                </button>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setIsEditing(false);
                    setFormData(profile);
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

export default Profile;
