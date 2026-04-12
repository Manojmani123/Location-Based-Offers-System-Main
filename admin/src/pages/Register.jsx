import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Store, Upload, CheckCircle2 } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    businessName: '',
    email: '',
    password: '',
    documentName: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setFormData(prev => ({ ...prev, documentName: e.target.files[0].name }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.documentName) {
      setError('Please upload a business registration document.');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await register(formData);
      // Registration complete, the user is now marked as "isApproved: false"
      navigate('/pending-approval');
    } catch (err) {
      setError('An error occurred during registration.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div className="card glass-panel w-full" style={{ maxWidth: '500px', padding: 'var(--spacing-xl)' }}>
        <div className="flex flex-col items-center gap-sm mb-6" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-lg)' }}>
            <Store size={32} color="var(--primary-color)" />
          </div>
          <h2>Register Business</h2>
          <p style={{ textAlign: 'center', marginBottom: 0 }}>Create your profile to start creating offers</p>
        </div>

        {error && (
          <div className="flex items-center gap-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', fontSize: '0.875rem' }}>
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="businessName">Business Name</label>
            <input 
              id="businessName"
              type="text" 
              className="form-control" 
              placeholder="e.g. The Coffee Shop"
              value={formData.businessName}
              onChange={(e) => setFormData({...formData, businessName: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              className="form-control" 
              placeholder="hello@business.com"
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="form-control" 
              placeholder="Create a strong password"
              value={formData.password}
              onChange={(e) => setFormData({...formData, password: e.target.value})}
              required
              minLength={6}
            />
          </div>

          <div className="form-group">
            <label className="form-label">Business Verification Document</label>
            <div 
              style={{
                border: '2px dashed var(--border-color)',
                borderRadius: 'var(--radius-lg)',
                padding: 'var(--spacing-xl)',
                textAlign: 'center',
                position: 'relative',
                transition: 'all var(--transition-fast)',
                backgroundColor: formData.documentName ? 'var(--primary-light)' : 'transparent',
                borderColor: formData.documentName ? 'var(--primary-color)' : 'var(--border-color)'
              }}
            >
              <input 
                type="file" 
                onChange={handleFileChange}
                style={{
                  position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', opacity: 0, cursor: 'pointer'
                }}
                accept=".pdf,.doc,.docx,.jpg,.png"
              />
              <div className="flex flex-col items-center gap-sm">
                {formData.documentName ? (
                  <>
                    <CheckCircle2 color="var(--primary-color)" size={32} />
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>{formData.documentName}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Click to replace</span>
                  </>
                ) : (
                  <>
                    <Upload color="var(--text-muted)" size={32} />
                    <span style={{ color: 'var(--text-main)', fontWeight: 500 }}>Upload Document</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>PDF, JPG, PNG up to 5MB</span>
                  </>
                )}
              </div>
            </div>
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading} style={{ padding: '0.75rem', marginTop: 'var(--spacing-sm)' }}>
            {isLoading ? <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div> : 'Submit for Approval'}
          </button>
        </form>

        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary-color)' }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
