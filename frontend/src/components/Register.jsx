import axios from 'axios';
import { useFormik } from 'formik';
import * as Yup from 'yup';

function Register({ onBackToLogin }) {
  const validationSchema = Yup.object({
    name: Yup.string()
      .trim()
      .required('Full name is required'),

    email: Yup.string()
      .trim()
      .email('Enter a valid email address')
      .required('Email is required'),

    password: Yup.string()
      .min(6, 'Password must be at least 6 characters')
      .required('Password is required'),
  });

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      password: '',
    },

    validationSchema,

    onSubmit: async (values, { resetForm, setSubmitting, setStatus }) => {
      setStatus('');

      try {
        await axios.post('http://localhost:3000/users/register', {
          name: values.name.trim(),
          email: values.email.trim(),
          password: values.password,
          role: 'EMPLOYEE',
        });

        setStatus({
          type: 'success',
          text: 'Registration successful. You can login now.',
        });

        resetForm();
      } catch (error) {
        console.error(error);

        setStatus({
          type: 'error',
          text:
            error.response?.data?.message ||
            'Cannot connect to backend',
        });
      } finally {
        setSubmitting(false);
      }
    },
  });

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
            Create your employee account and manage your leave
            requests from one simple and powerful platform.
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
            <h2 style={styles.title}>Create Employee Account</h2>

            <p style={styles.subtitle}>
              Fill in your details to get started
            </p>
          </div>

          <form onSubmit={formik.handleSubmit}>

            {/* Full Name */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Full Name</label>

              <input
                type="text"
                name="name"
                placeholder="Enter your name"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />

              {formik.touched.name && formik.errors.name && (
                <div style={styles.validationError}>
                  {formik.errors.name}
                </div>
              )}
            </div>

            {/* Email */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Email Address</label>

              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />

              {formik.touched.email && formik.errors.email && (
                <div style={styles.validationError}>
                  {formik.errors.email}
                </div>
              )}
            </div>

            {/* Password */}
            <div style={styles.inputGroup}>
              <label style={styles.label}>Password</label>

              <input
                type="password"
                name="password"
                placeholder="Create a password"
                value={formik.values.password}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                style={styles.input}
              />

              {formik.touched.password && formik.errors.password && (
                <div style={styles.validationError}>
                  {formik.errors.password}
                </div>
              )}
            </div>

            {/* No Role Selection */}
            <div style={styles.employeeInfo}>
              <span style={styles.infoIcon}>✓</span>

              <div>
                <div style={styles.infoTitle}>Employee Account</div>

                <div style={styles.infoText}>
                  New registrations are created as employees.
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={formik.isSubmitting}
              style={{
                ...styles.registerButton,
                opacity: formik.isSubmitting ? 0.7 : 1,
                cursor: formik.isSubmitting
                  ? 'not-allowed'
                  : 'pointer',
              }}
            >
              {formik.isSubmitting
                ? 'Creating Account...'
                : 'Create Employee Account'}
            </button>
          </form>

          {formik.status && (
            <div
              style={
                formik.status.type === 'success'
                  ? styles.successMessage
                  : styles.errorMessage
              }
            >
              {formik.status.text}
            </div>
          )}

          <div style={styles.divider}>
            <span>ALREADY HAVE AN ACCOUNT?</span>
          </div>

          <button
            type="button"
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

  validationError: {
    marginTop: '6px',
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: '500',
  },

  employeeInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '12px 14px',
    marginBottom: '17px',
    borderRadius: '12px',
    background: '#eef2ff',
    border: '1px solid #c7d2fe',
  },

  infoIcon: {
    width: '23px',
    height: '23px',
    borderRadius: '50%',
    background: '#dcfce7',
    color: '#16a34a',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '800',
    flexShrink: 0,
  },

  infoTitle: {
    color: '#3730a3',
    fontSize: '13px',
    fontWeight: '700',
    marginBottom: '2px',
  },

  infoText: {
    color: '#64748b',
    fontSize: '11px',
  },

  registerButton: {
    width: '100%',
    height: '52px',
    marginTop: '2px',
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