import React, { useEffect, useState } from 'react';

function CreateEmployeeAccount({ onEmployees, onLogout }) {
  const [departments, setDepartments] = useState([]);
  const [form, setForm] = useState({
    employeeId: '',
    name: '',
    email: '',
    phone: '',
    department: '',
    designation: '',
    doj: '',
    leaveBalance: 12,
    password: '',
  });

  const [loadingDepartments, setLoadingDepartments] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    document.title = 'LeaveFlow - Create Employee Account';

    const fetchDepartments = async () => {
      try {
        const token = localStorage.getItem('access_token');

        const response = await fetch(
          'http://localhost:3000/departments',
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error('Failed to load departments');
        }

        const data = await response.json();

        setDepartments(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err.message || 'Failed to load departments');
      } finally {
        setLoadingDepartments(false);
      }
    };

    fetchDepartments();
  }, []);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));

    setError('');
    setSuccess('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!form.employeeId.trim()) {
      setError('Employee ID is required.');
      return;
    }

    if (!form.name.trim()) {
      setError('Employee name is required.');
      return;
    }

    if (!form.email.trim()) {
      setError('Email is required.');
      return;
    }

    if (!form.password) {
      setError('Password is required.');
      return;
    }

    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    if (!form.department) {
      setError('Please select a department.');
      return;
    }

    try {
      setSubmitting(true);

      const token = localStorage.getItem('access_token');

      const response = await fetch(
        'http://localhost:3000/users/register',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            employeeId: form.employeeId.trim(),
            name: form.name.trim(),
            email: form.email.trim(),
            password: form.password,
            role: 'EMPLOYEE',
            phone: form.phone.trim(),
            department: form.department,
            designation: form.designation.trim(),
            doj: form.doj,
            leaveBalance: Number(form.leaveBalance) || 0,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.message ||
            data?.error ||
            'Failed to create employee account.'
        );
      }

      setSuccess('Employee account created successfully.');

      setForm({
        employeeId: '',
        name: '',
        email: '',
        phone: '',
        department: '',
        designation: '',
        doj: '',
        leaveBalance: 12,
        password: '',
      });
    } catch (err) {
      setError(
        err.message || 'Failed to create employee account.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={styles.page}>
      <aside style={styles.sidebar}>
        <div style={styles.logoArea}>
          <div style={styles.logoMark}>L</div>

          <div>
            <div style={styles.logoText}>LeaveFlow</div>
            <div style={styles.logoSubtext}>
              HR Management
            </div>
          </div>
        </div>

        <div style={styles.menu}>
          <button
            type="button"
            onClick={onEmployees}
            style={styles.menuButton}
          >
            <span>◀</span>
            Employees
          </button>
        </div>

        <div style={styles.sidebarBottom}>
          <div style={styles.userCard}>
            <div style={styles.avatar}>HR</div>

            <div style={{ minWidth: 0 }}>
              <div style={styles.userName}>HR</div>

              <div style={styles.userRole}>
                Human Resources
              </div>
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
        </div>
      </aside>

      <main style={styles.main}>
        <div style={styles.header}>
          <div>
            <div style={styles.breadcrumb}>
              Employees / Create Account
            </div>

            <h1 style={styles.title}>
              Create Employee Account
            </h1>

            <p style={styles.subtitle}>
              Create a login account and employee profile
              for a new employee.
            </p>
          </div>

          <button
            type="button"
            onClick={onEmployees}
            style={styles.backButton}
          >
            ← Back to Employees
          </button>
        </div>

        <section style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.sectionTitle}>
              Employee Information
            </div>

            <div style={styles.grid}>
              <Field
                label="Employee ID"
                name="employeeId"
                value={form.employeeId}
                onChange={handleChange}
                placeholder="EMP001"
                required
              />

              <Field
                label="Employee Name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter employee name"
                required
              />

              <Field
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="employee@example.com"
                required
              />

              <Field
                label="Phone"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="Enter phone number"
              />

              <div style={styles.field}>
                <label style={styles.label}>
                  Department *
                </label>

                <select
                  name="department"
                  value={form.department}
                  onChange={handleChange}
                  style={styles.input}
                  disabled={loadingDepartments}
                >
                  <option value="">
                    {loadingDepartments
                      ? 'Loading departments...'
                      : 'Select department'}
                  </option>

                  {departments.map((department) => (
                    <option
                      key={department._id}
                      value={
                        department.departmentName ||
                        department.name ||
                        ''
                      }
                    >
                      {department.departmentName ||
                        department.name}
                    </option>
                  ))}
                </select>
              </div>

              <Field
                label="Designation"
                name="designation"
                value={form.designation}
                onChange={handleChange}
                placeholder="e.g. Software Developer"
              />

              <Field
                label="Date of Joining"
                name="doj"
                type="date"
                value={form.doj}
                onChange={handleChange}
              />

              <Field
                label="Leave Balance"
                name="leaveBalance"
                type="number"
                value={form.leaveBalance}
                onChange={handleChange}
                min="0"
              />
            </div>

            <div style={styles.divider}></div>

            <div style={styles.sectionTitle}>
              Login Details
            </div>

            <div style={styles.grid}>
              <Field
                label="Login Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Same as employee email"
                required
              />

              <Field
                label="Initial Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Minimum 6 characters"
                required
              />
            </div>

            {error && (
              <div style={styles.error}>
                {error}
              </div>
            )}

            {success && (
              <div style={styles.success}>
                {success}
              </div>
            )}

            <div style={styles.actions}>
              <button
                type="button"
                onClick={onEmployees}
                style={styles.cancelButton}
                disabled={submitting}
              >
                Cancel
              </button>

              <button
                type="submit"
                style={styles.createButton}
                disabled={submitting}
              >
                {submitting
                  ? 'Creating...'
                  : 'Create Employee Account'}
              </button>
            </div>
          </form>
        </section>
      </main>
    </div>
  );
}

function Field({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder,
  required = false,
  min,
}) {
  return (
    <div style={styles.field}>
      <label style={styles.label}>
        {label}
        {required ? ' *' : ''}
      </label>

      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        style={styles.input}
      />
    </div>
  );
}

const styles = {
  page: {
    minHeight: '100vh',
    background: '#f6f7fb',
    color: '#111827',
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
    display: 'flex',
  },

  sidebar: {
    width: '240px',
    height: '100vh',
    position: 'fixed',
    left: 0,
    top: 0,
    background: '#111827',
    color: '#fff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },

  logoArea: {
    height: '76px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '0 20px',
    borderBottom:
      '1px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
  },

  logoMark: {
    width: '36px',
    height: '36px',
    borderRadius: '9px',
    background: '#4f46e5',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 800,
    fontSize: '18px',
  },

  logoText: {
    fontSize: '17px',
    fontWeight: 700,
  },

  logoSubtext: {
    marginTop: '2px',
    fontSize: '11px',
    color: '#9ca3af',
  },

  menu: {
    padding: '18px 12px',
    flex: 1,
    overflow: 'hidden',
  },

  menuButton: {
    width: '100%',
    height: '42px',
    border: 'none',
    borderRadius: '8px',
    background: 'rgba(79,70,229,0.18)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '0 13px',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    textAlign: 'left',
  },

  sidebarBottom: {
    padding: '14px 12px 16px',
    borderTop:
      '1px solid rgba(255,255,255,0.08)',
    flexShrink: 0,
  },

  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 6px 12px',
  },

  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#374151',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '11px',
    fontWeight: 700,
    flexShrink: 0,
  },

  userName: {
    fontSize: '12px',
    fontWeight: 600,
  },

  userRole: {
    marginTop: '2px',
    fontSize: '10px',
    color: '#9ca3af',
  },

  logoutButton: {
    width: '100%',
    height: '38px',
    border:
      '1px solid rgba(255,255,255,0.12)',
    borderRadius: '8px',
    background: 'transparent',
    color: '#d1d5db',
    cursor: 'pointer',
    fontSize: '12px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },

  main: {
    marginLeft: '240px',
    minHeight: '100vh',
    flex: 1,
    padding: '28px 34px 40px',
    overflowY: 'auto',
    boxSizing: 'border-box',
  },

  header: {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '24px',
  },

  breadcrumb: {
    fontSize: '12px',
    color: '#6b7280',
    marginBottom: '8px',
  },

  title: {
    margin: 0,
    fontSize: '26px',
    lineHeight: 1.2,
    fontWeight: 750,
  },

  subtitle: {
    margin: '7px 0 0',
    fontSize: '13px',
    color: '#6b7280',
  },

  backButton: {
    height: '40px',
    padding: '0 15px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#fff',
    color: '#374151',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
    flexShrink: 0,
  },

  card: {
    maxWidth: '980px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    padding: '26px',
    boxSizing: 'border-box',
    boxShadow:
      '0 2px 8px rgba(15, 23, 42, 0.04)',
  },

  sectionTitle: {
    fontSize: '15px',
    fontWeight: 700,
    marginBottom: '18px',
  },

  grid: {
    display: 'grid',
    gridTemplateColumns:
      'repeat(2, minmax(0, 1fr))',
    gap: '18px 20px',
  },

  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px',
  },

  label: {
    fontSize: '12px',
    fontWeight: 600,
    color: '#374151',
  },

  input: {
    width: '100%',
    height: '42px',
    boxSizing: 'border-box',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#fff',
    color: '#111827',
    padding: '0 12px',
    fontSize: '13px',
    outline: 'none',
  },

  divider: {
    height: '1px',
    background: '#e5e7eb',
    margin: '28px 0',
  },

  error: {
    marginTop: '20px',
    padding: '11px 13px',
    borderRadius: '8px',
    background: '#fef2f2',
    border: '1px solid #fecaca',
    color: '#b91c1c',
    fontSize: '12px',
  },

  success: {
    marginTop: '20px',
    padding: '11px 13px',
    borderRadius: '8px',
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    color: '#15803d',
    fontSize: '12px',
  },

  actions: {
    display: 'flex',
    justifyContent: 'flex-end',
    gap: '10px',
    marginTop: '26px',
  },

  cancelButton: {
    height: '40px',
    padding: '0 17px',
    border: '1px solid #d1d5db',
    borderRadius: '8px',
    background: '#fff',
    color: '#374151',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },

  createButton: {
    height: '40px',
    padding: '0 18px',
    border: 'none',
    borderRadius: '8px',
    background: '#4f46e5',
    color: '#fff',
    fontSize: '13px',
    fontWeight: 600,
    cursor: 'pointer',
  },
};

export default CreateEmployeeAccount;