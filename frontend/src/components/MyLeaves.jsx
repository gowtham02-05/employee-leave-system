import { useEffect, useState } from 'react';

function MyLeaves({ onBack }) {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('Loading leave requests...');

  useEffect(() => {
    const fetchLeaves = async () => {
      try {
        const token = localStorage.getItem('access_token');

        const response = await fetch('http://localhost:3000/leaves', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();

        if (!response.ok) {
          setMessage(data.message || 'Failed to load leaves');
          return;
        }

        setLeaves(data);
        setMessage('');
      } catch (error) {
        console.error(error);
        setMessage('Cannot connect to backend');
      }
    };

    fetchLeaves();
  }, []);

  const getStatusStyle = (status) => {
    const normalizedStatus = (status || 'PENDING').toUpperCase();

    if (normalizedStatus === 'APPROVED') {
      return {
        background: '#dcfce7',
        color: '#15803d',
      };
    }

    if (normalizedStatus === 'REJECTED') {
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

  const getStatusIcon = (status) => {
    const normalizedStatus = (status || 'PENDING').toUpperCase();

    if (normalizedStatus === 'APPROVED') {
      return '✓';
    }

    if (normalizedStatus === 'REJECTED') {
      return '✕';
    }

    return '◷';
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
    <div style={styles.page}>
      {/* Sidebar */}
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

        <div style={styles.sidebarMenu}>
          <p style={styles.menuTitle}>MENU</p>

          <button
            style={styles.menuButton}
            onClick={onBack}
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            style={styles.menuButton}
            onClick={onBack}
          >
            <span>＋</span>
            Apply Leave
          </button>

          <button style={styles.activeMenu}>
            <span>☰</span>
            My Leave Requests
          </button>
        </div>

        <div style={styles.sidebarFooter}>
          <div style={styles.helpBox}>
            <div style={styles.helpIcon}>?</div>

            <div>
              <strong>Need help?</strong>
              <small>Contact your HR team</small>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <p style={styles.breadcrumb}>
              Dashboard / My Leaves
            </p>

            <h1 style={styles.title}>
              My Leave Requests
            </h1>

            <p style={styles.subtitle}>
              Track and manage all your leave requests in one place.
            </p>
          </div>

          <button
            onClick={onBack}
            style={styles.backButton}
          >
            ← Back to Dashboard
          </button>
        </header>

        {/* Summary */}
        <section style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>📋</div>

            <div>
              <p style={styles.summaryLabel}>TOTAL REQUESTS</p>
              <h2 style={styles.summaryNumber}>
                {leaves.length}
              </h2>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: '#fef3c7',
              }}
            >
              ◷
            </div>

            <div>
              <p style={styles.summaryLabel}>PENDING</p>
              <h2 style={styles.summaryNumber}>
                {
                  leaves.filter(
                    (leave) =>
                      (leave.status || 'PENDING').toUpperCase() ===
                      'PENDING'
                  ).length
                }
              </h2>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: '#dcfce7',
              }}
            >
              ✓
            </div>

            <div>
              <p style={styles.summaryLabel}>APPROVED</p>
              <h2 style={styles.summaryNumber}>
                {
                  leaves.filter(
                    (leave) =>
                      (leave.status || '').toUpperCase() ===
                      'APPROVED'
                  ).length
                }
              </h2>
            </div>
          </div>

          <div style={styles.summaryCard}>
            <div
              style={{
                ...styles.summaryIcon,
                background: '#fee2e2',
              }}
            >
              ✕
            </div>

            <div>
              <p style={styles.summaryLabel}>REJECTED</p>
              <h2 style={styles.summaryNumber}>
                {
                  leaves.filter(
                    (leave) =>
                      (leave.status || '').toUpperCase() ===
                      'REJECTED'
                  ).length
                }
              </h2>
            </div>
          </div>
        </section>

        {/* Leave Table */}
        <section style={styles.tableCard}>
          <div style={styles.tableHeader}>
            <div>
              <h2 style={styles.tableTitle}>
                Leave History
              </h2>

              <p style={styles.tableSubtitle}>
                Your submitted leave requests
              </p>
            </div>

            <div style={styles.requestCount}>
              {leaves.length} Request{leaves.length !== 1 ? 's' : ''}
            </div>
          </div>

          {message && (
            <div style={styles.loadingBox}>
              <div style={styles.loadingIcon}>⟳</div>
              <p>{message}</p>
            </div>
          )}

          {!message && leaves.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>

              <h3>No Leave Requests</h3>

              <p>
                You haven't submitted any leave requests yet.
              </p>

              <button
                onClick={onBack}
                style={styles.emptyButton}
              >
                Go to Dashboard
              </button>
            </div>
          )}

          {!message && leaves.length > 0 && (
            <div style={styles.tableWrapper}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>LEAVE TYPE</th>
                    <th style={styles.th}>START DATE</th>
                    <th style={styles.th}>END DATE</th>
                    <th style={styles.th}>REASON</th>
                    <th style={styles.th}>STATUS</th>
                  </tr>
                </thead>

                <tbody>
                  {leaves.map((leave) => {
                    const status =
                      (leave.status || 'PENDING').toUpperCase();

                    return (
                      <tr key={leave._id}>
                        <td style={styles.td}>
                          <div style={styles.leaveType}>
                            <div style={styles.leaveIcon}>
                              📅
                            </div>

                            <div>
                              <strong>
                                {leave.leaveType}
                              </strong>

                              <small>
                                Leave Request
                              </small>
                            </div>
                          </div>
                        </td>

                        <td style={styles.td}>
                          <strong style={styles.dateText}>
                            {formatDate(leave.startDate)}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <strong style={styles.dateText}>
                            {formatDate(leave.endDate)}
                          </strong>
                        </td>

                        <td style={styles.td}>
                          <span style={styles.reason}>
                            {leave.reason || 'No reason provided'}
                          </span>
                        </td>

                        <td style={styles.td}>
                          <span
                            style={{
                              ...styles.statusBadge,
                              ...getStatusStyle(status),
                            }}
                          >
                            <span>
                              {getStatusIcon(status)}
                            </span>

                            {status}
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
    position: 'sticky',
    top: 0,
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

  sidebarMenu: {
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
    cursor: 'default',
    textAlign: 'left',
    marginBottom: '6px',
  },

  sidebarFooter: {
    borderTop: '1px solid #273449',
    paddingTop: '20px',
  },

  helpBox: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    color: '#cbd5e1',
  },

  helpIcon: {
    width: '34px',
    height: '34px',
    borderRadius: '10px',
    background: '#1e293b',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
  },

  main: {
    flex: 1,
    minWidth: 0,
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

  backButton: {
    height: '43px',
    padding: '0 17px',
    borderRadius: '10px',
    border: '1px solid #e2e8f0',
    background: '#ffffff',
    color: '#475569',
    fontSize: '12px',
    fontWeight: '650',
    cursor: 'pointer',
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '16px',
    marginBottom: '22px',
  },

  summaryCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '15px',
    padding: '19px',
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
  },

  summaryIcon: {
    width: '43px',
    height: '43px',
    borderRadius: '11px',
    background: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '19px',
  },

  summaryLabel: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.8px',
  },

  summaryNumber: {
    margin: '4px 0 0',
    fontSize: '22px',
    fontWeight: '800',
  },

  tableCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    overflow: 'hidden',
  },

  tableHeader: {
    padding: '23px 25px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  tableTitle: {
    margin: 0,
    fontSize: '18px',
    fontWeight: '800',
  },

  tableSubtitle: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: '11px',
  },

  requestCount: {
    background: '#f1f5f9',
    color: '#64748b',
    borderRadius: '20px',
    padding: '7px 11px',
    fontSize: '10px',
    fontWeight: '700',
  },

  tableWrapper: {
    width: '100%',
    overflowX: 'auto',
  },

  table: {
    width: '100%',
    borderCollapse: 'collapse',
    minWidth: '760px',
  },

  th: {
    textAlign: 'left',
    padding: '14px 20px',
    background: '#f8fafc',
    color: '#94a3b8',
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.8px',
    borderBottom: '1px solid #e2e8f0',
  },

  td: {
    padding: '17px 20px',
    borderBottom: '1px solid #f1f5f9',
    fontSize: '12px',
    color: '#475569',
    verticalAlign: 'middle',
  },

  leaveType: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },

  leaveIcon: {
    width: '37px',
    height: '37px',
    borderRadius: '10px',
    background: '#eef2ff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '16px',
  },

  dateText: {
    color: '#334155',
    fontSize: '12px',
  },

  reason: {
    display: 'block',
    maxWidth: '190px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },

  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '5px',
    padding: '7px 10px',
    borderRadius: '20px',
    fontSize: '9px',
    fontWeight: '800',
    letterSpacing: '0.3px',
  },

  loadingBox: {
    minHeight: '250px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: '#64748b',
    fontSize: '13px',
  },

  loadingIcon: {
    fontSize: '30px',
    marginBottom: '10px',
  },

  emptyState: {
    minHeight: '300px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '30px',
  },

  emptyIcon: {
    width: '65px',
    height: '65px',
    borderRadius: '18px',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '28px',
    marginBottom: '15px',
  },

  emptyStateH3: {
    margin: 0,
  },

  emptyButton: {
    marginTop: '15px',
    border: 'none',
    borderRadius: '10px',
    padding: '11px 18px',
    background: '#4f46e5',
    color: '#ffffff',
    fontSize: '12px',
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

export default MyLeaves;