import { useEffect, useState } from 'react';

function MyLeaves({
  user,
  onMyLeaves,
  onApplyLeave,
  onLogout,
}) {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  const loadLeaves = async () => {
    setLoading(true);
    setMessage('');

    try {
      const token = localStorage.getItem('access_token');

      const response = await fetch('http://localhost:3000/leaves', {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || 'Failed to load leave requests');
        setLeaves([]);
        return;
      }

      const employeeLeaves = Array.isArray(data)
        ? data.filter((leave) => {
            const employeeId =
              leave.employeeId?._id ||
              leave.employeeId?.id ||
              leave.employeeId;

            return String(employeeId) === String(user?.id);
          })
        : [];

      setLeaves(employeeLeaves);
    } catch (error) {
      console.error('Load leaves error:', error);
      setMessage('Cannot connect to backend');
      setLeaves([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaves();
  }, []);

  const getStatusStyle = (status) => {
    const value = String(status).toUpperCase();

    if (value === 'APPROVED') {
      return {
        background: '#dcfce7',
        color: '#15803d',
      };
    }

    if (value === 'REJECTED') {
      return {
        background: '#fee2e2',
        color: '#dc2626',
      };
    }

    return {
      background: '#fef3c7',
      color: '#b45309',
    };
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
            type="button"
            style={styles.menuButton}
            onClick={onApplyLeave}
          >
            <span style={styles.menuIcon}>＋</span>
            Apply Leave
          </button>

          <button
            type="button"
            style={styles.activeMenu}
            onClick={onMyLeaves}
          >
            <span style={styles.menuIcon}>☰</span>
            My Leave Requests
          </button>
        </div>

        <div style={styles.sidebarFooter}>

          <div style={styles.userBox}>
            <div style={styles.avatar}>
              {(user?.name || 'E').charAt(0).toUpperCase()}
            </div>

            <div style={styles.userInfo}>
              <strong>{user?.name || 'Employee'}</strong>
              <small>{user?.role || 'EMPLOYEE'}</small>
            </div>
          </div>

          <button
            type="button"
            style={styles.logoutButton}
            onClick={onLogout}
          >
            Logout
          </button>

        </div>
      </aside>

      {/* MAIN */}
      <main style={styles.main}>

        {/* HEADER */}
        <header style={styles.header}>

          <div>
            <p style={styles.breadcrumb}>
              Leave Management / My Leave Requests
            </p>

            <h1 style={styles.title}>
              My Leave Requests
            </h1>

            <p style={styles.subtitle}>
              View and track all your submitted leave requests.
            </p>
          </div>

          <button
            type="button"
            style={styles.applyButton}
            onClick={onApplyLeave}
          >
            + Apply Leave
          </button>

        </header>

        {/* SUMMARY */}
        <section style={styles.summaryCard}>

          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>
              Employee
            </span>

            <strong style={styles.summaryValue}>
              {user?.name || '-'}
            </strong>
          </div>

          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>
              Email
            </span>

            <strong style={styles.summaryValue}>
              {user?.email || '-'}
            </strong>
          </div>

          <div style={styles.summaryItem}>
            <span style={styles.summaryLabel}>
              Total Requests
            </span>

            <strong style={styles.summaryValue}>
              {leaves.length}
            </strong>
          </div>

        </section>

        {/* ERROR MESSAGE */}
        {message && (
          <div style={styles.errorMessage}>
            <span>⚠</span>
            {message}
          </div>
        )}

        {/* LEAVE HISTORY */}
        <section style={styles.card}>

          <div style={styles.cardHeader}>

            <div>
              <h2 style={styles.cardTitle}>
                Leave History
              </h2>

              <p style={styles.cardSubtitle}>
                Your submitted leave applications
              </p>
            </div>

            <button
              type="button"
              style={styles.refreshButton}
              onClick={loadLeaves}
            >
              ↻ Refresh
            </button>

          </div>

          {/* LOADING */}
          {loading && (
            <div style={styles.emptyState}>
              <div style={styles.loadingIcon}>
                ⏳
              </div>

              <h3 style={styles.emptyStateTitle}>
                Loading requests...
              </h3>

              <p style={styles.emptyStateText}>
                Please wait while we load your leave requests.
              </p>
            </div>
          )}

          {/* NO REQUESTS */}
          {!loading && leaves.length === 0 && (
            <div style={styles.emptyState}>

              <div style={styles.emptyIcon}>
                📋
              </div>

              <h3 style={styles.emptyStateTitle}>
                No leave requests yet
              </h3>

              <p style={styles.emptyStateText}>
                You haven't submitted any leave requests.
              </p>

              <button
                type="button"
                style={styles.emptyButton}
                onClick={onApplyLeave}
              >
                Apply for Leave
              </button>

            </div>
          )}

          {/* TABLE */}
          {!loading && leaves.length > 0 && (
            <div style={styles.tableWrapper}>

              <table style={styles.table}>

                <thead>
                  <tr>
                    <th style={styles.th}>Leave Type</th>
                    <th style={styles.th}>Start Date</th>
                    <th style={styles.th}>End Date</th>
                    <th style={styles.th}>Reason</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>

                <tbody>

                  {leaves.map((leave, index) => {

                    const status =
                      leave.status ||
                      leave.leaveStatus ||
                      'PENDING';

                    return (
                      <tr key={leave._id || index}>

                        <td style={styles.td}>
                          <strong style={styles.leaveType}>
                            {leave.leaveType || '-'}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          {formatDate(leave.startDate)}
                        </td>

                        <td style={styles.td}>
                          {formatDate(leave.endDate)}
                        </td>

                        <td style={styles.tdReason}>
                          {leave.reason || '-'}
                        </td>

                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.status,
                              ...getStatusStyle(status),
                            }}
                          >
                            {String(status).toUpperCase()}
                          </span>
                        </td>

                      </tr>
                    );
                  })}

                </tbody>

              </table>

            </div>
          )}

        </section>

        <footer style={styles.footer}>
          © 2026 LeaveFlow · Employee Leave Management System
        </footer>

      </main>
    </div>
  );
}

/* DATE FORMAT */
function formatDate(date) {
  if (!date) {
    return '-';
  }

  const value = new Date(date);

  if (Number.isNaN(value.getTime())) {
    return date;
  }

  return value.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

/* STYLES */
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
    minHeight: '100vh',
    background: '#111827',
    color: '#ffffff',
    padding: '26px 18px',
    boxSizing: 'border-box',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    left: 0,
    top: 0,
    bottom: 0,
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

  menuIcon: {
    width: '20px',
    textAlign: 'center',
    fontSize: '16px',
  },

  sidebarFooter: {
    borderTop: '1px solid #273449',
    paddingTop: '18px',
  },

  userBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '15px',
  },

  avatar: {
    width: '36px',
    height: '36px',
    borderRadius: '10px',
    background: '#312e81',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
  },

  userInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
    overflow: 'hidden',
  },

  logoutButton: {
    width: '100%',
    height: '40px',
    border: '1px solid #374151',
    borderRadius: '9px',
    background: '#1f2937',
    color: '#cbd5e1',
    cursor: 'pointer',
    fontSize: '12px',
    fontWeight: '600',
  },

  main: {
    flex: 1,
    minWidth: 0,
    marginLeft: '255px',
    padding: '38px 45px',
    boxSizing: 'border-box',
  },

  header: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
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

  applyButton: {
    height: '44px',
    padding: '0 18px',
    border: 'none',
    borderRadius: '10px',
    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  summaryCard: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    marginBottom: '22px',
    overflow: 'hidden',
  },

  summaryItem: {
    padding: '20px 24px',
    borderRight: '1px solid #f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },

  summaryLabel: {
    fontSize: '11px',
    color: '#94a3b8',
    fontWeight: '600',
  },

  summaryValue: {
    fontSize: '15px',
    color: '#1e293b',
  },

  card: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    padding: '28px',
  },

  cardHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '22px',
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

  refreshButton: {
    height: '36px',
    padding: '0 13px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    background: '#ffffff',
    color: '#475569',
    fontSize: '11px',
    fontWeight: '600',
    cursor: 'pointer',
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
  },

  th: {
    textAlign: 'left',
    padding: '14px 12px',
    background: '#f8fafc',
    borderBottom: '1px solid #e2e8f0',
    color: '#64748b',
    fontSize: '11px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },

  td: {
    padding: '17px 12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#475569',
    fontSize: '12px',
    verticalAlign: 'top',
  },

  leaveType: {
    color: '#1e293b',
    fontSize: '12px',
  },

  tdReason: {
    padding: '17px 12px',
    borderBottom: '1px solid #f1f5f9',
    color: '#64748b',
    fontSize: '12px',
    maxWidth: '280px',
    verticalAlign: 'top',
    lineHeight: '1.5',
  },

  status: {
    display: 'inline-block',
    padding: '6px 10px',
    borderRadius: '20px',
    fontSize: '10px',
    fontWeight: '800',
  },

  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: '#64748b',
  },

  emptyIcon: {
    fontSize: '42px',
    marginBottom: '12px',
  },

  loadingIcon: {
    fontSize: '32px',
    marginBottom: '10px',
  },

  emptyStateTitle: {
    margin: '10px 0 6px',
    color: '#334155',
    fontSize: '16px',
    fontWeight: '700',
  },

  emptyStateText: {
    margin: '0 0 20px',
    color: '#64748b',
    fontSize: '12px',
  },

  emptyButton: {
    height: '42px',
    padding: '0 18px',
    border: 'none',
    borderRadius: '9px',
    background: '#4f46e5',
    color: '#ffffff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  errorMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    marginBottom: '20px',
    padding: '12px 15px',
    borderRadius: '10px',
    background: '#fef2f2',
    color: '#dc2626',
    border: '1px solid #fecaca',
    fontSize: '12px',
    fontWeight: '600',
  },

  footer: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#94a3b8',
    fontSize: '10px',
  },
};

export default MyLeaves;