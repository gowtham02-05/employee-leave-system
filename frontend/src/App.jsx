import { useState } from 'react';

import Login from './components/Login.jsx';
import Register from './components/Register.jsx';
import EmployeeDashboard from './components/EmployeeDashboard.jsx';
import ApplyLeave from './components/ApplyLeave.jsx';
import MyLeaves from './components/MyLeaves.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';

function App() {
  const [page, setPage] = useState('login');

  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('user');

    if (savedUser) {
      return JSON.parse(savedUser);
    }

    return null;
  });

  const handleLogin = (loggedInUser) => {
    setUser(loggedInUser);

    if (
      loggedInUser.role === 'HR' ||
      loggedInUser.role === 'ADMIN'
    ) {
      setPage('admin-dashboard');
    } else {
      setPage('employee-dashboard');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('user');

    setUser(null);
    setPage('login');
  };

  if (page === 'login') {
    return (
      <Login
        onLogin={handleLogin}
        onRegister={() => setPage('register')}
      />
    );
  }

  if (page === 'register') {
    return (
      <Register
        onBackToLogin={() => setPage('login')}
      />
    );
  }

  if (page === 'employee-dashboard') {
    return (
      <EmployeeDashboard
        user={user}
        onApplyLeave={() => setPage('apply-leave')}
        onMyLeaves={() => setPage('my-leaves')}
        onLogout={handleLogout}
      />
    );
  }

  if (page === 'apply-leave') {
    return (
      <ApplyLeave
        onBack={() => setPage('employee-dashboard')}
      />
    );
  }

  if (page === 'my-leaves') {
    return (
      <MyLeaves
        onBack={() => setPage('employee-dashboard')}
      />
    );
  }

  if (page === 'admin-dashboard') {
    return (
      <AdminDashboard
        user={user}
        onLogout={handleLogout}
      />
    );
  }

  return null;
}

export default App;