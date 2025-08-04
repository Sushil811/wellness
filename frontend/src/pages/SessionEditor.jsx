import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Save, Send, ArrowLeft, Clock, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SessionEditor = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [autoSaveStatus, setAutoSaveStatus] = useState('idle'); // idle, saving, saved
  const [formData, setFormData] = useState({
    title: '',
    tags: '',
    json_file_url: ''
  });
  const [errors, setErrors] = useState({});

  // Auto-save timer
  const [autoSaveTimer, setAutoSaveTimer] = useState(null);

  // Load existing session if editing
  useEffect(() => {
    if (id) {
      loadSession();
    }
  }, [id]);

  const loadSession = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/sessions/my-sessions/${id}`);
      const session = response.data.session;
      
      setFormData({
        title: session.title || '',
        tags: session.tags ? session.tags.join(', ') : '',
        json_file_url: session.json_file_url || ''
      });
    } catch (error) {
      console.error('Error loading session:', error);
      toast.error('Failed to load session');
      navigate('/my-sessions');
    } finally {
      setLoading(false);
    }
  };

  // Auto-save functionality with debouncing
  const autoSave = useCallback(async () => {
    if (!formData.title || !formData.json_file_url) return;

    try {
      setAutoSaveStatus('saving');
      await axios.post('/api/sessions/save-draft', {
        ...formData,
        sessionId: id
      });
      setAutoSaveStatus('saved');
      
      // Clear saved status after 3 seconds
      setTimeout(() => {
        setAutoSaveStatus('idle');
      }, 3000);
    } catch (error) {
      console.error('Auto-save error:', error);
      setAutoSaveStatus('idle');
    }
  }, [formData, id]);

  // Debounced auto-save
  useEffect(() => {
    if (autoSaveTimer) {
      clearTimeout(autoSaveTimer);
    }

    if (formData.title && formData.json_file_url) {
      const timer = setTimeout(autoSave, 5000); // 5 second delay
      setAutoSaveTimer(timer);
    }

    return () => {
      if (autoSaveTimer) {
        clearTimeout(autoSaveTimer);
      }
    };
  }, [formData, autoSave]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.json_file_url.trim()) {
      newErrors.json_file_url = 'JSON file URL is required';
    } else if (!formData.json_file_url.startsWith('http')) {
      newErrors.json_file_url = 'Please enter a valid URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveDraft = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      const response = await axios.post('/api/sessions/save-draft', {
        ...formData,
        sessionId: id
      });
      
      toast.success('Draft saved successfully!');
      
      // Update the ID if this was a new session
      if (!id && response.data.session) {
        window.history.replaceState(null, '', `/editor/${response.data.session._id}`);
      }
    } catch (error) {
      console.error('Save draft error:', error);
      toast.error('Failed to save draft');
    } finally {
      setSaving(false);
    }
  };

  const handlePublish = async () => {
    if (!validateForm()) return;

    try {
      setSaving(true);
      await axios.post('/api/sessions/publish', {
        ...formData,
        sessionId: id
      });
      
      toast.success('Session published successfully!');
      navigate('/my-sessions');
    } catch (error) {
      console.error('Publish error:', error);
      toast.error('Failed to publish session');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const getAutoSaveIndicator = () => {
    switch (autoSaveStatus) {
      case 'saving':
        return (
          <div className="auto-save-indicator saving">
            <Clock size={16} />
            Saving...
          </div>
        );
      case 'saved':
        return (
          <div className="auto-save-indicator saved">
            <CheckCircle size={16} />
            Saved
          </div>
        );
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="loading">
          <div>Loading session...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="editor-container">
        <div className="editor-header">
          <div>
            <button 
              onClick={() => navigate('/my-sessions')}
              className="btn btn-secondary"
              style={{ marginBottom: '12px' }}
            >
              <ArrowLeft size={16} />
              Back to My Sessions
            </button>
            <h1 className="editor-title">
              {id ? 'Edit Session' : 'Create New Session'}
            </h1>
          </div>
          <div className="editor-actions">
            {getAutoSaveIndicator()}
            <button
              onClick={handleSaveDraft}
              disabled={saving}
              className="btn btn-secondary"
            >
              <Save size={16} />
              {saving ? 'Saving...' : 'Save Draft'}
            </button>
            <button
              onClick={handlePublish}
              disabled={saving}
              className="btn btn-success"
            >
              <Send size={16} />
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </div>

        <form onSubmit={(e) => e.preventDefault()}>
          <div className="form-group">
            <label className="form-label">Session Title *</label>
            <input
              type="text"
              className={`form-input ${errors.title ? 'error' : ''}`}
              value={formData.title}
              onChange={(e) => handleInputChange('title', e.target.value)}
              placeholder="Enter session title"
            />
            {errors.title && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                {errors.title}
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Tags</label>
            <input
              type="text"
              className="form-input"
              value={formData.tags}
              onChange={(e) => handleInputChange('tags', e.target.value)}
              placeholder="Enter tags separated by commas (e.g., yoga, meditation, wellness)"
            />
            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
              Separate multiple tags with commas
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">JSON File URL *</label>
            <input
              type="url"
              className={`form-input ${errors.json_file_url ? 'error' : ''}`}
              value={formData.json_file_url}
              onChange={(e) => handleInputChange('json_file_url', e.target.value)}
              placeholder="https://example.com/session-data.json"
            />
            {errors.json_file_url && (
              <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>
                {errors.json_file_url}
              </div>
            )}
            <div style={{ fontSize: '12px', color: '#6c757d', marginTop: '4px' }}>
              Enter the URL to your session's JSON configuration file
            </div>
          </div>

          <div style={{ 
            background: '#f8f9fa', 
            padding: '16px', 
            borderRadius: '8px', 
            marginTop: '24px',
            border: '1px solid #e9ecef'
          }}>
            <h4 style={{ marginBottom: '12px', color: '#495057' }}>Auto-save Information</h4>
            <ul style={{ margin: 0, paddingLeft: '20px', color: '#6c757d', fontSize: '14px' }}>
              <li>Your draft will be automatically saved after 5 seconds of inactivity</li>
              <li>You can manually save as draft at any time</li>
              <li>Published sessions will be visible to the community</li>
              <li>Drafts are only visible to you</li>
            </ul>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SessionEditor; 