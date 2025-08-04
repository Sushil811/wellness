import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Plus, Edit, Calendar, Eye } from 'lucide-react';
import toast from 'react-hot-toast';

const MySessions = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMySessions();
  }, []);

  const fetchMySessions = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/sessions/my-sessions');
      setSessions(response.data.sessions);
    } catch (error) {
      console.error('Error fetching my sessions:', error);
      setError('Failed to load your sessions');
      toast.error('Failed to load your sessions');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    return status === 'published' ? 'status-published' : 'status-draft';
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading your sessions...</div>
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
              My Sessions
            </h1>
            <p style={{ color: '#6c757d', fontSize: '16px' }}>
              Manage your wellness sessions and drafts
            </p>
          </div>
          <Link to="/editor" className="btn btn-primary">
            <Plus size={20} />
            Create New Session
          </Link>
        </div>

        {error && (
          <div className="error">{error}</div>
        )}

        {sessions.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px', color: '#6c757d' }}>
            <h3 style={{ marginBottom: '16px', color: '#495057' }}>No sessions yet</h3>
            <p style={{ marginBottom: '24px' }}>
              Start creating your wellness sessions to share with the community!
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
                      <Calendar size={14} />
                      {formatDate(session.updated_at)}
                    </span>
                    <span className={`status-badge ${getStatusColor(session.status)}`}>
                      {session.status}
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
                    <div style={{ fontSize: '12px', color: '#6c757d' }}>
                      Created: {formatDate(session.created_at)}
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                      <Link 
                        to={`/editor/${session._id}`}
                        className="btn btn-secondary"
                        style={{ fontSize: '12px', padding: '8px 12px' }}
                      >
                        <Edit size={14} />
                        Edit
                      </Link>
                      {session.status === 'published' && (
                        <Link 
                          to={`/dashboard`}
                          className="btn btn-primary"
                          style={{ fontSize: '12px', padding: '8px 12px' }}
                        >
                          <Eye size={14} />
                          View
                        </Link>
                      )}
                    </div>
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

export default MySessions; 