import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    try {
      const response = await axios.post('/api/auth/login/', {
        email: email,
        password: password
      });

      console.log('Login Berhasil:', response.data);

      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);

      navigate('/');

    } catch (err) {
      console.error('Login Gagal:', err.response.data);
      setError('Login gagal. Periksa kembali email dan password Anda.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-5 col-lg-4">
          <div className="card shadow-sm border-0" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1E3A8A' }}>Welcome Back</h2>
                <p className="text-muted mb-0">Sign in to your account</p>
              </div>

              {/* Login Form */}
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    className="form-control"
                    style={{ 
                      borderRadius: '0.5rem',
                      border: '1px solid #D1D5DB',
                      padding: '0.625rem 0.875rem'
                    }}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required 
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                    Password
                  </label>
                  <input 
                    type="password" 
                    className="form-control"
                    style={{ 
                      borderRadius: '0.5rem',
                      border: '1px solid #D1D5DB',
                      padding: '0.625rem 0.875rem'
                    }}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required 
                  />
                </div>

                {error && (
                  <div className="alert alert-danger" style={{ borderRadius: '0.5rem' }}>
                    {error}
                  </div>
                )}

                <div className="d-grid mt-4">
                  <button 
                    type="submit" 
                    className="btn fw-semibold"
                    style={{
                      backgroundColor: '#1E3A8A',
                      color: '#FFFFFF',
                      borderRadius: '0.5rem',
                      padding: '0.75rem',
                      border: 'none',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseOver={(e) => e.target.style.backgroundColor = '#3B82F6'}
                    onMouseOut={(e) => e.target.style.backgroundColor = '#1E3A8A'}
                  >
                    Sign In
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Don't have an account? <a href="/register" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>Register here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;