import React from 'react';
import { Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import AdminDashboard from './pages/AdminDashboard';
import Terms from './pages/Terms';
import Privacy from './pages/Privacy';
import Login from './pages/Login';
import ProtectedRoute from './components/ProtectedRoute';
function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/login" element={<Login />} />
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
export default App;
