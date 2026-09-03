import { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import Button from './common/Button';

import {
  updateUser,
  deleteUser,
} from '../services/userService';

import { fetchEmployeesRequest } from '../redux/employeeSlice';

function Employees({
  user,
  onDashboard,
  onEmployees,
  onDepartments,
  onApplyLeave,
  onLogout,
}) {
  const dispatch = useDispatch();

  const {
    employees = [],
    loading,
    error,
  } = useSelector((state) => state.employees);

  const [search, setSearch] = useState('');

  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [editError, setEditError] = useState('');

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: '',
    message: '',
  });

  // ==============================
  // FETCH EMPLOYEES THROUGH REDUX-SAGA
  // ==============================

  const fetchEmployees = () => {
    dispatch(fetchEmployeesRequest());
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  // ==============================
  // NOTIFICATION
  // ==============================

  useEffect(() => {
    if (!notification.show) {
      return;
    }

    const timer = setTimeout(() => {
      setNotification({
        show: false,
        type: '',
        message: '',
      });
    }, 3000);

    return () => clearTimeout(timer);
  }, [notification.show]);

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });
  };

  // ==============================
  // FILTER EMPLOYEES
  // ==============================

  const employeeList = useMemo(() => {
    return Array.isArray(employees)
      ? employees.filter(
          (item) =>
            String(item.role || '').toUpperCase() ===
            'EMPLOYEE',
        )
      : [];
  }, [employees]);

  const filteredEmployees = useMemo(() => {
    const value = search.trim().toLowerCase();

    if (!value) {
      return employeeList;
    }

    return employeeList.filter((employee) => {
      const id = String(
        employee.employeeId ||
          employee.employeeID ||
          employee.empId ||
          employee._id ||
          '',
      ).toLowerCase();

      const name = String(
        employee.name ||
          employee.fullName ||
          employee.username ||
          '',
      ).toLowerCase();

      const email = String(
        employee.email || '',
      ).toLowerCase();

      const department = String(
        employee.department || '',
      ).toLowerCase();

      const role = String(
        employee.role || '',
      ).toLowerCase();

      return (
        id.includes(value) ||
        name.includes(value) ||
        email.includes(value) ||
        department.includes(value) ||
        role.includes(value)
      );
    });
  }, [employeeList, search]);

  // ==============================
  // EMPLOYEE HELPERS
  // ==============================

  const getEmployeeId = (employee) => {
    return (
      employee.employeeId ||
      employee.employeeID ||
      employee.empId ||
      employee._id ||
      'N/A'
    );
  };

  const getEmployeeName = (employee) => {
    return (
      employee.name ||
      employee.fullName ||
      employee.username ||
      'Unnamed Employee'
    );
  };

  const getInitial = (employee) => {
    const name = getEmployeeName(employee);

    return name.charAt(0).toUpperCase();
  };

  // ==============================
  // EDIT EMPLOYEE
  // ==============================

  const openEdit = (employee) => {
    setEditError('');

    setEditingEmployee({
      _id: employee._id,
      employeeId: employee.employeeId || '',
      name: employee.name || '',
      email: employee.email || '',
      phone: employee.phone || '',
      department: employee.department || '',
      designation: employee.designation || '',
      doj: employee.doj || '',
      leaveBalance:
        employee.leaveBalance !== undefined
          ? employee.leaveBalance
          : 12,
      status: employee.status || 'Active',
      password: '',
    });
  };

  const closeEdit = () => {
    if (editLoading) {
      return;
    }

    setEditingEmployee(null);
    setEditError('');
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;

    setEditingEmployee((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveEmployee = async (e) => {
    e.preventDefault();

    if (!editingEmployee?._id) {
      return;
    }

    setEditLoading(true);
    setEditError('');

    try {
      const updateData = {
        employeeId:
          editingEmployee.employeeId.trim(),

        name:
          editingEmployee.name.trim(),

        email:
          editingEmployee.email.trim(),

        phone:
          editingEmployee.phone.trim(),

        department:
          editingEmployee.department.trim(),

        designation:
          editingEmployee.designation.trim(),

        doj: editingEmployee.doj,

        leaveBalance:
          Number(editingEmployee.leaveBalance) || 0,

        status: editingEmployee.status,
      };

      if (editingEmployee.password.trim()) {
        updateData.password =
          editingEmployee.password.trim();
      }

      await updateUser(
        editingEmployee._id,
        updateData,
      );

      setEditingEmployee(null);

      dispatch(fetchEmployeesRequest());

      showNotification(
        'success',
        'Employee updated successfully.',
      );
    } catch (err) {
      console.error(err);

      setEditError(
        err.response?.data?.message ||
          err.message ||
          'Unable to update employee.',
      );
    } finally {
      setEditLoading(false);
    }
  };

  // ==============================
  // DELETE EMPLOYEE
  // ==============================

  const deleteEmployee = (employee) => {
    const employeeMongoId = employee?._id;

    if (!employeeMongoId) {
      showNotification(
        'error',
        'Employee ID not found. Cannot delete this employee.',
      );

      console.error(
        'Employee MongoDB _id is missing:',
        employee,
      );

      return;
    }

    setDeleteTarget(employee);
  };

  const cancelDelete = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteTarget(null);
  };

  const confirmDelete = async () => {
    if (
      !deleteTarget?._id ||
      deleteLoading
    ) {
      return;
    }

    const employeeMongoId =
      deleteTarget._id;

    setDeleteLoading(true);

    try {
      const data = await deleteUser(
        employeeMongoId,
      );

      setDeleteTarget(null);

      dispatch(fetchEmployeesRequest());

      showNotification(
        'success',
        data?.message ||
          'Employee deleted successfully.',
      );
    } catch (err) {
      console.error(
        'DELETE EMPLOYEE ERROR:',
        err,
      );

      setDeleteTarget(null);

      showNotification(
        'error',
        err.response?.data?.message ||
          err.message ||
          'Unable to delete employee.',
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  // ==============================
  // SIDEBAR STYLES
  // SAME AS ADMIN DASHBOARD
  // ==============================

  const menuButtonStyle = (active = false) => ({
    width: '100%',
    height: '44px',
    border: 'none',
    borderRadius: '9px',
    background: active
      ? '#312e81'
      : 'transparent',
    color: active
      ? '#ffffff'
      : '#cbd5e1',
    display: 'flex',
    alignItems: 'center',
    gap: '11px',
    padding: '0 13px',
    fontSize: '12px',
    fontWeight: active
      ? '600'
      : '500',
    cursor: 'pointer',
    textAlign: 'left',
    marginBottom: '5px',
    outline: 'none',
    appearance: 'none',
    WebkitAppearance:
      'none',
    WebkitTapHighlightColor:
      'transparent',
  });

  const iconStyle = {
    width: '18px',
    minWidth: '18px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '15px',
  };

  return (
    <div
      style={{
        width: '100%',
        height: '100vh',
        display: 'flex',
        background: '#f8fafc',
        color: '#0f172a',
        fontFamily:
          'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        overflow: 'hidden',
      }}
    >
      {/* SIDEBAR */}

      <aside
        style={{
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
        }}
      >
        {/* LOGO */}

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '11px',
            padding: '0 9px',
            marginBottom: '40px',
          }}
        >
          <div
            style={{
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
            }}
          >
            EL
          </div>

          <div>
            <div
              style={{
                fontSize: '17px',
                fontWeight: '800',
              }}
            >
              LeaveFlow
            </div>

            <div
              style={{
                fontSize: '9px',
                color: '#94a3b8',
                marginTop: '2px',
              }}
            >
              Employee Leave Management
            </div>
          </div>
        </div>

        {/* MENU */}

        <div
          style={{
            flex: 1,
            overflow: 'hidden',
          }}
        >
          <p
            style={{
              fontSize: '9px',
              fontWeight: '700',
              color: '#64748b',
              letterSpacing: '1.4px',
              padding: '0 11px',
              marginBottom: '10px',
            }}
          >
            HR MANAGEMENT
          </p>

          <button
            type="button"
            onClick={onDashboard}
            onMouseDown={(e) =>
              e.preventDefault()
            }
            style={menuButtonStyle(false)}
          >
            <span style={iconStyle}>
              ▣
            </span>
            Dashboard
          </button>

          <button
            type="button"
            onClick={onEmployees}
            onMouseDown={(e) =>
              e.preventDefault()
            }
            style={menuButtonStyle(true)}
          >
            <span style={iconStyle}>
              👥
            </span>
            Employees
          </button>

          <button
            type="button"
            onClick={onDepartments}
            onMouseDown={(e) =>
              e.preventDefault()
            }
            style={menuButtonStyle(false)}
          >
            <span style={iconStyle}>
              ▦
            </span>
            Departments
          </button>

          <button
            type="button"
            onClick={onApplyLeave}
            onMouseDown={(e) =>
              e.preventDefault()
            }
            style={menuButtonStyle(false)}
          >
            <span style={iconStyle}>
              ＋
            </span>
            Apply Leave
          </button>

          <button
            type="button"
            onClick={fetchEmployees}
            onMouseDown={(e) =>
              e.preventDefault()
            }
            style={menuButtonStyle(false)}
          >
            <span style={iconStyle}>
              ↻
            </span>
            Refresh
          </button>
        </div>

        {/* PROFILE */}

        <div
          style={{
            borderTop:
              '1px solid #273449',
            paddingTop: '16px',
            display: 'flex',
            alignItems: 'center',
            gap: '9px',
            marginBottom: '11px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
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
            }}
          >
            {(user?.name || 'H')
              .charAt(0)
              .toUpperCase()}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '2px',
              overflow: 'hidden',
            }}
          >
            <strong
              style={{
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '700',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.name || 'HR'}
            </strong>

            <small
              style={{
                color: '#94a3b8',
                fontSize: '10px',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {user?.role || 'HR'}
            </small>
          </div>
        </div>

        {/* LOGOUT */}

        <button
          type="button"
          onClick={onLogout}
          onMouseDown={(e) =>
            e.preventDefault()
          }
          style={{
            width: '100%',
            height: '40px',
            flexShrink: 0,
            borderRadius: '8px',
            border:
              '1px solid #374151',
            background: 'transparent',
            color: '#cbd5e1',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '7px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <span>↪</span>
          Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}

      <main
        style={{
          flex: 1,
          minWidth: 0,
          height: '100vh',
          marginLeft: '240px',
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '32px',
          boxSizing: 'border-box',
        }}
      >
        {/* HEADER */}

        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent:
              'space-between',
            gap: '20px',
            marginBottom: '28px',
          }}
        >
          <div>
            <h1
              style={{
                margin: 0,
                fontSize: '28px',
                lineHeight: '1.2',
                fontWeight: '700',
                color: '#0f172a',
                letterSpacing:
                  '-0.6px',
              }}
            >
              Employees
            </h1>

            <p
              style={{
                margin: '8px 0 0',
                color: '#64748b',
                fontSize: '14px',
              }}
            >
              View and manage all employees in the organization.
            </p>
          </div>

          <Button
            type="button"
            onClick={() => {
              window.location.href =
                '/create-employee-account';
            }}
            variant="primary"
            style={{
              height: '40px',
            }}
          >
            <span>＋</span>
            Create Employee Account
          </Button>
        </div>

        {/* SUMMARY CARD */}

        <div
          style={{
            background: '#ffffff',
            border:
              '1px solid #e2e8f0',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          <div
            style={{
              width: '46px',
              height: '46px',
              borderRadius: '10px',
              background: '#eef2ff',
              color: '#4f46e5',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '21px',
              fontWeight: '700',
              flexShrink: 0,
            }}
          >
            ♙
          </div>

          <div>
            <div
              style={{
                fontSize: '12px',
                color: '#64748b',
                fontWeight: '500',
                marginBottom: '3px',
              }}
            >
              Total Employees
            </div>

            <div
              style={{
                fontSize: '24px',
                color: '#0f172a',
                fontWeight: '700',
              }}
            >
              {employeeList.length}
            </div>
          </div>
        </div>

        {/* EMPLOYEE CARD */}

        <div
          style={{
            background: '#ffffff',
            border:
              '1px solid #e2e8f0',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          {/* CARD HEADER */}

          <div
            style={{
              padding: '20px 22px',
              borderBottom:
                '1px solid #e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent:
                'space-between',
              gap: '20px',
            }}
          >
            <div>
              <h2
                style={{
                  margin: 0,
                  color: '#0f172a',
                  fontSize: '16px',
                  fontWeight: '700',
                }}
              >
                Employee List
              </h2>

              <p
                style={{
                  margin: '5px 0 0',
                  color: '#94a3b8',
                  fontSize: '12px',
                }}
              >
                {filteredEmployees.length}{' '}
                employee
                {filteredEmployees.length !==
                1
                  ? 's'
                  : ''}{' '}
                found
              </p>
            </div>

            {/* SEARCH */}

            <div
              style={{
                position: 'relative',
                width: '280px',
                maxWidth: '100%',
              }}
            >
              <span
                style={{
                  position:
                    'absolute',
                  left: '12px',
                  top: '50%',
                  transform:
                    'translateY(-50%)',
                  color: '#94a3b8',
                  fontSize: '14px',
                  pointerEvents:
                    'none',
                }}
              >
                ⌕
              </span>

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(
                    e.target.value,
                  )
                }
                placeholder="Search employees..."
                style={{
                  width: '100%',
                  height: '38px',
                  boxSizing:
                    'border-box',
                  padding:
                    '0 12px 0 34px',
                  border:
                    '1px solid #e2e8f0',
                  borderRadius: '8px',
                  background:
                    '#ffffff',
                  color: '#0f172a',
                  fontSize: '13px',
                  outline: 'none',
                }}
              />
            </div>
          </div>

          {/* TABLE */}

          <div
            style={{
              width: '100%',
              overflowX: 'auto',
            }}
          >
            {loading ? (
              <div
                style={{
                  padding:
                    '60px 20px',
                  textAlign:
                    'center',
                  color: '#64748b',
                  fontSize: '14px',
                }}
              >
                Loading employees...
              </div>
            ) : error ? (
              <div
                style={{
                  padding:
                    '60px 20px',
                  textAlign:
                    'center',
                }}
              >
                <div
                  style={{
                    color: '#dc2626',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginBottom:
                      '14px',
                  }}
                >
                  {error}
                </div>

                <Button
                  type="button"
                  onClick={
                    fetchEmployees
                  }
                  variant="primary"
                >
                  Try Again
                </Button>
              </div>
            ) : filteredEmployees.length ===
              0 ? (
              <div
                style={{
                  padding:
                    '60px 20px',
                  textAlign:
                    'center',
                }}
              >
                <div
                  style={{
                    width: '48px',
                    height: '48px',
                    margin:
                      '0 auto 14px',
                    borderRadius:
                      '50%',
                    background:
                      '#eef2ff',
                    color:
                      '#4f46e5',
                    display: 'flex',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    fontSize: '20px',
                  }}
                >
                  ♙
                </div>

                <div
                  style={{
                    color:
                      '#0f172a',
                    fontSize:
                      '14px',
                    fontWeight:
                      '600',
                  }}
                >
                  {search
                    ? 'No employees found'
                    : 'No employees available'}
                </div>

                {search && (
                  <div
                    style={{
                      color:
                        '#94a3b8',
                      fontSize:
                        '12px',
                      marginTop:
                        '5px',
                    }}
                  >
                    Try a different search term.
                  </div>
                )}
              </div>
            ) : (
              <table
                style={{
                  width: '100%',
                  borderCollapse:
                    'collapse',
                  minWidth:
                    '1050px',
                }}
              >
                <thead>
                  <tr
                    style={{
                      background:
                        '#f8fafc',
                    }}
                  >
                    {[
                      'Employee',
                      'Employee ID',
                      'Email',
                      'Department',
                      'Role',
                      'Actions',
                    ].map(
                      (heading) => (
                        <th
                          key={heading}
                          style={{
                            padding:
                              '13px 18px',
                            textAlign:
                              'left',
                            color:
                              '#64748b',
                            fontSize:
                              '11px',
                            fontWeight:
                              '700',
                            textTransform:
                              'uppercase',
                            letterSpacing:
                              '0.5px',
                            borderBottom:
                              '1px solid #e2e8f0',
                          }}
                        >
                          {heading}
                        </th>
                      ),
                    )}
                  </tr>
                </thead>

                <tbody>
                  {filteredEmployees.map(
                    (
                      employee,
                      index,
                    ) => (
                      <tr
                        key={
                          employee._id ||
                          getEmployeeId(
                            employee,
                          ) ||
                          index
                        }
                        style={{
                          borderBottom:
                            index ===
                            filteredEmployees.length -
                              1
                              ? 'none'
                              : '1px solid #f1f5f9',
                        }}
                      >
                        <td
                          style={{
                            padding:
                              '15px 22px',
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: '11px',
                            }}
                          >
                            <div
                              style={{
                                width:
                                  '36px',
                                height:
                                  '36px',
                                borderRadius:
                                  '50%',
                                background:
                                  '#eef2ff',
                                color:
                                  '#4f46e5',
                                display:
                                  'flex',
                                alignItems:
                                  'center',
                                justifyContent:
                                  'center',
                                fontSize:
                                  '13px',
                                fontWeight:
                                  '700',
                                flexShrink:
                                  0,
                              }}
                            >
                              {getInitial(
                                employee,
                              )}
                            </div>

                            <div
                              style={{
                                minWidth:
                                  0,
                              }}
                            >
                              <div
                                style={{
                                  color:
                                    '#0f172a',
                                  fontSize:
                                    '13px',
                                  fontWeight:
                                    '600',
                                  whiteSpace:
                                    'nowrap',
                                }}
                              >
                                {getEmployeeName(
                                  employee,
                                )}
                              </div>

                              <div
                                style={{
                                  color:
                                    '#94a3b8',
                                  fontSize:
                                    '11px',
                                  marginTop:
                                    '2px',
                                }}
                              >
                                Employee
                              </div>
                            </div>
                          </div>
                        </td>

                        <td
                          style={{
                            padding:
                              '15px 18px',
                            color:
                              '#475569',
                            fontSize:
                              '13px',
                            fontWeight:
                              '500',
                          }}
                        >
                          {getEmployeeId(
                            employee,
                          )}
                        </td>

                        <td
                          style={{
                            padding:
                              '15px 18px',
                            color:
                              '#64748b',
                            fontSize:
                              '13px',
                          }}
                        >
                          {employee.email ||
                            'N/A'}
                        </td>

                        <td
                          style={{
                            padding:
                              '15px 18px',
                            color:
                              '#475569',
                            fontSize:
                              '13px',
                            fontWeight:
                              '500',
                          }}
                        >
                          {employee.department ||
                            'N/A'}
                        </td>

                        <td
                          style={{
                            padding:
                              '15px 18px',
                          }}
                        >
                          <span
                            style={{
                              display:
                                'inline-flex',
                              alignItems:
                                'center',
                              padding:
                                '5px 10px',
                              borderRadius:
                                '6px',
                              background:
                                '#eef2ff',
                              color:
                                '#4f46e5',
                              fontSize:
                                '11px',
                              fontWeight:
                                '600',
                            }}
                          >
                            {String(
                              employee.role ||
                                'EMPLOYEE',
                            ).toUpperCase()}
                          </span>
                        </td>

                        <td
                          style={{
                            padding:
                              '15px 18px',
                          }}
                        >
                          <div
                            style={{
                              display:
                                'flex',
                              alignItems:
                                'center',
                              gap: '8px',
                            }}
                          >
                            <Button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  employee,
                                )
                              }
                              variant="secondary"
                              style={{
                                height:
                                  '32px',
                                padding:
                                  '0 11px',
                                background:
                                  '#eef2ff',
                                color:
                                  '#4338ca',
                                border:
                                  '1px solid #c7d2fe',
                                fontSize:
                                  '12px',
                              }}
                            >
                              ✎ Edit
                            </Button>

                            <Button
                              type="button"
                              onClick={() =>
                                deleteEmployee(
                                  employee,
                                )
                              }
                              variant="danger"
                              style={{
                                height:
                                  '32px',
                                padding:
                                  '0 11px',
                                background:
                                  '#fef2f2',
                                color:
                                  '#dc2626',
                                border:
                                  '1px solid #fecaca',
                                fontSize:
                                  '12px',
                              }}
                            >
                              🗑 Delete
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ),
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* FOOTER */}

          {!loading &&
            !error &&
            filteredEmployees.length >
              0 && (
              <div
                style={{
                  padding:
                    '13px 22px',
                  borderTop:
                    '1px solid #e2e8f0',
                  color:
                    '#94a3b8',
                  fontSize: '11px',
                  background:
                    '#ffffff',
                }}
              >
                Showing{' '}
                {
                  filteredEmployees.length
                }{' '}
                of{' '}
                {employeeList.length}{' '}
                employees
              </div>
            )}
        </div>
      </main>

      {/* EDIT EMPLOYEE MODAL */}

      {editingEmployee && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            padding: '24px',
            zIndex: 100,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '620px',
              maxHeight: '90vh',
              overflowY: 'auto',
              background:
                '#ffffff',
              borderRadius:
                '14px',
              boxShadow:
                '0 20px 50px rgba(15, 23, 42, 0.25)',
            }}
          >
            {/* MODAL HEADER */}

            <div
              style={{
                padding:
                  '20px 22px',
                borderBottom:
                  '1px solid #e2e8f0',
                display: 'flex',
                alignItems:
                  'center',
                justifyContent:
                  'space-between',
              }}
            >
              <div>
                <h2
                  style={{
                    margin: 0,
                    fontSize:
                      '18px',
                    fontWeight:
                      '700',
                    color:
                      '#0f172a',
                  }}
                >
                  Edit Employee
                </h2>

                <p
                  style={{
                    margin:
                      '5px 0 0',
                    fontSize:
                      '12px',
                    color:
                      '#94a3b8',
                  }}
                >
                  Update employee information.
                </p>
              </div>

              <Button
                type="button"
                onClick={
                  closeEdit
                }
                disabled={
                  editLoading
                }
                variant="secondary"
                style={{
                  width: '34px',
                  height: '34px',
                  padding: 0,
                  fontSize:
                    '18px',
                }}
              >
                ×
              </Button>
            </div>

            {/* FORM */}

            <form
              onSubmit={
                saveEmployee
              }
            >
              <div
                style={{
                  padding:
                    '22px',
                  display:
                    'grid',
                  gridTemplateColumns:
                    'repeat(2, minmax(0, 1fr))',
                  gap: '16px',
                }}
              >
                {[
                  {
                    label:
                      'Employee ID',
                    name:
                      'employeeId',
                    type: 'text',
                    required:
                      true,
                  },
                  {
                    label:
                      'Name',
                    name: 'name',
                    type: 'text',
                    required:
                      true,
                  },
                  {
                    label:
                      'Email',
                    name:
                      'email',
                    type: 'email',
                    required:
                      true,
                  },
                  {
                    label:
                      'Phone',
                    name:
                      'phone',
                    type: 'text',
                  },
                  {
                    label:
                      'Department',
                    name:
                      'department',
                    type: 'text',
                    required:
                      true,
                  },
                  {
                    label:
                      'Designation',
                    name:
                      'designation',
                    type: 'text',
                  },
                  {
                    label:
                      'Date of Joining',
                    name:
                      'doj',
                    type: 'date',
                  },
                  {
                    label:
                      'Leave Balance',
                    name:
                      'leaveBalance',
                    type: 'number',
                    min: '0',
                  },
                ].map(
                  (field) => (
                    <div
                      key={
                        field.name
                      }
                    >
                      <label
                        style={{
                          display:
                            'block',
                          marginBottom:
                            '6px',
                          color:
                            '#475569',
                          fontSize:
                            '12px',
                          fontWeight:
                            '600',
                        }}
                      >
                        {
                          field.label
                        }
                      </label>

                      <input
                        type={
                          field.type
                        }
                        name={
                          field.name
                        }
                        value={
                          editingEmployee[
                            field.name
                          ]
                        }
                        onChange={
                          handleEditChange
                        }
                        required={
                          field.required
                        }
                        min={
                          field.min
                        }
                        style={{
                          width:
                            '100%',
                          height:
                            '40px',
                          boxSizing:
                            'border-box',
                          padding:
                            '0 11px',
                          border:
                            '1px solid #e2e8f0',
                          borderRadius:
                            '7px',
                          outline:
                            'none',
                          fontSize:
                            '13px',
                          color:
                            '#0f172a',
                        }}
                      />
                    </div>
                  ),
                )}

                {/* STATUS */}

                <div>
                  <label
                    style={{
                      display:
                        'block',
                      marginBottom:
                        '6px',
                      color:
                        '#475569',
                      fontSize:
                        '12px',
                      fontWeight:
                        '600',
                    }}
                  >
                    Status
                  </label>

                  <select
                    name="status"
                    value={
                      editingEmployee.status
                    }
                    onChange={
                      handleEditChange
                    }
                    style={{
                      width:
                        '100%',
                      height:
                        '40px',
                      boxSizing:
                        'border-box',
                      padding:
                        '0 11px',
                      border:
                        '1px solid #e2e8f0',
                      borderRadius:
                        '7px',
                      outline:
                        'none',
                      fontSize:
                        '13px',
                      color:
                        '#0f172a',
                      background:
                        '#ffffff',
                    }}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

                {/* PASSWORD */}

                <div
                  style={{
                    gridColumn:
                      '1 / -1',
                  }}
                >
                  <label
                    style={{
                      display:
                        'block',
                      marginBottom:
                        '6px',
                      color:
                        '#475569',
                      fontSize:
                        '12px',
                      fontWeight:
                        '600',
                    }}
                  >
                    New Password
                  </label>

                  <input
                    type="password"
                    name="password"
                    value={
                      editingEmployee.password
                    }
                    onChange={
                      handleEditChange
                    }
                    placeholder="Leave blank to keep current password"
                    minLength="6"
                    style={{
                      width:
                        '100%',
                      height:
                        '40px',
                      boxSizing:
                        'border-box',
                      padding:
                        '0 11px',
                      border:
                        '1px solid #e2e8f0',
                      borderRadius:
                        '7px',
                      outline:
                        'none',
                      fontSize:
                        '13px',
                      color:
                        '#0f172a',
                    }}
                  />
                </div>

                {/* ERROR */}

                {editError && (
                  <div
                    style={{
                      gridColumn:
                        '1 / -1',
                      padding:
                        '10px 12px',
                      borderRadius:
                        '7px',
                      background:
                        '#fef2f2',
                      border:
                        '1px solid #fecaca',
                      color:
                        '#dc2626',
                      fontSize:
                        '12px',
                      fontWeight:
                        '500',
                    }}
                  >
                    {
                      editError
                    }
                  </div>
                )}
              </div>

              {/* MODAL FOOTER */}

              <div
                style={{
                  padding:
                    '16px 22px 20px',
                  borderTop:
                    '1px solid #e2e8f0',
                  display: 'flex',
                  justifyContent:
                    'flex-end',
                  gap: '10px',
                }}
              >
                <Button
                  type="button"
                  onClick={
                    closeEdit
                  }
                  disabled={
                    editLoading
                  }
                  variant="secondary"
                  style={{
                    height: '40px',
                    padding:
                      '0 16px',
                  }}
                >
                  Cancel
                </Button>

                <Button
                  type="submit"
                  disabled={
                    editLoading
                  }
                  variant="primary"
                  style={{
                    height: '40px',
                    padding:
                      '0 18px',
                  }}
                >
                  {editLoading
                    ? 'Saving...'
                    : 'Save Changes'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}

      {deleteTarget && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background:
              'rgba(15, 23, 42, 0.55)',
            display: 'flex',
            alignItems:
              'center',
            justifyContent:
              'center',
            padding: '24px',
            zIndex: 200,
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '420px',
              background:
                '#ffffff',
              borderRadius:
                '14px',
              padding: '26px',
              boxSizing:
                'border-box',
              boxShadow:
                '0 20px 50px rgba(15, 23, 42, 0.25)',
              textAlign:
                'center',
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                margin:
                  '0 auto 16px',
                borderRadius:
                  '50%',
                background:
                  '#fef2f2',
                color:
                  '#dc2626',
                display:
                  'flex',
                alignItems:
                  'center',
                justifyContent:
                  'center',
                fontSize:
                  '22px',
              }}
            >
              🗑
            </div>

            <h2
              style={{
                margin:
                  '0 0 8px',
                fontSize:
                  '18px',
                fontWeight:
                  '700',
                color:
                  '#0f172a',
              }}
            >
              Delete Employee?
            </h2>

            <p
              style={{
                margin:
                  '0 auto',
                maxWidth:
                  '330px',
                color:
                  '#64748b',
                fontSize:
                  '13px',
                lineHeight:
                  '1.6',
              }}
            >
              Are you sure you want to
              delete{' '}
              <strong
                style={{
                  color:
                    '#0f172a',
                }}
              >
                {getEmployeeName(
                  deleteTarget,
                )}
              </strong>
              ? This action cannot be undone.
            </p>

            <div
              style={{
                display: 'flex',
                justifyContent:
                  'center',
                gap: '10px',
                marginTop:
                  '24px',
              }}
            >
              <Button
                type="button"
                onClick={
                  cancelDelete
                }
                disabled={
                  deleteLoading
                }
                variant="secondary"
                style={{
                  height: '40px',
                  minWidth:
                    '100px',
                }}
              >
                Cancel
              </Button>

              <Button
                type="button"
                onClick={
                  confirmDelete
                }
                disabled={
                  deleteLoading
                }
                variant="danger"
                style={{
                  height: '40px',
                  minWidth:
                    '100px',
                  background:
                    '#dc2626',
                  color:
                    '#ffffff',
                  border:
                    '1px solid #dc2626',
                }}
              >
                {deleteLoading
                  ? 'Deleting...'
                  : 'Delete'}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* CENTER NOTIFICATION */}

      {notification.show && (
        <div
          style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform:
              'translate(-50%, -50%)',
            zIndex: 300,
            width:
              'min(90%, 420px)',
            padding:
              '16px 20px',
            boxSizing:
              'border-box',
            borderRadius:
              '10px',
            background:
              notification.type ===
              'success'
                ? '#ecfdf5'
                : '#fef2f2',
            border:
              notification.type ===
              'success'
                ? '1px solid #a7f3d0'
                : '1px solid #fecaca',
            color:
              notification.type ===
              'success'
                ? '#047857'
                : '#dc2626',
            boxShadow:
              '0 12px 35px rgba(15, 23, 42, 0.18)',
            display: 'flex',
            alignItems:
              'center',
            gap: '12px',
            fontSize:
              '13px',
            fontWeight:
              '600',
          }}
        >
          <span
            style={{
              width: '28px',
              height: '28px',
              borderRadius:
                '50%',
              display: 'flex',
              alignItems:
                'center',
              justifyContent:
                'center',
              flexShrink: 0,
              background:
                notification.type ===
                'success'
                  ? '#d1fae5'
                  : '#fee2e2',
              fontSize:
                '14px',
            }}
          >
            {notification.type ===
            'success'
              ? '✓'
              : '!'}
          </span>

          <span>
            {
              notification.message
            }
          </span>
        </div>
      )}
    </div>
  );
}

export default Employees;