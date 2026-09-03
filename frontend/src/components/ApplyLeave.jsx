import { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  leaveType: Yup.string()
    .required('Please select a leave type'),

  startDate: Yup.date()
    .required('Start date is required'),

  endDate: Yup.date()
    .required('End date is required')
    .min(
      Yup.ref('startDate'),
      'End date cannot be before start date',
    ),

  reason: Yup.string()
    .trim()
    .required('Reason is required')
    .min(5, 'Reason must be at least 5 characters'),
});

function ApplyLeave({ onMyLeaves, onApplyLeave, onLogout }) {
  const [message, setMessage] = useState('');

  const initialValues = {
    leaveType: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
  };

  const handleSubmit = async (
    values,
    { resetForm, setSubmitting },
  ) => {
    setMessage('Submitting leave...');

    try {
      const token = localStorage.getItem('access_token');
      const savedUser = localStorage.getItem('user');

      if (!token || !savedUser) {
        setMessage('Please login again');
        return;
      }

      const user = JSON.parse(savedUser);

      const response = await fetch(
        'http://localhost:3000/leaves/apply',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employeeId: user.id,
            leaveType: values.leaveType,
            startDate: values.startDate,
            endDate: values.endDate,
            reason: values.reason,
          }),
        },
      );

      const data = await response.json();

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message || 'Failed to apply leave';

        setMessage(errorMessage);
        return;
      }

      setMessage('Leave applied successfully!');
      resetForm();
    } catch (error) {
      console.error(error);
      setMessage('Cannot connect to backend');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* SIDEBAR */}
      <aside style={styles.sidebar}>

        <div style={styles.logo}>
          <div style={styles.logoIcon}>EL</div>

          <div>
            <div style={styles.logoTitle}>LeaveFlow</div>
            <div style={styles.logoSubtitle}>
              Management System
            </div>
          </div>
        </div>

        <div style={styles.menu}>
          <p style={styles.menuTitle}>MENU</p>

          <button
            style={styles.activeMenu}
            onClick={onApplyLeave}
          >
            <span>＋</span>
            Apply Leave
          </button>

          <button
            style={styles.menuButton}
            onClick={onMyLeaves}
          >
            <span>☰</span>
            My Leave Requests
          </button>
        </div>

        <div style={styles.sidebarFooter}>

          <div style={styles.securityBox}>
            <span style={styles.securityIcon}>🔒</span>

            <div>
              <strong>Secure Portal</strong>
              <small>Your data is protected</small>
            </div>
          </div>

          <button
            onClick={onLogout}
            style={styles.logoutButton}
          >
            Logout
          </button>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main style={styles.main}>

        <header style={styles.header}>
          <div>
            <p style={styles.breadcrumb}>
              Employee / Apply Leave
            </p>

            <h1 style={styles.title}>
              Apply for Leave
            </h1>

            <p style={styles.subtitle}>
              Submit your leave request for HR approval.
            </p>
          </div>
        </header>

        <div style={styles.content}>

          {/* FORM */}
          <section style={styles.formCard}>

            <div style={styles.cardHeader}>

              <div style={styles.headerIcon}>
                📅
              </div>

              <div>
                <h2 style={styles.cardTitle}>
                  Leave Details
                </h2>

                <p style={styles.cardSubtitle}>
                  Please provide the details for your leave request.
                </p>
              </div>

            </div>

            <Formik
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={handleSubmit}
            >
              {({
                isSubmitting,
                resetForm,
              }) => (
                <Form>

                  {/* LEAVE TYPE */}
                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Leave Type
                    </label>

                    <Field
                      as="select"
                      name="leaveType"
                      style={styles.input}
                    >
                      <option value="Casual Leave">
                        Casual Leave
                      </option>

                      <option value="Sick Leave">
                        Sick Leave
                      </option>

                      <option value="Earned Leave">
                        Earned Leave
                      </option>

                      <option value="Emergency Leave">
                        Emergency Leave
                      </option>
                    </Field>

                    <ErrorMessage
                      name="leaveType"
                      component="div"
                      style={styles.fieldError}
                    />

                  </div>

                  {/* DATES */}
                  <div style={styles.dateGrid}>

                    <div style={styles.formGroup}>

                      <label style={styles.label}>
                        Start Date
                      </label>

                      <Field
                        type="date"
                        name="startDate"
                        style={styles.input}
                      />

                      <ErrorMessage
                        name="startDate"
                        component="div"
                        style={styles.fieldError}
                      />

                    </div>

                    <div style={styles.formGroup}>

                      <label style={styles.label}>
                        End Date
                      </label>

                      <Field
                        type="date"
                        name="endDate"
                        style={styles.input}
                      />

                      <ErrorMessage
                        name="endDate"
                        component="div"
                        style={styles.fieldError}
                      />

                    </div>

                  </div>

                  {/* REASON */}
                  <div style={styles.formGroup}>

                    <label style={styles.label}>
                      Reason for Leave
                    </label>

                    <Field
                      as="textarea"
                      name="reason"
                      placeholder="Tell us why you need leave..."
                      rows="6"
                      style={styles.textarea}
                    />

                    <ErrorMessage
                      name="reason"
                      component="div"
                      style={styles.fieldError}
                    />

                    <small style={styles.helperText}>
                      Please provide a clear reason for your leave request.
                    </small>

                  </div>

                  {/* MESSAGE */}
                  {message && (
                    <div
                      style={
                        message.includes('successfully')
                          ? styles.successMessage
                          : styles.errorMessage
                      }
                    >
                      <span>
                        {message.includes('successfully')
                          ? '✓'
                          : '⚠'}
                      </span>

                      {message}
                    </div>
                  )}

                  {/* BUTTONS */}
                  <div style={styles.actions}>

                    <button
                      type="button"
                      onClick={() => {
                        resetForm();
                        setMessage('');
                      }}
                      style={styles.cancelButton}
                      disabled={isSubmitting}
                    >
                      Clear
                    </button>

                    <button
                      type="submit"
                      style={styles.submitButton}
                      disabled={isSubmitting}
                    >
                      {isSubmitting
                        ? 'Submitting...'
                        : 'Submit Leave Request'}

                      <span>→</span>
                    </button>

                  </div>

                </Form>
              )}
            </Formik>

          </section>

          {/* INFORMATION CARD */}
          <aside style={styles.infoCard}>

            <div style={styles.infoTop}>

              <div style={styles.infoIcon}>
                💡
              </div>

              <h2 style={styles.infoTitle}>
                Leave Request Guide
              </h2>

            </div>

            <div style={styles.guideItem}>
              <div style={styles.guideNumber}>1</div>

              <div>
                <strong>Select leave type</strong>

                <p>
                  Choose the type of leave that best matches your request.
                </p>
              </div>
            </div>

            <div style={styles.guideItem}>
              <div style={styles.guideNumber}>2</div>

              <div>
                <strong>Choose your dates</strong>

                <p>
                  Select the start and end dates for your leave.
                </p>
              </div>
            </div>

            <div style={styles.guideItem}>
              <div style={styles.guideNumber}>3</div>

              <div>
                <strong>Add a reason</strong>

                <p>
                  Explain the reason clearly to help HR review your request.
                </p>
              </div>
            </div>

            <div style={styles.notice}>

              <span>⏱</span>

              <div>
                <strong>What happens next?</strong>

                <p>
                  Your request will be sent to HR for review.
                  You can track the status from My Leave Requests.
                </p>
              </div>

            </div>

          </aside>

        </div>

        <footer style={styles.footer}>
          © 2026 LeaveFlow · Employee Leave Management System
        </footer>

      </main>

    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    width: '100%',
    display: 'flex',
    background: '#f8fafc',
    color: '#0f172a',
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
  },

  sidebar: {
    width: '255px',
    height: '100vh',
    flexShrink: 0,
    background: '#111827',
    color: '#ffffff',
    padding: '26px 18px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    overflowY: 'auto',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 10px',
    marginBottom: '45px',
  },

  logoIcon: {
    width: '42px',
    height: '42px',
    borderRadius: '12px',
    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
    fontWeight: '800',
  },

  logoTitle: {
    fontSize: '17px',
    fontWeight: '800',
  },

  logoSubtitle: {
    fontSize: '10px',
    color: '#94a3b8',
    marginTop: '2px',
  },

  menu: {
    flex: 1,
  },

  menuTitle: {
    fontSize: '10px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '1.5px',
    padding: '0 12px',
    marginBottom: '12px',
  },

  menuButton: {
    width: '100%',
    height: '46px',
    border: 'none',
    borderRadius: '10px',
    background: 'transparent',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 14px',
    fontSize: '13px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: '6px',
  },

  activeMenu: {
    width: '100%',
    height: '46px',
    border: 'none',
    borderRadius: '10px',
    background: '#312e81',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 14px',
    fontSize: '13px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: '6px',
  },

  sidebarFooter: {
    borderTop: '1px solid #273449',
    paddingTop: '20px',
  },

  securityBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#cbd5e1',
    marginBottom: '15px',
  },

  securityIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },

  logoutButton: {
    width: '100%',
    height: '42px',
    border: '1px solid #374151',
    borderRadius: '9px',
    background: '#1f2937',
    color: '#fca5a5',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  main: {
    flex: 1,
    minWidth: 0,
    marginLeft: '255px',
    minHeight: '100vh',
    padding: '38px 45px',
    boxSizing: 'border-box',
    overflowY: 'auto',
  },

  header: {
    marginBottom: '28px',
  },

  breadcrumb: {
    margin: '0 0 8px',
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '600',
  },

  title: {
    margin: 0,
    fontSize: '30px',
    fontWeight: '800',
    letterSpacing: '-0.7px',
  },

  subtitle: {
    margin: '7px 0 0',
    color: '#64748b',
    fontSize: '14px',
  },

  content: {
    display: 'grid',
    gridTemplateColumns: 'minmax(0, 1.5fr) minmax(300px, 0.8fr)',
    gap: '22px',
    alignItems: 'start',
  },

  formCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    padding: '30px',
    boxSizing: 'border-box',
  },

  cardHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    paddingBottom: '22px',
    marginBottom: '24px',
    borderBottom: '1px solid #f1f5f9',
  },

  headerIcon: {
    width: '48px',
    height: '48px',
    borderRadius: '13px',
    background: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '22px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '19px',
    fontWeight: '800',
  },

  cardSubtitle: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: '11px',
  },

  formGroup: {
    marginBottom: '21px',
  },

  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#334155',
    fontSize: '12px',
    fontWeight: '700',
  },

  input: {
    width: '100%',
    height: '48px',
    padding: '0 14px',
    borderRadius: '10px',
    border: '1px solid #dbe2ea',
    background: '#f8fafc',
    color: '#111827',
    fontSize: '13px',
    outline: 'none',
    boxSizing: 'border-box',
  },

  dateGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '15px',
  },

  textarea: {
    width: '100%',
    minHeight: '135px',
    padding: '13px 14px',
    borderRadius: '10px',
    border: '1px solid #dbe2ea',
    background: '#f8fafc',
    color: '#111827',
    fontSize: '13px',
    outline: 'none',
    resize: 'vertical',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },

  fieldError: {
    marginTop: '6px',
    color: '#dc2626',
    fontSize: '11px',
    fontWeight: '600',
  },

  helperText: {
    display: 'block',
    marginTop: '7px',
    color: '#94a3b8',
    fontSize: '10px',
  },

  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '12px 14px',
    borderRadius: '10px',
    background: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    fontSize: '12px',
    fontWeight: '650',
    marginBottom: '18px',
  },

  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '12px 14px',
    borderRadius: '10px',
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    fontSize: '12px',
    fontWeight: '650',
    marginBottom: '18px',
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    paddingTop: '5px',
  },

  cancelButton: {
    height: '46px',
    padding: '0 20px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#64748b',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  submitButton: {
    height: '46px',
    padding: '0 20px',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    boxShadow: '0 6px 15px rgba(79, 70, 229, 0.2)',
  },

  infoCard: {
    background: '#111827',
    color: '#ffffff',
    borderRadius: '18px',
    padding: '27px',
    boxSizing: 'border-box',
  },

  infoTop: {
    marginBottom: '25px',
  },

  infoIcon: {
    width: '45px',
    height: '45px',
    borderRadius: '12px',
    background: '#312e81',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    marginBottom: '13px',
  },

  infoTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
  },

  guideItem: {
    display: 'flex',
    gap: '12px',
    paddingBottom: '19px',
    marginBottom: '19px',
    borderBottom: '1px solid #273449',
  },

  guideNumber: {
    minWidth: '27px',
    height: '27px',
    borderRadius: '50%',
    background: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
  },

  notice: {
    display: 'flex',
    gap: '11px',
    background: '#1e293b',
    borderRadius: '12px',
    padding: '14px',
    color: '#cbd5e1',
    fontSize: '11px',
  },

  footer: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#94a3b8',
    fontSize: '10px',
  },
};

export default ApplyLeave;