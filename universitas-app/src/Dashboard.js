import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';

function Dashboard() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  
  const handleLogout = useCallback(() => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    navigate('/login');
  }, [navigate]);

  const fetchStudents = useCallback(async (token) => {
    try {
      const response = await axios.get('https://e4rthen.pythonanywhere.com/api/auth/students/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStudents(response.data);
    } catch (err) {
      console.error('Gagal mengambil data siswa', err);
    }
  }, []);

  const handleInputChange = (studentId, newGrade) => {
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    if (numericRegex.test(newGrade)) {
      const numericValue = Number(newGrade);
      if (
        newGrade === "" ||
        newGrade === "." ||
        (numericValue >= 0 && numericValue <= 100)
      ) {
        setStudents(prevStudents =>
          prevStudents.map(student =>
            student.id === studentId ? { ...student, grade: newGrade } : student
          )
        );
      }
    }
  };

  const handleSubmitGrade = async (studentId) => {
    const token = localStorage.getItem('access_token');
    const student = students.find(s => s.id === studentId);
    if (!student) return;
    const newGrade = student.grade || "";

    try {
      await axios.patch(`https://e4rthen.pythonanywhere.com/api/auth/students/${studentId}/`, {
        grade: newGrade
      }, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      console.log(`Nilai untuk ${student.full_name} berhasil disimpan!`);
    } catch (err) {
      console.error('Gagal update nilai', err);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUser(decodedToken);

        if (decodedToken.role && decodedToken.role.toLowerCase() === 'instructor') {
          fetchStudents(token);
        }
      } catch (error) {
        console.error('Token tidak valid:', error);
        handleLogout();
      }
    } else {
      navigate('/login');
    }
  }, [navigate, handleLogout, fetchStudents]);

  if (!user) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border" style={{ color: '#3B82F6' }} role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-4">
      {/* Header Section */}
      <div 
        className="p-4 mb-4 shadow-sm"
        style={{
          background: 'linear-gradient(135deg, #1E3A8A 0%, #3B82F6 100%)',
          borderRadius: '1rem',
          color: '#FFFFFF'
        }}
      >
        <div className="d-flex justify-content-between align-items-center flex-wrap">
          <div>
            <h1 className="mb-2 fw-bold">Welcome, {user.full_name || user.username}!</h1>
            <p className="mb-0 opacity-75">
              Role: <span className="badge" style={{ backgroundColor: 'rgba(255,255,255,0.2)', padding: '0.375rem 0.75rem' }}>
                {user.role}
              </span>
            </p>
          </div>
          <button 
            onClick={handleLogout} 
            className="btn btn-light mt-3 mt-md-0 fw-semibold"
            style={{
              borderRadius: '0.5rem',
              padding: '0.625rem 1.25rem'
            }}
          >
            Logout
          </button>
        </div>
      </div>

      {/* Student View */}
      {user.role === 'student' && (
        <div className="card shadow-sm border-0" style={{ borderRadius: '1rem' }}>
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4" style={{ color: '#1E3A8A' }}>Your Grade</h3>
            <div 
              className="p-4 text-center"
              style={{
                backgroundColor: '#F3F4F6',
                borderRadius: '0.75rem',
                border: '2px solid #E5E7EB'
              }}
            >
              <p className="text-muted mb-2">Final Grade</p>
              <h2 className="fw-bold mb-0" style={{ color: '#1E3A8A', fontSize: '2.5rem' }}>
                {user.grade || 'Not Graded Yet'}
              </h2>
            </div>
          </div>
        </div>
      )}

      {/* Instructor View */}
      {user.rowle === 'instructor' && (
        <div className="card shadow-sm border-0" style={{ borderRadius: '1rem' }}>
          <div className="card-body p-4">
            <h3 className="fw-bold mb-4" style={{ color: '#1E3A8A' }}>Student Grade Management</h3>
            
            <div className="table-responsive">
              <table className="table table-hover align-middle">
                <thead style={{ backgroundColor: '#1E3A8A', color: '#FFFFFF' }}>
                  <tr>
                    <th className="py-3 px-4 fw-semibold" style={{ borderTopLeftRadius: '0.5rem' }}>
                      Student Name
                    </th>
                    <th className="py-3 px-4 fw-semibold">Email</th>
                    <th className="py-3 px-4 fw-semibold">Major</th>
                    <th className="py-3 px-4 fw-semibold" style={{ width: '180px' }}>Grade</th>
                    <th className="py-3 px-4 fw-semibold" style={{ width: '140px', borderTopRightRadius: '0.5rem' }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {students.map((student, index) => (
                    <tr 
                      key={student.id}
                      style={{ 
                        borderBottom: index === students.length - 1 ? 'none' : '1px solid #E5E7EB'
                      }}
                    >
                      <td className="py-3 px-4 fw-semibold" style={{ color: '#111827' }}>
                        {student.full_name}
                      </td>
                      <td className="py-3 px-4" style={{ color: '#6B7280' }}>
                        {student.email}
                      </td>
                      <td className="py-3 px-4" style={{ color: '#6B7280' }}>
                        {student.major}
                      </td>
                      <td className="py-3 px-4">
                        <input 
                          type="text"
                          className="form-control"
                          style={{
                            borderRadius: '0.5rem',
                            border: '1px solid #D1D5DB',
                            padding: '0.5rem 0.75rem'
                          }}
                          value={student.grade || ""}
                          onChange={(e) => handleInputChange(student.id, e.target.value)}
                          placeholder="Enter grade"
                        />
                      </td>
                      <td className="py-3 px-4">
                        <button 
                          className="btn btn-sm fw-semibold w-100"
                          style={{
                            backgroundColor: '#1E3A8A',
                            color: '#FFFFFF',
                            borderRadius: '0.5rem',
                            padding: '0.5rem 1rem',
                            border: 'none',
                            transition: 'all 0.3s ease'
                          }}
                          onClick={() => handleSubmitGrade(student.id)}
                          onMouseOver={(e) => e.target.style.backgroundColor = '#3B82F6'}
                          onMouseOut={(e) => e.target.style.backgroundColor = '#1E3A8A'}
                        >
                          Save
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {students.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No students found in your class.</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;