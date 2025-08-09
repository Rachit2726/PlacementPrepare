import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/NavBar';
import HomePage from './pages/HomePage';
import Login from './pages/Login';
import Register from './pages/Register';
import ProblemSolve from './pages/ProblemSolve';
import ProtectedRoute from './components/ProtectedRoute';
import AdminProtectedRoute from './components/AdminProtectedRoute'; // ✅ new
import CompanyList from './pages/CompanyList';
import CompanyQuestions from './pages/CompanyQuestions';
import Profile from './pages/UserProfile';
import Leaderboard from './pages/Leaderboard';
import AdminDashboard from './pages/AdminDashboard'; // ✅ new

function AppWrapper() {
  const location = useLocation();
  const hideNav = location.pathname === '/'; // hide NavBar only on home

  return (
    <>
      {!hideNav && <NavBar />}
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/companies" element={<CompanyList />} />
        <Route path="/companies/:companyName" element={<CompanyQuestions />} />

        {/* Protected user routes */}
        <Route
          path="/problems/:id"
          element={
            <ProtectedRoute>
              <ProblemSolve />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="/leaderboard" element={<Leaderboard />} />

        {/* ✅ Admin-only route */}
        <Route
          path="/admin/dashboard"
          element={
            <AdminProtectedRoute>
              <AdminDashboard />
            </AdminProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppWrapper />
    </BrowserRouter>
  );
}
