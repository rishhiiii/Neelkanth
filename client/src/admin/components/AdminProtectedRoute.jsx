import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '../contexts/AdminAuthContext';

export default function AdminProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading, role } = useAdminAuth();

  if (loading) return null;
  if (!isAuthenticated) return <Navigate to="/admin/login" replace />;
  if (allowedRoles && !allowedRoles.includes(role)) {
    return <Navigate to="/admin" replace />;
  }

  return children;
}
