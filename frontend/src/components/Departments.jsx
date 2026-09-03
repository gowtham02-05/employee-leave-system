import React, { useEffect, useState } from "react";

function Departments({
  user,
  onDashboard,
  onEmployees,
  onDepartments,
  onApplyLeave,
  onLogout,
}) {
  const [departments, setDepartments] = useState([]);
  const [departmentName, setDepartmentName] = useState("");
  const [description, setDescription] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [deleteTarget, setDeleteTarget] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notification, setNotification] = useState({
    show: false,
    type: "",
    message: "",
  });

  const token = localStorage.getItem("access_token");

  const fetchDepartments = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("http://localhost:3000/departments", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to load departments");
      }

      const data = await response.json();
      setDepartments(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDepartments();
  }, []);

  const showNotification = (type, message) => {
    setNotification({
      show: true,
      type,
      message,
    });

    setTimeout(() => {
      setNotification({
        show: false,
        type: "",
        message: "",
      });
    }, 3000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!departmentName.trim() || !description.trim()) {
      setError("Please enter department name and description.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `http://localhost:3000/departments/${editingId}`
        : "http://localhost:3000/departments";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          departmentName: departmentName.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to save department");
      }

      setDepartmentName("");
      setDescription("");
      setEditingId(null);

      await fetchDepartments();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (department) => {
    setEditingId(department._id);
    setDepartmentName(department.departmentName);
    setDescription(department.description);
    setError("");
  };

  const handleDelete = (department) => {
    setDeleteTarget(department);
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    try {
      setDeleteLoading(true);
      setError("");

      const response = await fetch(
        `http://localhost:3000/departments/${deleteTarget._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to delete department");
      }

      setDeleteTarget(null);

      await fetchDepartments();

      showNotification(
        "success",
        "Department deleted successfully"
      );
    } catch (err) {
      setDeleteTarget(null);

      showNotification(
        "error",
        err.message || "Failed to delete department"
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setDepartmentName("");
    setDescription("");
    setError("");
  };

  const styles = {
    page: {
      width: "100%",
      height: "100vh",
      display: "flex",
      background: "#f8fafc",
      color: "#0f172a",
      fontFamily:
        'Inter, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      overflow: "hidden",
    },

    sidebar: {
      width: "240px",
      height: "100vh",
      flexShrink: 0,
      background: "#111827",
      color: "#ffffff",
      padding: "25px 17px",
      boxSizing: "border-box",
      display: "flex",
      flexDirection: "column",
      position: "fixed",
      left: 0,
      top: 0,
      bottom: 0,
      overflow: "hidden",
    },

    logo: {
      display: "flex",
      alignItems: "center",
      gap: "11px",
      padding: "0 9px",
      marginBottom: "40px",
    },

    logoIcon: {
      width: "40px",
      height: "40px",
      borderRadius: "10px",
      background: "linear-gradient(135deg, #6366f1, #8b5cf6)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "13px",
      fontWeight: "800",
    },

    logoTitle: {
      fontSize: "17px",
      fontWeight: "800",
    },

    logoSubtitle: {
      fontSize: "9px",
      color: "#94a3b8",
      marginTop: "2px",
    },

    menu: {
      flex: 1,
    },

    menuTitle: {
      fontSize: "9px",
      fontWeight: "700",
      color: "#64748b",
      letterSpacing: "1.4px",
      padding: "0 11px",
      marginBottom: "10px",
    },

    menuButton: {
      width: "100%",
      height: "44px",
      border: "none",
      borderRadius: "9px",
      background: "transparent",
      color: "#cbd5e1",
      display: "flex",
      alignItems: "center",
      gap: "11px",
      padding: "0 13px",
      fontSize: "12px",
      fontWeight: "500",
      cursor: "pointer",
      textAlign: "left",
      marginBottom: "5px",
    },

    activeMenu: {
      width: "100%",
      height: "44px",
      border: "none",
      borderRadius: "9px",
      background: "#312e81",
      color: "#ffffff",
      display: "flex",
      alignItems: "center",
      gap: "11px",
      padding: "0 13px",
      fontSize: "12px",
      fontWeight: "600",
      cursor: "pointer",
      textAlign: "left",
      marginBottom: "5px",
    },

    icon: {
      width: "16px",
      display: "inline-flex",
      justifyContent: "center",
      alignItems: "center",
      flexShrink: 0,
    },

    adminProfile: {
      borderTop: "1px solid #273449",
      paddingTop: "16px",
      display: "flex",
      alignItems: "center",
      gap: "9px",
      marginBottom: "11px",
      flexShrink: 0,
    },

    avatar: {
      width: "36px",
      height: "36px",
      borderRadius: "50%",
      background: "#4f46e5",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "12px",
      fontWeight: "800",
      flexShrink: 0,
    },

    profileInfo: {
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      overflow: "hidden",
    },

    profileName: {
      fontSize: "12px",
      fontWeight: "700",
      color: "#ffffff",
      whiteSpace: "nowrap",
      overflow: "hidden",
      textOverflow: "ellipsis",
    },

    profileRole: {
      fontSize: "10px",
      color: "#94a3b8",
    },

    logoutButton: {
      width: "100%",
      height: "40px",
      flexShrink: 0,
      borderRadius: "8px",
      border: "1px solid #374151",
      background: "transparent",
      color: "#cbd5e1",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: "7px",
      fontSize: "11px",
      fontWeight: "600",
      cursor: "pointer",
    },

    main: {
      flex: 1,
      minWidth: 0,
      height: "100vh",
      marginLeft: "240px",
      overflowY: "auto",
      overflowX: "hidden",
      boxSizing: "border-box",
    },

    content: {
      padding: "35px",
      boxSizing: "border-box",
    },

    heading: {
      fontSize: "30px",
      fontWeight: "700",
      color: "#111827",
      margin: "0 0 8px",
    },

    subtitle: {
      color: "#6b7280",
      marginBottom: "30px",
    },

    formCard: {
      background: "#fff",
      padding: "25px",
      borderRadius: "12px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
      marginBottom: "30px",
    },

    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #d1d5db",
      borderRadius: "7px",
      boxSizing: "border-box",
      fontSize: "14px",
      marginTop: "7px",
      marginBottom: "18px",
      outline: "none",
    },

    label: {
      fontSize: "14px",
      fontWeight: "600",
      color: "#374151",
    },

    primaryButton: {
      background: "#2563eb",
      color: "#fff",
      border: "none",
      padding: "11px 20px",
      borderRadius: "7px",
      cursor: "pointer",
      fontSize: "14px",
      marginRight: "10px",
    },

    cancelButton: {
      background: "#6b7280",
      color: "#fff",
      border: "none",
      padding: "11px 20px",
      borderRadius: "7px",
      cursor: "pointer",
      fontSize: "14px",
    },

    grid: {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
      gap: "20px",
    },

    card: {
      background: "#fff",
      borderRadius: "12px",
      padding: "22px",
      boxShadow: "0 2px 10px rgba(0,0,0,0.06)",
    },

    cardTitle: {
      fontSize: "20px",
      fontWeight: "700",
      color: "#111827",
      marginBottom: "10px",
    },

    cardDescription: {
      color: "#6b7280",
      lineHeight: "1.5",
      minHeight: "45px",
    },

    cardActions: {
      marginTop: "20px",
      display: "flex",
      gap: "8px",
    },

    editButton: {
      border: "none",
      background: "#f59e0b",
      color: "#fff",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
    },

    deleteButton: {
      border: "none",
      background: "#dc2626",
      color: "#fff",
      padding: "8px 14px",
      borderRadius: "6px",
      cursor: "pointer",
    },

    error: {
      background: "#fee2e2",
      color: "#b91c1c",
      padding: "12px",
      borderRadius: "7px",
      marginBottom: "20px",
    },

    empty: {
      background: "#fff",
      padding: "30px",
      borderRadius: "12px",
      textAlign: "center",
      color: "#6b7280",
    },
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
              Employee Leave Management
            </div>
          </div>
        </div>

        <div style={styles.menu}>
          <p style={styles.menuTitle}>HR MANAGEMENT</p>

          <button
            type="button"
            style={styles.menuButton}
            onClick={onDashboard}
          >
            <span style={styles.icon}>▣</span>
            Dashboard
          </button>

          <button
            type="button"
            style={styles.menuButton}
            onClick={onEmployees}
          >
            <span style={styles.icon}>👥</span>
            Employees
          </button>

          <button
            type="button"
            style={styles.activeMenu}
            onClick={onDepartments}
          >
            <span style={styles.icon}>▦</span>
            Departments
          </button>

          <button
            type="button"
            style={styles.menuButton}
            onClick={onApplyLeave}
          >
            <span style={styles.icon}>＋</span>
            Apply Leave
          </button>

          <button
            type="button"
            style={styles.menuButton}
            onClick={fetchDepartments}
          >
            <span style={styles.icon}>↻</span>
            Refresh
          </button>
        </div>

        <div style={styles.adminProfile}>
          <div style={styles.avatar}>
            {(user?.name || "H").charAt(0).toUpperCase()}
          </div>

          <div style={styles.profileInfo}>
            <strong style={styles.profileName}>
              {user?.name || "HR"}
            </strong>

            <small style={styles.profileRole}>
              {user?.role || "HR"}
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
      <main style={styles.main}>
        <div style={styles.content}>
          <h1 style={styles.heading}>Departments</h1>

          <p style={styles.subtitle}>
            Manage departments in the organization.
          </p>

          {error && <div style={styles.error}>{error}</div>}

          {/* ADD / EDIT FORM */}
          <div style={styles.formCard}>
            <h2 style={{ marginTop: 0 }}>
              {editingId ? "Edit Department" : "Add Department"}
            </h2>

            <form onSubmit={handleSubmit}>
              <label style={styles.label}>
                Department Name
              </label>

              <input
                type="text"
                value={departmentName}
                onChange={(e) => setDepartmentName(e.target.value)}
                placeholder="Enter department name"
                style={styles.input}
              />

              <label style={styles.label}>
                Description
              </label>

              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter department description"
                style={styles.input}
              />

              <button
                type="submit"
                style={styles.primaryButton}
                disabled={saving}
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Department"
                  : "Add Department"}
              </button>

              {editingId && (
                <button
                  type="button"
                  style={styles.cancelButton}
                  onClick={handleCancel}
                >
                  Cancel
                </button>
              )}
            </form>
          </div>

          {/* DEPARTMENT LIST */}
          <h2
            style={{
              color: "#111827",
              marginBottom: "20px",
            }}
          >
            Department List
          </h2>

          {loading ? (
            <div style={styles.empty}>
              Loading departments...
            </div>
          ) : departments.length === 0 ? (
            <div style={styles.empty}>
              No departments found.
            </div>
          ) : (
            <div style={styles.grid}>
              {departments.map((department) => (
                <div
                  style={styles.card}
                  key={department._id}
                >
                  <div style={styles.cardTitle}>
                    {department.departmentName}
                  </div>

                  <div style={styles.cardDescription}>
                    {department.description}
                  </div>

                  <div style={styles.cardActions}>
                    <button
                      type="button"
                      style={styles.editButton}
                      onClick={() => handleEdit(department)}
                    >
                      Edit
                    </button>

                    <button
                      type="button"
                      style={styles.deleteButton}
                      onClick={() => handleDelete(department)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div
          style={{
            position: "fixed",
            inset: 0,
            background: "rgba(15, 23, 42, 0.45)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 200,
            padding: "20px",
            boxSizing: "border-box",
          }}
        >
          <div
            style={{
              width: "min(90%, 420px)",
              background: "#ffffff",
              borderRadius: "12px",
              padding: "24px",
              boxSizing: "border-box",
              boxShadow: "0 20px 50px rgba(15, 23, 42, 0.25)",
            }}
          >
            <h3
              style={{
                margin: "0 0 10px",
                color: "#111827",
                fontSize: "18px",
              }}
            >
              Delete Department?
            </h3>

            <p
              style={{
                margin: "0 0 22px",
                color: "#64748b",
                fontSize: "13px",
                lineHeight: "1.5",
              }}
            >
              Are you sure you want to delete{" "}
              <strong>
                {deleteTarget.departmentName}
              </strong>
              ?
            </p>

            <div
              style={{
                display: "flex",
                justifyContent: "flex-end",
                gap: "10px",
              }}
            >
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                disabled={deleteLoading}
                style={{
                  padding: "10px 16px",
                  border: "1px solid #d1d5db",
                  borderRadius: "7px",
                  background: "#ffffff",
                  color: "#374151",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmDelete}
                disabled={deleteLoading}
                style={{
                  padding: "10px 16px",
                  border: "none",
                  borderRadius: "7px",
                  background: "#dc2626",
                  color: "#ffffff",
                  cursor: "pointer",
                  fontSize: "13px",
                  fontWeight: "600",
                }}
              >
                {deleteLoading ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TOP-CENTER NOTIFICATION */}
      {notification.show && (
        <div
          style={{
            position: "fixed",
            top: "20px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: 300,
            width: "min(90%, 420px)",
            padding: "16px 20px",
            boxSizing: "border-box",
            borderRadius: "10px",
            background:
              notification.type === "success"
                ? "#ecfdf5"
                : "#fef2f2",
            border:
              notification.type === "success"
                ? "1px solid #a7f3d0"
                : "1px solid #fecaca",
            color:
              notification.type === "success"
                ? "#047857"
                : "#dc2626",
            boxShadow:
              "0 12px 35px rgba(15, 23, 42, 0.18)",
            display: "flex",
            alignItems: "center",
            gap: "12px",
            fontSize: "13px",
            fontWeight: "600",
          }}
        >
          <span>
            {notification.type === "success" ? "✓" : "✕"}
          </span>

          <span>{notification.message}</span>
        </div>
      )}
    </div>
  );
}

export default Departments;