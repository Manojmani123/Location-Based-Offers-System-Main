import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Building2, LogIn, AlertCircle } from 'lucide-react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user.isApproved) {
        navigate('/');
      } else {
        navigate('/pending-approval');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center" style={{ minHeight: '100vh', padding: 'var(--spacing-lg)' }}>
      <div className="card glass-panel w-full" style={{ maxWidth: '420px', padding: 'var(--spacing-xl)' }}>
        <div className="flex flex-col items-center gap-sm mb-6" style={{ marginBottom: 'var(--spacing-xl)' }}>
          <div style={{ backgroundColor: 'var(--primary-light)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-lg)' }}>
            <Building2 size={32} color="var(--primary-color)" />
          </div>
          <h2>Admin Login</h2>
          <p style={{ textAlign: 'center', marginBottom: 0 }}>Log in to manage your business offers</p>
        </div>

        {error && (
          <div className="flex items-center gap-sm" style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', color: 'var(--danger-color)', padding: 'var(--spacing-sm)', borderRadius: 'var(--radius-md)', marginBottom: 'var(--spacing-lg)', fontSize: '0.875rem' }}>
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="email">Email Address</label>
            <input 
              id="email"
              type="email" 
              className="form-control" 
              placeholder="admin@business.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input 
              id="password"
              type="password" 
              className="form-control" 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary w-full" disabled={isLoading} style={{ padding: '0.75rem', marginTop: 'var(--spacing-sm)' }}>
            {isLoading ? <div className="spinner" style={{ width: '1.2rem', height: '1.2rem', borderWidth: '2px' }}></div> : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        <div style={{ marginTop: 'var(--spacing-lg)', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Don't have an account? <Link to="/register" style={{ color: 'var(--primary-color)' }}>Register here</Link>
        </div>
        
        <div style={{ marginTop: 'var(--spacing-xl)', fontSize: '0.75rem', color: 'var(--text-muted)', textAlign: 'center' }}>
          <strong>Test Credentials:</strong><br/>
          Approved: admin@business.com / admin<br/>
          Pending: new@business.com / admin
        </div>
      </div>
    </div>
  );
};

export default Login;
