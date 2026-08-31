function EmployeeDashboard({ user, onApplyLeave, onMyLeaves, onLogout }) {
  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#f4f7fb',
        padding: '40px 20px',
        boxSizing: 'border-box',
        fontFamily: 'Arial, sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#ffffff',
            padding: '25px 30px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            marginBottom: '25px',
          }}
        >
          <h1
            style={{
              margin: '0 0 8px',
              fontSize: '28px',
              color: '#1f2937',
            }}
          >
            Employee Leave Management System
          </h1>

          <p
            style={{
              margin: 0,
              color: '#6b7280',
            }}
          >
            Employee Dashboard
          </p>
        </div>

        {/* User Information */}
        <div
          style={{
            background: '#ffffff',
            padding: '25px 30px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
            marginBottom: '25px',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              color: '#111827',
            }}
          >
            Welcome, {user?.name || 'Employee'} 👋
          </h2>

          <div
            style={{
              display: 'grid',
              gap: '12px',
              color: '#374151',
            }}
          >
            <p style={{ margin: 0 }}>
              <strong>Email:</strong> {user?.email || '-'}
            </p>

            <p style={{ margin: 0 }}>
              <strong>Role:</strong> {user?.role || 'EMPLOYEE'}
            </p>
          </div>
        </div>

        {/* Leave Management */}
        <div
          style={{
            background: '#ffffff',
            padding: '30px',
            borderRadius: '16px',
            boxShadow: '0 4px 15px rgba(0,0,0,0.08)',
          }}
        >
          <h2
            style={{
              marginTop: 0,
              marginBottom: '20px',
              color: '#111827',
            }}
          >
            Leave Management
          </h2>

          <div
            style={{
              display: 'flex',
              gap: '15px',
              flexWrap: 'wrap',
            }}
          >
            <button
              onClick={onApplyLeave}
              style={{
                padding: '13px 22px',
                border: 'none',
                borderRadius: '10px',
                background: '#2563eb',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Apply Leave
            </button>

            <button
              onClick={onMyLeaves}
              style={{
                padding: '13px 22px',
                border: 'none',
                borderRadius: '10px',
                background: '#16a34a',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              My Leave Requests
            </button>

            <button
              onClick={onLogout}
              style={{
                padding: '13px 22px',
                border: 'none',
                borderRadius: '10px',
                background: '#dc2626',
                color: '#ffffff',
                fontSize: '15px',
                fontWeight: '600',
                cursor: 'pointer',
              }}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmployeeDashboard;
