import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Eye, EyeOff, Mail, Lock } from 'lucide-react';

const Login = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, register } = useAuth();

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    
    try {
      const result = isLogin 
        ? await login(email, password)
        : await register(email, password);
      
      if (!result.success) {
        setErrors({ general: result.error });
      }
    } catch (error) {
      setErrors({ general: 'An unexpected error occurred' });
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setIsLogin(!isLogin);
    setErrors({});
    setEmail('');
    setPassword('');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h1 className="auth-title">
          {isLogin ? 'Welcome Back' : 'Create Account'}
        </h1>
        
        {errors.general && (
          <div className="error">{errors.general}</div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <div style={{ position: 'relative' }}>
              <Mail size={20} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }} />
              <input
                type="email"
                className={`form-input ${errors.email ? 'error' : ''}`}
                style={{ paddingLeft: '40px' }}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </div>
            {errors.email && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>{errors.email}</div>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div style={{ position: 'relative' }}>
              <Lock size={20} style={{ 
                position: 'absolute', 
                left: '12px', 
                top: '50%', 
                transform: 'translateY(-50%)',
                color: '#6c757d'
              }} />
              <input
                type={showPassword ? 'text' : 'password'}
                className={`form-input ${errors.password ? 'error' : ''}`}
                style={{ paddingLeft: '40px', paddingRight: '40px' }}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6c757d'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {errors.password && <div style={{ color: '#dc3545', fontSize: '14px', marginTop: '4px' }}>{errors.password}</div>}
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', marginTop: '20px' }}
            disabled={loading}
          >
            {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div className="auth-switch">
          {isLogin ? (
            <>
              Don't have an account?{' '}
              <button 
                onClick={toggleMode}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#667eea', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{' '}
              <button 
                onClick={toggleMode}
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  color: '#667eea', 
                  textDecoration: 'underline',
                  cursor: 'pointer',
                  fontWeight: '600'
                }}
              >
                Sign in
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login; 