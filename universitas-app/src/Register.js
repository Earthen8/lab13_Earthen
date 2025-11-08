import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [major, setMajor] = useState('');
  const [role, setRole] = useState('student');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [majorOptions, setMajorOptions] = useState([]);
  
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMajors = async () => {
      try {
        const response = await axios.get('https://e4rthen.pythonanywhere.com/api/majors/');
        setMajorOptions(response.data);
        if (response.data.length > 0) {
          setMajor(response.data[0].value); 
        }
      } catch (err) {
        console.error('Gagal mengambil daftar jurusan', err);
        setError('Gagal memuat opsi jurusan.');
      }
    };

    fetchMajors();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (password !== passwordConfirmation) {
      setError('Password dan Konfirmasi Password tidak cocok.');
      return;
    }
    
    if (!major) {
      setError('Silakan pilih jurusan Anda.');
      return;
    }

    try { 
      await axios.post('https://e4rthen.pythonanywhere.com/api/auth/register/', {
        email: email,
        username: username,
        full_name: fullName,
        major: major, 
        role: role,
        password: password,
        password_confirmation: passwordConfirmation
      });

      console.log('Registrasi berhasil!');
      navigate('/login');

    } catch (err) { 
      console.error('Registrasi Gagal:', err.response.data);
      const errorData = err.response.data;
      if (errorData.email) {
        setError(`Email: ${errorData.email[0]}`);
      } else if (errorData.username) {
        setError(`Username: ${errorData.username[0]}`);
      } else {
        setError('Registrasi gagal. Periksa kembali semua data Anda.');
      }
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-8 col-lg-6">
          <div className="card shadow-sm border-0" style={{ borderRadius: '1rem' }}>
            <div className="card-body p-4">
              {/* Header */}
              <div className="text-center mb-4">
                <h2 className="fw-bold" style={{ color: '#1E3A8A' }}>Create Account</h2>
                <p className="text-muted mb-0">Register to get started</p>
              </div>

              {/* Registration Form */}
              <form onSubmit={handleSubmit}>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                      Email
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
                      placeholder="your@student.prasetiyamulya.ac.id"
                      required 
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                      Username
                    </label>
                    <input 
                      type="text" 
                      className="form-control"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid #D1D5DB',
                        padding: '0.625rem 0.875rem'
                      }}
                      value={username} 
                      onChange={(e) => setUsername(e.target.value)} 
                      placeholder="Choose username"
                      required 
                    />
                  </div>
                </div>

                <div className="mb-3">
                  <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    className="form-control"
                    style={{ 
                      borderRadius: '0.5rem',
                      border: '1px solid #D1D5DB',
                      padding: '0.625rem 0.875rem'
                    }}
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                    placeholder="Enter your full name"
                    required 
                  />
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                      Major
                    </label>
                    <select 
                      className="form-select"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid #D1D5DB',
                        padding: '0.625rem 0.875rem'
                      }}
                      value={major} 
                      onChange={(e) => setMajor(e.target.value)} 
                      required
                    >
                      <option value="" disabled>Select Major...</option>
                      {majorOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                      Role
                    </label>
                    <select 
                      className="form-select"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid #D1D5DB',
                        padding: '0.625rem 0.875rem'
                      }}
                      value={role} 
                      onChange={(e) => setRole(e.target.value)}
                    >
                      <option value="student">Student</option>
                      <option value="instructor">Instructor</option>
                    </select>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6 mb-3">
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
                      placeholder="Enter password"
                      required 
                    />
                  </div>

                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-semibold" style={{ color: '#111827' }}>
                      Confirm Password
                    </label>
                    <input 
                      type="password" 
                      className="form-control"
                      style={{ 
                        borderRadius: '0.5rem',
                        border: '1px solid #D1D5DB',
                        padding: '0.625rem 0.875rem'
                      }}
                      value={passwordConfirmation} 
                      onChange={(e) => setPasswordConfirmation(e.target.value)} 
                      placeholder="Confirm password"
                      required 
                    />
                  </div>
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
                    Register
                  </button>
                </div>
              </form>

              {/* Footer */}
              <div className="text-center mt-4">
                <p className="text-muted mb-0">
                  Already have an account? <a href="/login" style={{ color: '#3B82F6', textDecoration: 'none', fontWeight: '500' }}>Sign in here</a>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;