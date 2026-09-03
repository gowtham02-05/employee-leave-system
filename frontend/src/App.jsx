import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from 'react-router-dom';
import { useEffect } from 'react';

import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import ApplyLeave from './components/ApplyLeave.jsx';
import MyLeaves from './components/MyLeaves.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import HRApplyLeave from './components/HRApplyLeave.jsx';
import Employees from './components/Employees.jsx';
import Departments from './components/Departments.jsx';
import CreateEmployeeAccount from './components/CreateEmployeeAccount.jsx';

const isHR = (user) =>
  user?.role === 'HR' || user?.role === 'ADMIN';

const isEmployee = (user) =>
  user?.role !== 'HR' && user?.role !== 'ADMIN';

const getStoredUser = () => {
  const savedUser = localStorage.getItem('user');

  if (!savedUser) {
    return null;
  }

  try {
    return JSON.parse(savedUser);
  } catch {
    localStorage.removeItem('user');
    return null;
  }
};

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const user = getStoredUser();

  useEffect(() => {
    const pageTitles = {
      '/admin': 'LeaveFlow - HR Dashboard',
      '/employees': 'LeaveFlow - Employees',
      '/departments': 'LeaveFlow - Departments',
      '/hr-apply-leave': 'LeaveFlow - HR Apply Leave',
      '/apply-leave': 'LeaveFlow - Apply Leave',
      '/my-leaves': 'LeaveFlow - My Leaves',
      '/register': 'LeaveFlow - Register',
    };

    document.title =
      pageTitles[location.pathname] || 'LeaveFlow - Login';
  }, [location.pathname]);

  const handleLogin = (loggedInUser) => {
    const loggedUser =
      loggedInUser?.user || loggedInUser;

    if (!loggedUser) {
      return;
    }

    localStorage.setItem(
      'user',
      JSON.stringify(loggedUser),
    );

    const role = String(
      loggedUser.role || '',
    ).toUpperCase();

    if (role === 'HR' || role === 'ADMIN') {
      navigate('/admin');
      return;
    }

    if (role === 'EMPLOYEE') {
      navigate('/apply-leave');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <Routes>
      <Route
        path="/login"
        element={
          <Login
            onLogin={handleLogin}
            onRegister={() => navigate('/register')}
          />
        }
      />

      <Route
        path="/register"
        element={
          <Register
            onBackToLogin={() => navigate('/login')}
          />
        }
      />

      <Route
        path="/create-employee-account"
        element={
          isHR(user) ? (
            <CreateEmployeeAccount
              user={user}
              onEmployees={() =>
                navigate('/employees')
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/apply-leave"
        element={
          isEmployee(user) && user ? (
            <ApplyLeave
              user={user}
              onMyLeaves={() =>
                navigate('/my-leaves')
              }
              onApplyLeave={() =>
                navigate('/apply-leave')
              }
              onLogout={handleLogout}
            />
          ) : isHR(user) ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/my-leaves"
        element={
          isEmployee(user) && user ? (
            <MyLeaves
              user={user}
              onMyLeaves={() =>
                navigate('/my-leaves')
              }
              onApplyLeave={() =>
                navigate('/apply-leave')
              }
              onLogout={handleLogout}
            />
          ) : isHR(user) ? (
            <Navigate to="/admin" replace />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/admin"
        element={
          isHR(user) ? (
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              onApplyLeave={() =>
                navigate('/hr-apply-leave')
              }
              onEmployees={() =>
                navigate('/employees')
              }
              onDepartments={() =>
                navigate('/departments')
              }
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/employees"
        element={
          isHR(user) ? (
            <Employees
              user={user}
              onDashboard={() =>
                navigate('/admin')
              }
              onEmployees={() =>
                navigate('/employees')
              }
              onDepartments={() =>
                navigate('/departments')
              }
              onApplyLeave={() =>
                navigate('/hr-apply-leave')
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/departments"
        element={
          isHR(user) ? (
            <Departments
              user={user}
              onDashboard={() =>
                navigate('/admin')
              }
              onEmployees={() =>
                navigate('/employees')
              }
              onDepartments={() =>
                navigate('/departments')
              }
              onApplyLeave={() =>
                navigate('/hr-apply-leave')
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="/hr-apply-leave"
        element={
          isHR(user) ? (
            <HRApplyLeave
              user={user}
              onBack={() =>
                navigate('/admin')
              }
              onEmployees={() =>
                navigate('/employees')
              }
              onDepartments={() =>
                navigate('/departments')
              }
              onApplyLeave={() =>
                navigate('/hr-apply-leave')
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />

      <Route
        path="*"
        element={
          <Navigate to="/login" replace />
        }
      />
    </Routes>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}

export default App;