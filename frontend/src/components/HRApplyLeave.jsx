import { useEffect, useState } from 'react';

function HRApplyLeave({
  user,
  onBack,
  onEmployees,
  onDepartments,
  onApplyLeave,
  onLogout,
}) {
  const [employees, setEmployees] = useState([]);

  const [showForm, setShowForm] = useState(false);

  const [employeeId, setEmployeeId] = useState('');
  const [leaveType, setLeaveType] = useState('CASUAL');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');

  const [loadingEmployees, setLoadingEmployees] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');

  // ==============================
  // LOAD EMPLOYEES
  // ==============================
  useEffect(() => {
    fetchEmployees();
  }, []);

  const fetchEmployees = async () => {
    try {
      setLoadingEmployees(true);
      setMessage('');

      const token = localStorage.getItem('access_token');

      if (!token) {
        setMessage('Session expired. Please login again.');
        return;
      }

      const response = await fetch(
        'http://localhost:3000/users',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || 'Failed to load employees.',
        );
        return;
      }

      const employeeList = Array.isArray(data)
        ? data.filter(
            (item) =>
              String(item.role || '').toUpperCase() ===
              'EMPLOYEE',
          )
        : [];

      setEmployees(employeeList);
    } catch (error) {
      console.error('FETCH EMPLOYEES ERROR:', error);
      setMessage('Cannot connect to backend.');
    } finally {
      setLoadingEmployees(false);
    }
  };

  // ==============================
  // OPEN APPLY LEAVE FORM
  // ==============================
  const openApplyLeave = () => {
    setMessage('');
    setShowForm(true);
  };

  // ==============================
  // CLOSE APPLY LEAVE FORM
  // ==============================
  const closeApplyLeave = () => {
    setShowForm(false);
    setMessage('');

    setEmployeeId('');
    setLeaveType('CASUAL');
    setStartDate('');
    setEndDate('');
    setReason('');
  };

  // ==============================
  // SUBMIT LEAVE
  // ==============================
  const handleSubmit = async (event) => {
    event.preventDefault();

    setMessage('');

    if (!employeeId) {
      setMessage('Please select an employee.');
      return;
    }

    if (!startDate || !endDate) {
      setMessage('Please select start and end dates.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setMessage(
        'End date cannot be before start date.',
      );
      return;
    }

    if (!reason.trim()) {
      setMessage('Please enter a reason.');
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem('access_token');

      if (!token) {
        setMessage('Session expired. Please login again.');
        return;
      }

      const response = await fetch(
        'http://localhost:3000/leaves/apply',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employeeId,
            leaveType,
            startDate,
            endDate,
            reason: reason.trim(),
          }),
        },
      );

      const data = await response.json();

      console.log('HR APPLY LEAVE RESPONSE:', data);

      if (!response.ok) {
        const errorMessage = Array.isArray(data.message)
          ? data.message.join(', ')
          : data.message;

        setMessage(
          errorMessage ||
            'Failed to apply leave.',
        );

        return;
      }

      setMessage(
        'Leave applied successfully for the employee.',
      );

      setEmployeeId('');
      setLeaveType('CASUAL');
      setStartDate('');
      setEndDate('');
      setReason('');
    } catch (error) {
      console.error(
        'HR APPLY LEAVE ERROR:',
        error,
      );

      setMessage(
        'Cannot connect to backend.',
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>

      {/* ==============================
          SIDEBAR
      ============================== */}
      <aside style={styles.sidebar}>

        {/* LOGO */}
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            EL
          </div>

          <div>
            <div style={styles.logoTitle}>
              LeaveFlow
            </div>

            <div style={styles.logoSubtitle}>
              Employee Leave Management
            </div>
          </div>
        </div>

        {/* MENU */}
        <div style={styles.menu}>

          <p style={styles.menuTitle}>
            HR MANAGEMENT
          </p>

          {/* DASHBOARD */}
          <button
            type="button"
            style={styles.menuButton}
            onClick={onBack}
          >
            <span style={styles.menuIcon}>▣</span>
            Dashboard
          </button>

          {/* EMPLOYEES */}
          <button
            type="button"
            style={styles.menuButton}
            onClick={onEmployees}
          >
            <span style={styles.menuIcon}>👥</span>
            Employees
          </button>

          {/* DEPARTMENTS */}
          <button
            type="button"
            style={styles.menuButton}
            onClick={onDepartments}
          >
            <span style={styles.menuIcon}>▦</span>
            Departments
          </button>

          {/* APPLY LEAVE */}
          <button
            type="button"
            style={styles.activeMenu}
            onClick={onApplyLeave}
          >
            <span style={styles.menuIcon}>＋</span>
            Apply Leave
          </button>

          {/* REFRESH */}
          <button
            type="button"
            style={styles.menuButton}
            onClick={fetchEmployees}
          >
            <span style={styles.menuIcon}>↻</span>
            Refresh
          </button>

        </div>

        {/* PROFILE */}
        <div style={styles.adminProfile}>

          <div style={styles.avatar}>
            {(user?.name || 'H')
              .charAt(0)
              .toUpperCase()}
          </div>

          <div style={styles.profileInfo}>
            <strong style={styles.profileName}>
              {user?.name || 'HR'}
            </strong>

            <small style={styles.profileRole}>
              {user?.role || 'HR'}
            </small>
          </div>

        </div>

        {/* LOGOUT */}
        <button
          type="button"
          style={styles.logoutButton}
          onClick={onLogout}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>

      {/* ==============================
          MAIN CONTENT
      ============================== */}
      <main style={styles.main}>
        <div style={styles.content}>

          {/* HEADER */}
          <div style={styles.header}>

            <div>
              <p style={styles.breadcrumb}>
                HR Management / Apply Leave
              </p>

              <h1 style={styles.title}>
                {showForm
                  ? 'Apply Leave'
                  : 'Employee List'}
              </h1>

              <p style={styles.subtitle}>
                {showForm
                  ? 'Apply a leave request on behalf of an employee.'
                  : 'Select an employee to manage their leave request.'}
              </p>
            </div>

            <div style={styles.headerActions}>

              {!showForm && (
                <button
                  type="button"
                  style={styles.applyButton}
                  onClick={openApplyLeave}
                >
                  ＋ Apply Leave
                </button>
              )}

              {showForm && (
                <button
                  type="button"
                  style={styles.backButton}
                  onClick={closeApplyLeave}
                >
                  ← Employee List
                </button>
              )}

            </div>

          </div>

          {/* ==============================
              EMPLOYEE LIST
          ============================== */}
          {!showForm && (
            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div style={styles.cardIcon}>
                  👥
                </div>

                <div>
                  <h2 style={styles.cardTitle}>
                    Employees
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Employee details available for leave application.
                  </p>
                </div>

              </div>

              {message && (
                <div style={styles.errorMessage}>
                  <span>●</span>
                  {message}
                </div>
              )}

              {loadingEmployees ? (
                <div style={styles.loading}>
                  Loading employees...
                </div>
              ) : employees.length === 0 ? (
                <div style={styles.empty}>
                  No employees found.
                </div>
              ) : (
                <div style={styles.tableWrapper}>

                  <table style={styles.table}>

                    <thead>
                      <tr>
                        <th style={styles.th}>
                          EMPLOYEE ID
                        </th>

                        <th style={styles.th}>
                          EMPLOYEE
                        </th>

                        <th style={styles.th}>
                          EMAIL
                        </th>

                        <th style={styles.th}>
                          DEPARTMENT
                        </th>

                        <th style={styles.th}>
                          DESIGNATION
                        </th>

                        <th style={styles.th}>
                          LEAVE BALANCE
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {employees.map(
                        (employee) => (
                          <tr
                            key={
                              employee._id ||
                              employee.id
                            }
                          >

                            <td style={styles.td}>
                              <strong>
                                {employee.employeeId ||
                                  '-'}
                              </strong>
                            </td>

                            <td style={styles.td}>
                              <div style={styles.employeeName}>

                                <div
                                  style={
                                    styles.employeeAvatar
                                  }
                                >
                                  {(employee.name ||
                                    employee.email ||
                                    'E')
                                    .charAt(0)
                                    .toUpperCase()}
                                </div>

                                <span>
                                  {employee.name ||
                                    employee.fullName ||
                                    '-'}
                                </span>

                              </div>
                            </td>

                            <td style={styles.td}>
                              {employee.email || '-'}
                            </td>

                            <td style={styles.td}>
                              {employee.department || '-'}
                            </td>

                            <td style={styles.td}>
                              {employee.designation || '-'}
                            </td>

                            <td style={styles.td}>
                              <span
                                style={
                                  styles.leaveBalance
                                }
                              >
                                {employee.leaveBalance ??
                                  0}{' '}
                                days
                              </span>
                            </td>

                          </tr>
                        ),
                      )}
                    </tbody>

                  </table>

                </div>
              )}

            </section>
          )}

          {/* ==============================
              APPLY LEAVE FORM
          ============================== */}
          {showForm && (
            <section style={styles.card}>

              <div style={styles.cardHeader}>

                <div style={styles.cardIcon}>
                  ＋
                </div>

                <div>
                  <h2 style={styles.cardTitle}>
                    Employee Leave Application
                  </h2>

                  <p style={styles.cardSubtitle}>
                    Fill in the details below to submit leave.
                  </p>
                </div>

              </div>

              {message && (
                <div
                  style={
                    message.includes(
                      'successfully',
                    )
                      ? styles.successMessage
                      : styles.errorMessage
                  }
                >
                  <span>
                    {message.includes(
                      'successfully',
                    )
                      ? '✓'
                      : '●'}
                  </span>

                  {message}
                </div>
              )}

              <form
                onSubmit={handleSubmit}
                style={styles.form}
              >

                {/* SELECT EMPLOYEE */}
                <div style={styles.field}>

                  <label style={styles.label}>
                    SELECT EMPLOYEE
                  </label>

                  <select
                    value={employeeId}
                    onChange={(event) =>
                      setEmployeeId(
                        event.target.value,
                      )
                    }
                    style={styles.input}
                    disabled={
                      loadingEmployees ||
                      submitting
                    }
                  >

                    <option value="">
                      {loadingEmployees
                        ? 'Loading employees...'
                        : 'Select an employee'}
                    </option>

                    {employees.map(
                      (employee) => (
                        <option
                          key={
                            employee._id ||
                            employee.id
                          }
                          value={
                            employee._id ||
                            employee.id
                          }
                        >
                          {employee.employeeId ||
                            'No ID'}
                          {' - '}
                          {employee.name ||
                            employee.email}
                          {' - '}
                          {employee.email}
                        </option>
                      ),
                    )}

                  </select>

                  {!loadingEmployees &&
                    employees.length === 0 && (
                      <small style={styles.helper}>
                        No employees found.
                      </small>
                    )}

                </div>

                {/* LEAVE TYPE */}
                <div style={styles.field}>

                  <label style={styles.label}>
                    LEAVE TYPE
                  </label>

                  <select
                    value={leaveType}
                    onChange={(event) =>
                      setLeaveType(
                        event.target.value,
                      )
                    }
                    style={styles.input}
                    disabled={submitting}
                  >

                    <option value="CASUAL">
                      Casual Leave
                    </option>

                    <option value="SICK">
                      Sick Leave
                    </option>

                    <option value="ANNUAL">
                      Annual Leave
                    </option>

                    <option value="EMERGENCY">
                      Emergency Leave
                    </option>

                    <option value="OTHER">
                      Other
                    </option>

                  </select>

                </div>

                {/* DATES */}
                <div style={styles.twoColumns}>

                  <div style={styles.field}>

                    <label style={styles.label}>
                      START DATE
                    </label>

                    <input
                      type="date"
                      value={startDate}
                      onChange={(event) =>
                        setStartDate(
                          event.target.value,
                        )
                      }
                      style={styles.input}
                      disabled={submitting}
                    />

                  </div>

                  <div style={styles.field}>

                    <label style={styles.label}>
                      END DATE
                    </label>

                    <input
                      type="date"
                      value={endDate}
                      min={
                        startDate ||
                        undefined
                      }
                      onChange={(event) =>
                        setEndDate(
                          event.target.value,
                        )
                      }
                      style={styles.input}
                      disabled={submitting}
                    />

                  </div>

                </div>

                {/* REASON */}
                <div style={styles.field}>

                  <label style={styles.label}>
                    REASON
                  </label>

                  <textarea
                    value={reason}
                    onChange={(event) =>
                      setReason(
                        event.target.value,
                      )
                    }
                    placeholder="Enter the reason for leave..."
                    rows={5}
                    style={styles.textarea}
                    disabled={submitting}
                  />

                </div>

                {/* BUTTONS */}
                <div style={styles.formActions}>

                  <button
                    type="button"
                    onClick={closeApplyLeave}
                    style={styles.cancelButton}
                    disabled={submitting}
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    style={{
                      ...styles.submitButton,
                      opacity: submitting
                        ? 0.6
                        : 1,
                    }}
                    disabled={submitting}
                  >
                    {submitting
                      ? 'Submitting...'
                      : '✓ Apply Leave'}
                  </button>

                </div>

              </form>

            </section>
          )}

          {/* FOOTER */}
          <footer style={styles.footer}>
            © 2026 LeaveFlow · Employee Leave Management System
          </footer>

        </div>
      </main>

    </div>
  );
}

// ======================================
// STYLES
// ======================================

const styles = {
  page: {
    width: '100%',
    height: '100vh',
    display: 'flex',
    background: '#f8fafc',
    color: '#0f172a',
    fontFamily:
      'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    overflow: 'hidden',
  },

  sidebar: {
    width: '240px',
    height: '100vh',
    flexShrink: 0,
    background: '#111827',
    color: '#ffffff',
    padding: '25px 17px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
    overflow: 'hidden',
  },

  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '0 9px',
    marginBottom: '40px',
  },

  logoIcon: {
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    background:
      'linear-gradient(135deg, #6366f1, #8b5cf6)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '800',
  },

  logoTitle: {
    fontSize: '17px',
    fontWeight: '800',
  },

  logoSubtitle: {
    fontSize: '9px',
    color: '#94a3b8',
    marginTop: '2px',
  },

  menu: {
    flex: 1,
  },

  menuTitle: {
    fontSize: '9px',
    fontWeight: '700',
    color: '#64748b',
    letterSpacing: '1.4px',
    padding: '0 11px',
    marginBottom: '10px',
  },

  menuButton: {
    width: '100%',
    height: '44px',
    border: 'none',
    borderRadius: '9px',
    background: 'transparent',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '0 13px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: '5px',
  },

  activeMenu: {
    width: '100%',
    height: '44px',
    border: 'none',
    borderRadius: '9px',
    background: '#312e81',
    color: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '0 13px',
    fontSize: '12px',
    fontWeight: '600',
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: '5px',
  },

  menuIcon: {
    width: '16px',
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },

  adminProfile: {
    borderTop: '1px solid #273449',
    paddingTop: '16px',
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    marginBottom: '11px',
    flexShrink: 0,
  },

  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '800',
    flexShrink: 0,
  },

  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '2px',
    overflow: 'hidden',
  },

  profileName: {
    fontSize: '12px',
    fontWeight: '700',
    color: '#ffffff',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  profileRole: {
    fontSize: '10px',
    color: '#94a3b8',
  },

  logoutButton: {
    width: '100%',
    height: '40px',
    flexShrink: 0,
    borderRadius: '8px',
    border: '1px solid #374151',
    background: 'transparent',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  main: {
    flex: 1,
    minWidth: 0,
    height: '100vh',
    marginLeft: '240px',
    overflowY: 'auto',
    overflowX: 'hidden',
  },

  content: {
    maxWidth: '1150px',
    margin: '0 auto',
    padding: '38px 45px 30px',
    boxSizing: 'border-box',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '28px',
  },

  headerActions: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    flexShrink: 0,
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

  applyButton: {
    height: '44px',
    padding: '0 18px',
    border: 'none',
    borderRadius: '9px',
    background:
      'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    boxShadow:
      '0 4px 12px rgba(79, 70, 229, 0.18)',
  },

  backButton: {
    height: '42px',
    padding: '0 16px',
    border: '1px solid #e2e8f0',
    borderRadius: '9px',
    background: '#ffffff',
    color: '#475569',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
    flexShrink: 0,
  },

  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    overflow: 'hidden',
  },

  cardHeader: {
    padding: '24px 28px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
  },

  cardIcon: {
    width: '44px',
    height: '44px',
    borderRadius: '11px',
    background: '#eef2ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '20px',
    fontWeight: '700',
  },

  cardTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
  },

  cardSubtitle: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: '11px',
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '900px',
  },

  th: {
    padding: '14px 18px',
    textAlign: 'left',
    background: '#f8fafc',
    color: '#64748b',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.6px',
    borderBottom: '1px solid #e2e8f0',
    whiteSpace: 'nowrap',
  },

  td: {
    padding: '16px 18px',
    borderBottom: '1px solid #f1f5f9',
    color: '#475569',
    fontSize: '12px',
    whiteSpace: 'nowrap',
  },

  employeeName: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#0f172a',
    fontWeight: '700',
  },

  employeeAvatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#eef2ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
    flexShrink: 0,
  },

  leaveBalance: {
    display: 'inline-flex',
    padding: '5px 9px',
    borderRadius: '20px',
    background: '#f0fdf4',
    color: '#15803d',
    fontSize: '10px',
    fontWeight: '800',
  },

  loading: {
    padding: '45px',
    textAlign: 'center',
    color: '#64748b',
    fontSize: '13px',
  },

  empty: {
    padding: '45px',
    textAlign: 'center',
    color: '#94a3b8',
    fontSize: '13px',
  },

  successMessage: {
    margin: '20px 28px 0',
    padding: '12px 15px',
    borderRadius: '9px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#15803d',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  errorMessage: {
    margin: '20px 28px',
    padding: '12px 15px',
    borderRadius: '9px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#dc2626',
    fontSize: '12px',
    fontWeight: '600',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },

  form: {
    padding: '28px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
    marginBottom: '20px',
  },

  label: {
    color: '#475569',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '0.7px',
  },

  input: {
    width: '100%',
    height: '44px',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    padding: '0 13px',
    background: '#ffffff',
    color: '#334155',
    fontSize: '12px',
    outline: 'none',
  },

  textarea: {
    width: '100%',
    boxSizing: 'border-box',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    padding: '12px 13px',
    background: '#ffffff',
    color: '#334155',
    fontSize: '12px',
    resize: 'vertical',
    outline: 'none',
    fontFamily: 'inherit',
  },

  twoColumns: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '18px',
  },

  helper: {
    color: '#94a3b8',
    fontSize: '10px',
  },

  formActions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    paddingTop: '10px',
    borderTop: '1px solid #f1f5f9',
  },

  cancelButton: {
    height: '42px',
    padding: '0 18px',
    border: '1px solid #cbd5e1',
    borderRadius: '9px',
    background: '#ffffff',
    color: '#64748b',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  submitButton: {
    height: '42px',
    padding: '0 20px',
    border: 'none',
    borderRadius: '9px',
    background:
      'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#ffffff',
    fontSize: '11px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  footer: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#94a3b8',
    fontSize: '10px',
  },
};

export default HRApplyLeave;