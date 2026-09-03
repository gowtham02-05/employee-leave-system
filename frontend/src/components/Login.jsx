import { useState } from 'react';
import axios from 'axios';

function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('Logging in...');

    try {
      const response = await axios.post(
        'http://localhost:3000/auth/login',
        {
          email,
          password,
        }
      );

      const data = response.data;

      console.log('LOGIN RESPONSE:', data);

      const loggedInUser = data.user || data;

      console.log('LOGGED IN USER:', loggedInUser);
      console.log('ROLE:', loggedInUser.role);

      if (data.access_token) {
        localStorage.setItem(
          'access_token',
          data.access_token
        );
      }

      localStorage.setItem(
        'user',
        JSON.stringify(loggedInUser)
      );

      onLogin(loggedInUser);
    } catch (error) {
      console.error('LOGIN ERROR:', error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        'Login failed';

      setMessage(
        Array.isArray(errorMessage)
          ? errorMessage.join(', ')
          : errorMessage
      );
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.backgroundCircleOne}></div>
      <div style={styles.backgroundCircleTwo}></div>

      <div style={styles.container}>

        {/* Left Section */}
        <div style={styles.heroSection}>
          <div style={styles.logoBox}>EL</div>

          <h1 style={styles.heroTitle}>
            Employee Leave
            <br />
            Management
          </h1>

          <p style={styles.heroText}>
            Manage your leaves easily, track requests,
            and stay connected with your organization.
          </p>

          <div style={styles.featureList}>
            <div style={styles.feature}>
              <span style={styles.check}>✓</span>
              Easy leave application
            </div>

            <div style={styles.feature}>
              <span style={styles.check}>✓</span>
              Real-time leave status
            </div>

            <div style={styles.feature}>
              <span style={styles.check}>✓</span>
              Simple HR approval
            </div>
          </div>
        </div>

        {/* Login Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Welcome Back 👋</h2>

            <p style={styles.subtitle}>
              Sign in to continue to your account
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Email Address
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <button
              type="submit"
              style={styles.loginButton}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow =
                  '0 10px 25px rgba(79, 70, 229, 0.35)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow =
                  '0 6px 15px rgba(79, 70, 229, 0.25)';
              }}
            >
              Sign In
            </button>
          </form>

          {message && (
            <div style={styles.message}>
              {message}
            </div>
          )}

          <p style={styles.footerText}>
            Employee Leave Management System
          </p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      'linear-gradient(135deg, #eef2ff 0%, #f8fafc 50%, #e0e7ff 100%)',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    position: 'relative',
    overflow: 'hidden',
    padding: '30px',
    boxSizing: 'border-box',
  },

  backgroundCircleOne: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.12)',
    top: '-180px',
    left: '-150px',
  },

  backgroundCircleTwo: {
    position: 'absolute',
    width: '500px',
    height: '500px',
    borderRadius: '50%',
    background: 'rgba(139, 92, 246, 0.10)',
    bottom: '-250px',
    right: '-200px',
  },

  container: {
    width: '100%',
    maxWidth: '1050px',
    display: 'grid',
    gridTemplateColumns: '1fr 430px',
    gap: '70px',
    alignItems: 'center',
    position: 'relative',
    zIndex: 2,
  },

  heroSection: {
    padding: '20px',
  },

  logoBox: {
    width: '58px',
    height: '58px',
    borderRadius: '16px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '21px',
    fontWeight: '800',
    letterSpacing: '1px',
    boxShadow: '0 10px 25px rgba(79, 70, 229, 0.3)',
    marginBottom: '28px',
  },

  heroTitle: {
    fontSize: '52px',
    lineHeight: '1.08',
    margin: '0 0 22px',
    color: '#111827',
    fontWeight: '800',
    letterSpacing: '-1.5px',
  },

  heroText: {
    maxWidth: '500px',
    color: '#64748b',
    fontSize: '17px',
    lineHeight: '1.7',
    marginBottom: '30px',
  },

  featureList: {
    display: 'flex',
    flexDirection: 'column',
    gap: '14px',
  },

  feature: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    color: '#334155',
    fontSize: '15px',
    fontWeight: '600',
  },

  check: {
    width: '24px',
    height: '24px',
    borderRadius: '50%',
    background: '#dcfce7',
    color: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
  },

  card: {
    background: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '24px',
    padding: '38px',
    boxShadow: '0 25px 60px rgba(15, 23, 42, 0.12)',
    border: '1px solid rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(12px)',
  },

  cardHeader: {
    marginBottom: '30px',
  },

  title: {
    margin: '0 0 8px',
    fontSize: '28px',
    color: '#111827',
    fontWeight: '750',
  },

  subtitle: {
    margin: 0,
    color: '#64748b',
    fontSize: '14px',
  },

  inputGroup: {
    marginBottom: '20px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#334155',
    fontSize: '14px',
    fontWeight: '650',
  },

  input: {
    width: '100%',
    height: '50px',
    padding: '0 15px',
    borderRadius: '12px',
    border: '1px solid #dbe2ea',
    background: '#f8fafc',
    color: '#111827',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
    transition: '0.2s',
  },

  loginButton: {
    width: '100%',
    height: '52px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: '0.2s',
    boxShadow: '0 6px 15px rgba(79, 70, 229, 0.25)',
  },

  message: {
    marginTop: '15px',
    padding: '12px',
    borderRadius: '10px',
    background: '#fef2f2',
    color: '#dc2626',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
  },

  footerText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '11px',
    margin: '22px 0 0',
  },
};

export default Login;