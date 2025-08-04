import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Calendar, User } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      setError('Failed to load sessions');
      toast.error('Failed to load sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading sessions...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '32px', fontWeight: '700', marginBottom: '8px', color: '#333' }}>
              Wellness Sessions
            </h1>
            <p style={{ color: '#6c757d', fontSize: '16px' }}>
              Discover and explore wellness sessions from our community
            </p>
          </div>
          <Link to="/editor" className="btn btn-primary">
            <Plus size={20} />
            Create Session
          </Link>
        </div>

        {error && (
          <div className="error">{error}</div>
        )}

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6c757d' }}>
            <h3 style={{ marginBottom: '16px', color: '#495057' }}>No sessions available</h3>
            <p style={{ marginBottom: '24px' }}>
              Be the first to create a wellness session for the community!
            </p>
            <Link to="/editor" className="btn btn-primary">
              <Plus size={20} />
              Create Your First Session
            </Link>
          </div>
        ) : (
          <div className="session-grid">
            {sessions.map((session) => (
              <div key={session._id} className="session-card">
                <div className="session-header">
                  <h3 className="session-title">{session.title}</h3>
                  <div className="session-meta">
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <User size={14} />
                      {session.user_id?.email || 'Anonymous'}
                    </span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={14} />
                      {formatDate(session.created_at)}
                    </span>
                  </div>
                </div>
                <div className="session-body">
                  {session.tags && session.tags.length > 0 && (
                    <div className="session-tags">
                      {session.tags.map((tag, index) => (
                        <span key={index} className="tag">{tag}</span>
                      ))}
                    </div>
                  )}
                  <div style={{ marginBottom: '16px' }}>
                    <strong>JSON File URL:</strong>
                    <div style={{ 
                      wordBreak: 'break-all', 
                      fontSize: '14px', 
                      color: '#6c757d',
                      marginTop: '4px',
                      padding: '8px',
                      background: '#f8f9fa',
                      borderRadius: '4px',
                      border: '1px solid #e9ecef'
                    }}>
                      {session.json_file_url}
                    </div>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className={`status-badge status-${session.status}`}>
                      {session.status}
                    </span>
                    <Link 
                      to={`/editor/${session._id}`}
                      className="btn btn-secondary"
                      style={{ fontSize: '12px', padding: '8px 16px' }}
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 