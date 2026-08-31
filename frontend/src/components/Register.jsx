import { useState } from 'react';

function Register({ onBackToLogin }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('EMPLOYEE');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage('Registering...');

    try {
      const response = await fetch('http://localhost:3000/users/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          password,
          role,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Registration failed');
        return;
      }

      setMessage('Registration successful. You can login now.');

      setName('');
      setEmail('');
      setPassword('');
      setRole('EMPLOYEE');
    } catch (error) {
      console.error(error);
      setMessage('Cannot connect to backend');
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.circleOne}></div>
      <div style={styles.circleTwo}></div>

      <div style={styles.container}>

        {/* Left Section */}
        <div style={styles.heroSection}>
          <div style={styles.logoBox}>EL</div>

          <h1 style={styles.heroTitle}>
            Join Your
            <br />
            Organization
          </h1>

          <p style={styles.heroText}>
            Create your account and manage your leave requests
            from one simple and powerful platform.
          </p>

          <div style={styles.featureList}>
            <div style={styles.feature}>
              <span style={styles.check}>✓</span>
              Apply and manage leaves
            </div>

            <div style={styles.feature}>
              <span style={styles.check}>✓</span>
              Track leave status
            </div>

            <div style={styles.feature}>
              <span style={styles.check}>✓</span>
              Secure account access
            </div>
          </div>
        </div>

        {/* Register Card */}
        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <h2 style={styles.title}>Create Account</h2>

            <p style={styles.subtitle}>
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={handleSubmit}>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>

              <input
                type="text"
                placeholder="Enter your name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>

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
              <label style={styles.label}>Password</label>

              <input
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                style={styles.input}
              />
            </div>

            <div style={styles.inputGroup}>
              <label style={styles.label}>Account Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                style={styles.input}
              >
                <option value="EMPLOYEE">Employee</option>
                <option value="HR">HR</option>
                <option value="ADMIN">Admin</option>
              </select>
            </div>

            <button
              type="submit"
              style={styles.registerButton}
            >
              Create Account
            </button>
          </form>

          {message && (
            <div
              style={
                message.includes('successful')
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {message}
            </div>
          )}

          <div style={styles.divider}>
            <span>ALREADY HAVE AN ACCOUNT?</span>
          </div>

          <button
            onClick={onBackToLogin}
            style={styles.loginButton}
          >
            Back to Login
          </button>

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

  circleOne: {
    position: 'absolute',
    width: '420px',
    height: '420px',
    borderRadius: '50%',
    background: 'rgba(99, 102, 241, 0.12)',
    top: '-180px',
    left: '-150px',
  },

  circleTwo: {
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
    marginBottom: '25px',
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
    marginBottom: '17px',
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
    height: '48px',
    padding: '0 15px',
    borderRadius: '12px',
    border: '1px solid #dbe2ea',
    background: '#f8fafc',
    color: '#111827',
    fontSize: '14px',
    outline: 'none',
    boxSizing: 'border-box',
  },

  registerButton: {
    width: '100%',
    height: '52px',
    marginTop: '5px',
    border: 'none',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#ffffff',
    fontSize: '15px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow: '0 6px 15px rgba(79, 70, 229, 0.25)',
  },

  successMessage: {
    marginTop: '15px',
    padding: '12px',
    borderRadius: '10px',
    background: '#f0fdf4',
    color: '#15803d',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
  },

  errorMessage: {
    marginTop: '15px',
    padding: '12px',
    borderRadius: '10px',
    background: '#fef2f2',
    color: '#dc2626',
    textAlign: 'center',
    fontSize: '13px',
    fontWeight: '600',
  },

  divider: {
    textAlign: 'center',
    margin: '22px 0 14px',
    color: '#94a3b8',
    fontSize: '10px',
    fontWeight: '700',
  },

  loginButton: {
    width: '100%',
    height: '50px',
    borderRadius: '12px',
    border: '1px solid #c7d2fe',
    background: '#eef2ff',
    color: '#4f46e5',
    fontSize: '14px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  footerText: {
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '11px',
    margin: '20px 0 0',
  },
};

export default Register;