import { useEffect, useState } from 'react';

function AdminDashboard({
  user,
  onLogout,
  onApplyLeave,
  onEmployees,
  onDepartments,
}) {
  const [leaves, setLeaves] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [message, setMessage] = useState('Loading dashboard...');
  const [processingId, setProcessingId] = useState(null);
  const [loading, setLoading] = useState(true);

  // ==============================
  // FETCH LEAVE REQUESTS
  // ==============================
  const fetchLeaves = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
        setMessage('Session expired. Please login again.');
        return;
      }

      const response = await fetch(
        'http://localhost:3000/leaves',
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
          data.message || 'Failed to load leave requests',
        );
        return;
      }

      setLeaves(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Leave fetch error:', error);
      setMessage('Cannot connect to backend');
    }
  };

  // ==============================
  // FETCH EMPLOYEES
  // ==============================
  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem('access_token');

      if (!token) {
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

      if (!response.ok) {
        console.log('Employee API failed');
        setEmployees([]);
        return;
      }

      const data = await response.json();

      const employeeList = Array.isArray(data)
        ? data.filter(
            (employee) =>
              String(employee.role || '').toUpperCase() ===
              'EMPLOYEE',
          )
        : [];

      setEmployees(employeeList);
    } catch (error) {
      console.error('Employee fetch error:', error);
      setEmployees([]);
    }
  };

  // ==============================
  // LOAD DASHBOARD
  // ==============================
  const fetchDashboard = async () => {
    try {
      setLoading(true);
      setMessage('Loading dashboard...');

      await Promise.all([
        fetchLeaves(),
        fetchEmployees(),
      ]);

      setMessage('');
    } catch (error) {
      console.error(error);
      setMessage('Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboard();
  }, []);

  // ==============================
  // APPROVE / REJECT
  // ==============================
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
        setMessage(
          data.message ||
            `Failed to ${action} leave`,
        );

        setProcessingId(null);
        return;
      }

      setMessage(
        `Leave ${
          action === 'approve'
            ? 'approved'
            : 'rejected'
        } successfully.`,
      );

      await fetchLeaves();

      setProcessingId(null);
    } catch (error) {
      console.error(error);

      setMessage('Cannot connect to backend');
      setProcessingId(null);
    }
  };

  // ==============================
  // NORMALIZE STATUS
  // ==============================
  const getStatus = (leave) => {
    return String(
      leave?.status || 'PENDING',
    ).toUpperCase();
  };

  // ==============================
  // STATUS COUNTS
  // ==============================
  const pendingCount = leaves.filter(
    (leave) =>
      getStatus(leave) === 'PENDING',
  ).length;

  const approvedCount = leaves.filter(
    (leave) =>
      getStatus(leave) === 'APPROVED',
  ).length;

  const rejectedCount = leaves.filter(
    (leave) =>
      getStatus(leave) === 'REJECTED',
  ).length;

  // ==============================
  // EMPLOYEE ID
  // ==============================
  const getEmployeeId = (employeeId) => {
    if (!employeeId) {
      return '-';
    }

    if (typeof employeeId === 'object') {
      return (
        employeeId.employeeId ||
        employeeId._id ||
        employeeId.id ||
        employeeId.email ||
        '-'
      );
    }

    return String(employeeId);
  };

  // ==============================
  // TOTAL EMPLOYEES
  // ==============================
  const totalEmployees =
    employees.length > 0
      ? employees.length
      : [
          ...new Set(
            leaves
              .map((leave) =>
                getEmployeeId(
                  leave.employeeId,
                ),
              )
              .filter(
                (id) => id !== '-',
              ),
          ),
        ].length;

  // ==============================
  // DATE HELPERS
  // ==============================
  const getDateOnly = (date) => {
    if (!date) {
      return null;
    }

    const parsed = new Date(date);

    if (Number.isNaN(parsed.getTime())) {
      return null;
    }

    return new Date(
      parsed.getFullYear(),
      parsed.getMonth(),
      parsed.getDate(),
    );
  };

  const getTodayDate = () => {
    const today = new Date();

    return new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );
  };

  // ==============================
  // EMPLOYEES CURRENTLY ON LEAVE
  // ==============================
  const isEmployeeOnLeave = (leave) => {
    if (getStatus(leave) !== 'APPROVED') {
      return false;
    }

    if (
      !leave.startDate ||
      !leave.endDate
    ) {
      return false;
    }

    const today = getTodayDate();

    const start = getDateOnly(
      leave.startDate,
    );

    const end = getDateOnly(
      leave.endDate,
    );

    if (!start || !end) {
      return false;
    }

    return (
      today >= start &&
      today <= end
    );
  };

  const employeesOnLeaveIds = new Set(
    leaves
      .filter(isEmployeeOnLeave)
      .map((leave) =>
        getEmployeeId(
          leave.employeeId,
        ),
      )
      .filter(
        (id) => id !== '-',
      ),
  );

  const employeesOnLeave =
    employeesOnLeaveIds.size;

  // ==============================
  // EMPLOYEE NAME
  // ==============================
  const getEmployeeName = (employeeId) => {
    if (!employeeId) {
      return 'Employee';
    }

    if (typeof employeeId === 'object') {
      return (
        employeeId.name ||
        employeeId.fullName ||
        employeeId.email ||
        'Employee'
      );
    }

    const employee = employees.find(
      (item) =>
        String(item._id) ===
          String(employeeId) ||
        String(item.id) ===
          String(employeeId),
    );

    return (
      employee?.name ||
      employee?.fullName ||
      employee?.email ||
      'Employee'
    );
  };

  // ==============================
  // FORMAT DATE
  // ==============================
  const formatDate = (date) => {
    if (!date) {
      return '-';
    }

    const parsedDate = new Date(date);

    if (
      Number.isNaN(
        parsedDate.getTime(),
      )
    ) {
      return '-';
    }

    return parsedDate.toLocaleDateString(
      'en-IN',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      },
    );
  };

  // ==============================
  // FORMAT LEAVE TYPE
  // ==============================
  const formatLeaveType = (type) => {
    if (!type) {
      return '-';
    }

    return String(type)
      .toLowerCase()
      .replace(
        /\b\w/g,
        (letter) =>
          letter.toUpperCase(),
      );
  };

  // ==============================
  // STATUS STYLE
  // ==============================
  const getStatusStyle = (status) => {
    const normalizedStatus =
      String(
        status || 'PENDING',
      ).toUpperCase();

    if (
      normalizedStatus ===
      'APPROVED'
    ) {
      return {
        background: '#dcfce7',
        color: '#15803d',
      };
    }

    if (
      normalizedStatus ===
      'REJECTED'
    ) {
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
    const normalizedStatus =
      String(
        status || 'PENDING',
      ).toUpperCase();

    if (
      normalizedStatus ===
      'APPROVED'
    ) {
      return '✓';
    }

    if (
      normalizedStatus ===
      'REJECTED'
    ) {
      return '✕';
    }

    return '◷';
  };

  // ==============================
  // RENDER
  // ==============================
  return (
    <div style={styles.page}>

      {/* RESPONSIVE CSS */}
      <style>
        {`
          * {
            box-sizing: border-box;
          }

          .dashboard-request-item {
            display: grid;
            grid-template-columns: 180px minmax(0, 1fr) 195px;
            gap: 18px;
            align-items: center;
            width: 100%;
          }

          .dashboard-employee-section {
            min-width: 0;
          }

          .dashboard-leave-details {
            min-width: 0;
          }

          .dashboard-action-section {
            min-width: 0;
          }

          .dashboard-reason {
            min-width: 0;
          }

          @media (max-width: 1050px) {
            .dashboard-request-item {
              grid-template-columns: 160px minmax(0, 1fr);
              gap: 15px;
            }

            .dashboard-action-section {
              grid-column: 1 / -1;
              flex-direction: row !important;
              align-items: center !important;
              justify-content: space-between !important;
              width: 100%;
            }

            .dashboard-leave-details {
              grid-template-columns: repeat(3, minmax(0, 1fr)) !important;
              gap: 12px !important;
            }

            .dashboard-content {
              padding-left: 25px !important;
              padding-right: 25px !important;
            }
          }

          @media (max-width: 800px) {
            .dashboard-summary-grid {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
            }

            .dashboard-request-item {
              grid-template-columns: 1fr !important;
              gap: 14px !important;
            }

            .dashboard-employee-section {
              width: 100%;
              max-width: none !important;
            }

            .dashboard-leave-details {
              grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
              width: 100%;
            }

            .dashboard-action-section {
              grid-column: auto;
              width: 100%;
            }

            .dashboard-card-header {
              flex-wrap: wrap !important;
            }

            .dashboard-today-header {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .dashboard-today-stats {
              width: 100%;
              justify-content: space-between;
              flex-wrap: wrap;
              gap: 15px !important;
            }
          }

          @media (max-width: 600px) {
            .dashboard-content {
              padding: 20px 15px 25px !important;
            }

            .dashboard-summary-grid {
              grid-template-columns: 1fr !important;
            }

            .dashboard-leave-details {
              grid-template-columns: 1fr !important;
            }

            .dashboard-action-section {
              flex-direction: column !important;
              align-items: flex-start !important;
            }

            .dashboard-action-buttons {
              width: 100%;
              flex-wrap: wrap;
            }

            .dashboard-header {
              margin-bottom: 18px !important;
            }

            .dashboard-title {
              font-size: 24px !important;
            }

            .dashboard-card-header {
              padding: 17px !important;
            }

            .dashboard-request-item {
              padding: 17px !important;
            }

            .dashboard-main {
              margin-left: 0 !important;
            }

            .dashboard-sidebar {
              display: none !important;
            }
          }

          @media (max-width: 420px) {
            .dashboard-content {
              padding: 15px 10px 20px !important;
            }

            .dashboard-request-item {
              padding: 14px !important;
            }

            .dashboard-action-buttons button {
              flex: 1;
              min-width: 100px;
            }

            .dashboard-today-stats {
              display: grid !important;
              grid-template-columns: repeat(2, 1fr);
              width: 100%;
            }
          }
        `}
      </style>

      {/* SIDEBAR */}
      <aside
        className="dashboard-sidebar"
        style={styles.sidebar}
      >

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

        <div style={styles.menu}>

          <p style={styles.menuTitle}>
            HR MANAGEMENT
          </p>

          <button
            type="button"
            style={styles.activeMenu}
          >
            <span>▣</span>
            Dashboard
          </button>

          <button
            type="button"
            style={styles.menuButton}
            onClick={onEmployees}
          >
            <span>👥</span>
            Employees
          </button>

          <button
            type="button"
            style={styles.menuButton}
            onClick={onDepartments}
          >
            <span>▦</span>
            Departments
          </button>

          <button
            type="button"
            style={styles.menuButton}
            onClick={onApplyLeave}
          >
            <span>＋</span>
            Apply Leave
          </button>

          <button
            type="button"
            style={styles.menuButton}
            onClick={fetchDashboard}
          >
            <span>↻</span>
            Refresh
          </button>

        </div>

        <div style={styles.adminProfile}>

          <div style={styles.avatar}>
            {(user?.name || 'H')
              .charAt(0)
              .toUpperCase()}
          </div>

          <div style={styles.profileInfo}>

            <strong>
              {user?.name || 'HR'}
            </strong>

            <small>
              {user?.role || 'HR'}
            </small>

          </div>

        </div>

        <button
          type="button"
          onClick={onLogout}
          style={styles.logoutButton}
        >
          <span>↪</span>
          Logout
        </button>

      </aside>

      {/* MAIN CONTENT */}
      <main
        className="dashboard-main"
        style={styles.main}
      >

        <div
          className="dashboard-content"
          style={styles.content}
        >

          {/* HEADER */}
          <header
            className="dashboard-header"
            style={styles.header}
          >

            <div>

              <p style={styles.breadcrumb}>
                HR Management / Dashboard
              </p>

              <h1
                className="dashboard-title"
                style={styles.title}
              >
                Dashboard
              </h1>

              <p style={styles.subtitle}>
                Overview of employees and leave requests.
              </p>

            </div>

          </header>

          {/* SUMMARY CARDS */}
          <section
            className="dashboard-summary-grid"
            style={styles.summaryGrid}
          >

            <div style={styles.summaryCard}>

              <div
                style={{
                  ...styles.summaryIcon,
                  background: '#eef2ff',
                }}
              >
                👥
              </div>

              <div>

                <p style={styles.summaryLabel}>
                  TOTAL EMPLOYEES
                </p>

                <h2 style={styles.summaryNumber}>
                  {loading ? '—' : totalEmployees}
                </h2>

                <span style={styles.summaryText}>
                  Active employees
                </span>

              </div>

            </div>

            <div style={styles.summaryCard}>

              <div
                style={{
                  ...styles.summaryIcon,
                  background: '#e0f2fe',
                }}
              >
                📋
              </div>

              <div>

                <p style={styles.summaryLabel}>
                  TOTAL LEAVE REQUESTS
                </p>

                <h2 style={styles.summaryNumber}>
                  {loading ? '—' : leaves.length}
                </h2>

                <span style={styles.summaryText}>
                  All requests
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

                <p style={styles.summaryLabel}>
                  PENDING
                </p>

                <h2 style={styles.summaryNumber}>
                  {loading ? '—' : pendingCount}
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

                <p style={styles.summaryLabel}>
                  APPROVED
                </p>

                <h2 style={styles.summaryNumber}>
                  {loading ? '—' : approvedCount}
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

                <p style={styles.summaryLabel}>
                  REJECTED
                </p>

                <h2 style={styles.summaryNumber}>
                  {loading ? '—' : rejectedCount}
                </h2>

                <span style={styles.summaryText}>
                  Rejected requests
                </span>

              </div>

            </div>

            <div style={styles.summaryCard}>

              <div
                style={{
                  ...styles.summaryIcon,
                  background: '#f3e8ff',
                }}
              >
                🏖
              </div>

              <div>

                <p style={styles.summaryLabel}>
                  EMPLOYEES ON LEAVE
                </p>

                <h2 style={styles.summaryNumber}>
                  {loading ? '—' : employeesOnLeave}
                </h2>

                <span style={styles.summaryText}>
                  Currently on leave
                </span>

              </div>

            </div>

          </section>

          {/* MESSAGE */}
          {message && (
            <div
              style={
                message.includes(
                  'successfully',
                )
                  ? styles.successMessage
                  : styles.infoMessage
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

          {/* LEAVE REQUESTS */}
          <section style={styles.requestsCard}>

            <div
              className="dashboard-card-header"
              style={styles.cardHeader}
            >

              <div>

                <h2 style={styles.cardTitle}>
                  Leave Requests
                </h2>

                <p style={styles.cardSubtitle}>
                  Review and manage employee leave applications.
                </p>

              </div>

              <div style={styles.requestBadge}>
                {leaves.length} Request
                {leaves.length !== 1
                  ? 's'
                  : ''}
              </div>

            </div>

            {/* EMPTY */}
            {!loading &&
              leaves.length === 0 && (
                <div style={styles.emptyState}>

                  <div style={styles.emptyIcon}>
                    📭
                  </div>

                  <h3 style={styles.emptyTitle}>
                    No Leave Requests
                  </h3>

                  <p style={styles.emptyText}>
                    There are currently no employee leave requests.
                  </p>

                  <button
                    type="button"
                    style={styles.emptyApplyButton}
                    onClick={onApplyLeave}
                  >
                    + Apply Leave
                  </button>

                </div>
              )}

            {/* REQUEST LIST */}
            {leaves.length > 0 && (
              <div style={styles.requestsList}>

                {leaves.map((leave) => {

                  const status =
                    getStatus(leave);

                  const isPending =
                    status === 'PENDING';

                  const isProcessing =
                    processingId ===
                    leave._id;

                  const employeeId =
                    getEmployeeId(
                      leave.employeeId,
                    );

                  const employeeName =
                    getEmployeeName(
                      leave.employeeId,
                    );

                  return (
                    <div
                      key={leave._id}
                      className="dashboard-request-item"
                      style={styles.requestItem}
                    >

                      {/* EMPLOYEE */}
                      <div
                        className="dashboard-employee-section"
                        style={styles.employeeSection}
                      >

                        <div style={styles.employeeAvatar}>
                          {employeeName
                            .charAt(0)
                            .toUpperCase()}
                        </div>

                        <div style={{ minWidth: 0 }}>

                          <span style={styles.employeeLabel}>
                            EMPLOYEE
                          </span>

                          <strong style={styles.employeeId}>
                            {employeeName}
                          </strong>

                          <span style={styles.employeeSmall}>
                            {employeeId}
                          </span>

                        </div>

                      </div>

                      {/* LEAVE DETAILS */}
                      <div
                        className="dashboard-leave-details"
                        style={styles.leaveDetails}
                      >

                        <div style={styles.detailItem}>

                          <span style={styles.detailLabel}>
                            LEAVE TYPE
                          </span>

                          <strong>
                            {formatLeaveType(
                              leave.leaveType ||
                                leave.type,
                            )}
                          </strong>

                        </div>

                        <div style={styles.detailItem}>

                          <span style={styles.detailLabel}>
                            DURATION
                          </span>

                          <strong>
                            {formatDate(
                              leave.startDate,
                            )}
                            {' → '}
                            {formatDate(
                              leave.endDate,
                            )}
                          </strong>

                        </div>

                        <div
                          className="dashboard-reason"
                          style={styles.detailItem}
                        >

                          <span style={styles.detailLabel}>
                            REASON
                          </span>

                          <strong style={styles.reasonText}>
                            {leave.reason ||
                              'No reason provided'}
                          </strong>

                        </div>

                      </div>

                      {/* STATUS + ACTIONS */}
                      <div
                        className="dashboard-action-section"
                        style={styles.actionSection}
                      >

                        <span
                          style={{
                            ...styles.statusBadge,
                            ...getStatusStyle(
                              status,
                            ),
                          }}
                        >
                          {getStatusIcon(status)}
                          {' '}
                          {status}
                        </span>

                        {isPending && (
                          <div
                            className="dashboard-action-buttons"
                            style={styles.actionButtons}
                          >

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                updateLeave(
                                  leave._id,
                                  'approve',
                                )
                              }
                              style={{
                                ...styles.approveButton,
                                opacity:
                                  isProcessing
                                    ? 0.6
                                    : 1,
                              }}
                            >
                              ✓ Approve
                            </button>

                            <button
                              type="button"
                              disabled={isProcessing}
                              onClick={() =>
                                updateLeave(
                                  leave._id,
                                  'reject',
                                )
                              }
                              style={{
                                ...styles.rejectButton,
                                opacity:
                                  isProcessing
                                    ? 0.6
                                    : 1,
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

        </div>

      </main>

    </div>
  );
}

// ======================================================
// STYLES
// ======================================================

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
    textAlign: 'left',
    marginBottom: '5px',
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
    maxWidth: '1250px',
    margin: '0 auto',
    padding: '35px 42px 30px',
    boxSizing: 'border-box',
    width: '100%',
  },

  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: '20px',
    marginBottom: '25px',
  },

  breadcrumb: {
    margin: '0 0 7px',
    fontSize: '10px',
    color: '#94a3b8',
    fontWeight: '600',
  },

  title: {
    margin: 0,
    fontSize: '29px',
    fontWeight: '800',
    letterSpacing: '-0.6px',
  },

  subtitle: {
    margin: '6px 0 0',
    color: '#64748b',
    fontSize: '13px',
  },

  summaryGrid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(3, minmax(0, 1fr))',
    gap: '14px',
    marginBottom: '20px',
  },

  summaryCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '14px',
    padding: '18px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    minWidth: 0,
  },

  summaryIcon: {
    width: '43px',
    height: '43px',
    borderRadius: '11px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    flexShrink: 0,
  },

  summaryLabel: {
    margin: 0,
    color: '#94a3b8',
    fontSize: '8px',
    fontWeight: '800',
    letterSpacing: '0.7px',
  },

  summaryNumber: {
    margin: '4px 0 1px',
    fontSize: '23px',
    fontWeight: '800',
  },

  summaryText: {
    color: '#94a3b8',
    fontSize: '9px',
  },

  successMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11px 14px',
    marginBottom: '16px',
    borderRadius: '9px',
    background: '#f0fdf4',
    color: '#15803d',
    border: '1px solid #bbf7d0',
    fontSize: '11px',
    fontWeight: '650',
  },

  infoMessage: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    padding: '11px 14px',
    marginBottom: '16px',
    borderRadius: '9px',
    background: '#f8fafc',
    color: '#64748b',
    border: '1px solid #e2e8f0',
    fontSize: '11px',
    fontWeight: '600',
  },

  requestsCard: {
    background: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '16px',
    overflow: 'hidden',
    marginBottom: '18px',
    width: '100%',
  },

  cardHeader: {
    padding: '21px 23px',
    borderBottom: '1px solid #e2e8f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '15px',
  },

  cardTitle: {
    margin: 0,
    fontSize: '17px',
    fontWeight: '800',
  },

  cardSubtitle: {
    margin: '5px 0 0',
    color: '#64748b',
    fontSize: '10px',
  },

  requestBadge: {
    background: '#f1f5f9',
    color: '#64748b',
    borderRadius: '20px',
    padding: '7px 10px',
    fontSize: '9px',
    fontWeight: '700',
    whiteSpace: 'nowrap',
  },

  requestsList: {
    width: '100%',
  },

  requestItem: {
    display: 'grid',
    gridTemplateColumns:
      '180px minmax(0, 1fr) 195px',
    gap: '18px',
    alignItems: 'center',
    padding: '19px 23px',
    borderBottom: '1px solid #f1f5f9',
    boxSizing: 'border-box',
    width: '100%',
  },

  employeeSection: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    minWidth: 0,
    maxWidth: '240px',
  },

  employeeAvatar: {
    width: '39px',
    height: '39px',
    borderRadius: '10px',
    background: '#eef2ff',
    color: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: '800',
    flexShrink: 0,
  },

  employeeLabel: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '7px',
    fontWeight: '800',
    letterSpacing: '0.7px',
    marginBottom: '3px',
  },

  employeeId: {
    display: 'block',
    fontSize: '11px',
    color: '#334155',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '125px',
  },

  employeeSmall: {
    display: 'block',
    color: '#94a3b8',
    fontSize: '8px',
    marginTop: '3px',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '125px',
  },

  leaveDetails: {
    display: 'grid',
    gridTemplateColumns:
      '0.8fr 1.4fr 1.2fr',
    gap: '18px',
    minWidth: 0,
  },

  detailItem: {
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
    minWidth: 0,
    fontSize: '11px',
    overflow: 'hidden',
  },

  detailLabel: {
    color: '#94a3b8',
    fontSize: '7px',
    fontWeight: '800',
    letterSpacing: '0.7px',
  },

  reasonText: {
    color: '#64748b',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxWidth: '100%',
  },

  actionSection: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: '9px',
    minWidth: 0,
  },

  statusBadge: {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '5px',
    padding: '6px 9px',
    borderRadius: '20px',
    fontSize: '8px',
    fontWeight: '800',
    letterSpacing: '0.3px',
    whiteSpace: 'nowrap',
  },

  actionButtons: {
    display: 'flex',
    gap: '6px',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
  },

  approveButton: {
    height: '32px',
    padding: '0 10px',
    border: 'none',
    borderRadius: '7px',
    background: '#16a34a',
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  rejectButton: {
    height: '32px',
    padding: '0 10px',
    border: 'none',
    borderRadius: '7px',
    background: '#dc2626',
    color: '#ffffff',
    fontSize: '9px',
    fontWeight: '700',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  completedText: {
    color: '#94a3b8',
    fontSize: '8px',
    whiteSpace: 'nowrap',
  },

  emptyState: {
    minHeight: '260px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    padding: '30px',
  },

  emptyIcon: {
    width: '60px',
    height: '60px',
    borderRadius: '17px',
    background: '#f1f5f9',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '25px',
    marginBottom: '14px',
  },

  emptyTitle: {
    margin: '0 0 6px',
    color: '#334155',
    fontSize: '16px',
  },

  emptyText: {
    margin: '0 0 18px',
    color: '#64748b',
    fontSize: '11px',
  },

  emptyApplyButton: {
    height: '38px',
    padding: '0 15px',
    border: 'none',
    borderRadius: '8px',
    background: '#4f46e5',
    color: '#ffffff',
    fontSize: '10px',
    fontWeight: '700',
    cursor: 'pointer',
  },

  footer: {
    textAlign: 'center',
    marginTop: '22px',
    paddingBottom: '18px',
    color: '#94a3b8',
    fontSize: '9px',
  },
};

export default AdminDashboard;