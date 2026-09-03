import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
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

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();

  // ==============================
  // BROWSER TAB TITLE
  // ==============================

  useEffect(() => {
    const path = location.pathname;

    if (path === '/admin') {
      document.title = 'LeaveFlow - HR Dashboard';
    } else if (path === '/employees') {
      document.title = 'LeaveFlow - Employees';
    } else if (path === '/departments') {
      document.title = 'LeaveFlow - Departments';
    } else if (path === '/hr-apply-leave') {
      document.title = 'LeaveFlow - HR Apply Leave';
    } else if (path === '/apply-leave') {
      document.title = 'LeaveFlow - Apply Leave';
    } else if (path === '/my-leaves') {
      document.title = 'LeaveFlow - My Leaves';
    } else if (path === '/register') {
      document.title = 'LeaveFlow - Register';
    } else {
      document.title = 'LeaveFlow - Login';
    }
  }, [location.pathname]);

  // ==============================
  // GET LOGGED-IN USER
  // ==============================

  const getUser = () => {
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

  const user = getUser();

  // ==============================
  // LOGIN
  // ==============================

  const handleLogin = (loggedInUser) => {
    const loggedUser =
      loggedInUser?.user || loggedInUser;

    if (!loggedUser) {
      console.error(
        'No user received from login',
      );
      return;
    }

    localStorage.setItem(
      'user',
      JSON.stringify(loggedUser),
    );

    const role = String(
      loggedUser.role || '',
    ).toUpperCase();

    console.log(
      'LOGIN USER:',
      loggedUser,
    );

    console.log(
      'LOGIN ROLE:',
      role,
    );

    if (
      role === 'HR' ||
      role === 'ADMIN'
    ) {
      navigate('/admin');
    } else if (
      role === 'EMPLOYEE'
    ) {
      navigate('/apply-leave');
    } else {
      console.error(
        'Unknown role:',
        role,
      );
    }
  };

  // ==============================
  // LOGOUT
  // ==============================

  const handleLogout = () => {
    localStorage.removeItem(
      'access_token',
    );

    localStorage.removeItem(
      'user',
    );

    navigate('/login');
  };

  return (
    <Routes>

      {/* ==========================
          LOGIN
      ========================== */}

      <Route
        path="/login"
        element={
          <Login
            onLogin={handleLogin}
            onRegister={() =>
              navigate('/register')
            }
          />
        }
      />

      {/* ==========================
          CREATE EMPLOYEE ACCOUNT
      ========================== */}

      <Route
        path="/create-employee-account"
        element={
          user &&
          (
            user.role === 'HR' ||
            user.role === 'ADMIN'
          ) ? (
            <CreateEmployeeAccount
              user={user}
              onEmployees={() =>
                navigate('/employees')
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ==========================
          REGISTER
      ========================== */}

      <Route
        path="/register"
        element={
          <Register
            onBackToLogin={() =>
              navigate('/login')
            }
          />
        }
      />

      {/* ==========================
          EMPLOYEE APPLY LEAVE
      ========================== */}

      <Route
        path="/apply-leave"
        element={
          user &&
          user.role !== 'HR' &&
          user.role !== 'ADMIN' ? (
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
          ) : user &&
            (
              user.role === 'HR' ||
              user.role === 'ADMIN'
            ) ? (
            <Navigate
              to="/admin"
              replace
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ==========================
          EMPLOYEE MY LEAVES
      ========================== */}

      <Route
        path="/my-leaves"
        element={
          user &&
          user.role !== 'HR' &&
          user.role !== 'ADMIN' ? (
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
          ) : user &&
            (
              user.role === 'HR' ||
              user.role === 'ADMIN'
            ) ? (
            <Navigate
              to="/admin"
              replace
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ==========================
          HR / ADMIN DASHBOARD
      ========================== */}

      <Route
        path="/admin"
        element={
          user &&
          (
            user.role === 'HR' ||
            user.role === 'ADMIN'
          ) ? (
            <AdminDashboard
              user={user}
              onLogout={handleLogout}
              onApplyLeave={() =>
                navigate(
                  '/hr-apply-leave',
                )
              }
              onEmployees={() =>
                navigate('/employees')
              }
              onDepartments={() =>
                navigate('/departments')
              }
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ==========================
          EMPLOYEES
      ========================== */}

      <Route
        path="/employees"
        element={
          user &&
          (
            user.role === 'HR' ||
            user.role === 'ADMIN'
          ) ? (
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
                navigate(
                  '/hr-apply-leave',
                )
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ==========================
          DEPARTMENTS
      ========================== */}

      <Route
        path="/departments"
        element={
          user &&
          (
            user.role === 'HR' ||
            user.role === 'ADMIN'
          ) ? (
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
                navigate(
                  '/hr-apply-leave',
                )
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ==========================
          HR APPLY LEAVE
      ========================== */}

      <Route
        path="/hr-apply-leave"
        element={
          user &&
          (
            user.role === 'HR' ||
            user.role === 'ADMIN'
          ) ? (
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
                navigate(
                  '/hr-apply-leave',
                )
              }
              onLogout={handleLogout}
            />
          ) : (
            <Navigate
              to="/login"
              replace
            />
          )
        }
      />

      {/* ==========================
          UNKNOWN URL
      ========================== */}

      <Route
        path="*"
        element={
          <Navigate
            to="/login"
            replace
          />
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