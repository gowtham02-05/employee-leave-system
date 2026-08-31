import { useEffect, useState } from 'react';

function AdminDashboard({ user, onLogout }) {
  const [leaves, setLeaves] = useState([]);
  const [message, setMessage] = useState('Loading leave requests...');
  const [processingId, setProcessingId] = useState(null);

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

  useEffect(() => {
    fetchLeaves();
  }, []);

  const updateLeave = async (id, action) => {
    try {
      setProcessingId(id);
      setMessage('');

      const token = localStorage.getItem('access_token');

      const response = await fetch(
        `http://localhost:3000/leaves/${id}/${action}`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message || `Failed to ${action} leave`);
        setProcessingId(null);
        return;
      }

      setMessage(
        `Leave ${action === 'approve' ? 'approved' : 'rejected'} successfully.`,
      );

      await fetchLeaves();
      setProcessingId(null);
    } catch (error) {
      console.error(error);
      setMessage('Cannot connect to backend');
      setProcessingId(null);
    }
  };

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

  const pendingCount = leaves.filter(
    (leave) =>
      (leave.status || 'PENDING').toUpperCase() === 'PENDING',
  ).length;

  const approvedCount = leaves.filter(
    (leave) =>
      (leave.status || '').toUpperCase() === 'APPROVED',
  ).length;

  const rejectedCount = leaves.filter(
    (leave) =>
      (leave.status || '').toUpperCase() === 'REJECTED',
  ).length;

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

        <div style={styles.menu}>
          <p style={styles.menuTitle}>HR MANAGEMENT</p>

          <button style={styles.activeMenu}>
            <span>▣</span>
            Dashboard
          </button>

          <button
            style={styles.menuButton}
            onClick={fetchLeaves}
          >
            <span>↻</span>
            Refresh Requests
          </button>
        </div>

        <div style={styles.adminProfile}>
          <div style={styles.avatar}>
            {(user?.name || 'A').charAt(0).toUpperCase()}
          </div>

          <div style={styles.profileInfo}>
            <strong>{user?.name || 'Admin'}</strong>
            <small>{user?.role || 'HR'}</small>
          </div>
        </div>

        <button
          onClick={onLogout}
          style={styles.logoutButton}
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      {/* Main */}
      <main style={styles.main}>
        {/* Header */}
        <header style={styles.header}>
          <div>
            <p style={styles.breadcrumb}>
              HR Management / Dashboard
            </p>

            <h1 style={styles.title}>
              HR Dashboard
            </h1>

            <p style={styles.subtitle}>
              Review and manage employee leave requests.
            </p>
          </div>

          <div style={styles.headerUser}>
            <div style={styles.headerAvatar}>
              {(user?.name || 'A').charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user?.name || 'Admin'}</strong>
              <small>HR / Administrator</small>
            </div>
          </div>
        </header>

        {/* Summary Cards */}
        <section style={styles.summaryGrid}>
          <div style={styles.summaryCard}>
            <div style={styles.summaryIcon}>📋</div>

            <div>
              <p style={styles.summaryLabel}>TOTAL REQUESTS</p>

              <h2 style={styles.summaryNumber}>
                {leaves.length}
              </h2>

              <span style={styles.summaryText}>
                All leave requests
              </span>
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
                {pendingCount}
              </h2>

              <span style={styles.summaryText}>
                Awaiting review
              </span>
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
                {approvedCount}
              </h2>

              <span style={styles.summaryText}>
                Approved requests
              </span>
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
                {rejectedCount}
              </h2>

              <span style={styles.summaryText}>
                Rejected requests
              </span>
            </div>
          </div>
        </section>

        {/* Message */}
        {message && (
          <div
            style={
              message.includes('successfully')
                ? styles.successMessage
                : styles.infoMessage
            }
          >
            <span>
              {message.includes('successfully') ? '✓' : '●'}
            </span>

            {message}
          </div>
        )}

        {/* Requests Card */}
        <section style={styles.requestsCard}>
          <div style={styles.cardHeader}>
            <div>
              <h2 style={styles.cardTitle}>
                Leave Requests
              </h2>

              <p style={styles.cardSubtitle}>
                Review employee applications and take action.
              </p>
            </div>

            <div style={styles.requestBadge}>
              {leaves.length} Request
              {leaves.length !== 1 ? 's' : ''}
            </div>
          </div>

          {!message && leaves.length === 0 && (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>📭</div>

              <h3>No Leave Requests</h3>

              <p>
                There are currently no employee leave requests.
              </p>
            </div>
          )}

          {leaves.length > 0 && (
            <div style={styles.requestsList}>
              {leaves.map((leave) => {
                const status =
                  (leave.status || 'PENDING').toUpperCase();

                const isPending = status === 'PENDING';
                const isProcessing = processingId === leave._id;

                return (
                  <div
                    key={leave._id}
                    style={styles.requestItem}
                  >
                    {/* Employee */}
                    <div style={styles.employeeSection}>
                      <div style={styles.employeeAvatar}>
                        {String(leave.employeeId)
                          .slice(-2)
                          .toUpperCase()}
                      </div>

                      <div>
                        <span style={styles.employeeLabel}>
                          EMPLOYEE ID
                        </span>

                        <strong style={styles.employeeId}>
                          {leave.employeeId}
                        </strong>
                      </div>
                    </div>

                    {/* Leave Details */}
                    <div style={styles.leaveDetails}>
                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          LEAVE TYPE
                        </span>

                        <strong>
                          {leave.leaveType}
                        </strong>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          DURATION
                        </span>

                        <strong>
                          {formatDate(leave.startDate)}
                          {' → '}
                          {formatDate(leave.endDate)}
                        </strong>
                      </div>

                      <div style={styles.detailItem}>
                        <span style={styles.detailLabel}>
                          REASON
                        </span>

                        <strong style={styles.reasonText}>
                          {leave.reason || 'No reason provided'}
                        </strong>
                      </div>
                    </div>

                    {/* Status + Actions */}
                    <div style={styles.actionSection}>
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

                      {isPending && (
                        <div style={styles.actionButtons}>
                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              updateLeave(
                                leave._id,
                                'approve',
                              )
                            }
                            style={{
                              ...styles.approveButton,
                              opacity: isProcessing ? 0.6 : 1,
                            }}
                          >
                            ✓ Approve
                          </button>

                          <button
                            disabled={isProcessing}
                            onClick={() =>
                              updateLeave(
                                leave._id,
                                'reject',
                              )
                            }
                            style={{
                              ...styles.rejectButton,
                              opacity: isProcessing ? 0.6 : 1,
                            }}
                          >
                            ✕ Reject
                          </button>
                        </div>
                      )}

                      {!isPending && (
                        <span style={styles.completedText}>
                          Request processed
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
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
    cursor: 'default',
    textAlign: 'left',
    marginBottom: '6px',
  },

  adminProfile: {
    borderTop: '1px solid #273449',
    paddingTop: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '12px',
  },

  avatar: {
    width: '37px',
    height: '37px',
    borderRadius: '50%',
    background: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '13px',
    fontWeight: '800',
  },

  profileInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '3px',
  },

  profileInfoSmall: {
    color: '#94a3b8',
  },

  logoutButton: {
    width: '100%',
    height: '42px',
    borderRadius: '9px',
    border: '1px solid #374151',
    background: 'transparent',
    color: '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    fontSize: '12px',
    fontWeight: '650',
    cursor: 'pointer',
  },

  main: {
    flex: 1,
    minWidth: 0,
    padding: '38px 45px',
    boxSizing: 'border-box',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
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

  headerUser: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '8px 13px',
  },

  headerAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    background: '#eef2ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: '800',
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
    margin: '4px 0 1px',
    fontSize: '22px',
    fontWeight: '800',
  },

  summaryText: {
    color: '#94a3b8',
    fontSize: '9px',
  },

  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '12px 15px',
    marginBottom: '18px',
    borderRadius: '10px',
    background: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    fontSize: '12px',
    fontWeight: '650',
  },

  infoMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '9px',
    padding: '12px 15px',
    marginBottom: '18px',
    borderRadius: '10px',
    background: '#f8fafc',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    fontSize: '12px',
    fontWeight: '600',
  },

  requestsCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '18px',
    overflow: 'hidden',
  },

  cardHeader: {
    padding: '23px 25px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
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

  requestBadge: {
    background: '#f1f5f9',
    color: '#64748b',
    borderRadius: '20px',
    padding: '7px 11px',
    fontSize: '10px',
    fontWeight: '700',
  },

  requestsList: {
    width: '100%',
  },

  requestItem: {
    display: 'grid',
    gridTemplateColumns: '175px minmax(0, 1fr) 210px',
    gap: '20px',
    alignItems: 'center',
    padding: '21px 25px',
    borderBottom: '1px solid #f1f5f9',
  },

  employeeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
  },

  employeeAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '11px',
    background: '#eef2ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
  },

  employeeLabel: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '8px',
    fontWeight: '800',
    letterSpacing: '0.7px',
    marginBottom: '4px',
  },

  employeeId: {
    fontSize: '12px',
    color: '#334155',
  },

  leaveDetails: {
    display: 'grid',
    gridTemplateColumns: '0.8fr 1.4fr 1.2fr',
    gap: '20px',
  },

  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: 0,
  },

  detailLabel: {
    color: '#94a3b8',
    fontSize: '8px',
    fontWeight: '800',
    letterSpacing: '0.7px',
  },

  detailItemStrong: {
    color: '#334155',
  },

  reasonText: {
    color: '#64748b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '180px',
  },

  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '10px',
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

  actionButtons: {
    display: 'flex',
    gap: '7px',
  },

  approveButton: {
    height: '34px',
    padding: '0 11px',
    border: 'none',
    borderRadius: '8px',
    background: '#16a34a',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  rejectButton: {
    height: '34px',
    padding: '0 11px',
    border: 'none',
    borderRadius: '8px',
    background: '#dc2626',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  completedText: {
    color: '#94a3b8',
    fontSize: '9px',
  },

  emptyState: {
    minHeight: '280px',
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

  footer: {
    textAlign: 'center',
    marginTop: '25px',
    color: '#94a3b8',
    fontSize: '10px',
  },
};

export default AdminDashboard;