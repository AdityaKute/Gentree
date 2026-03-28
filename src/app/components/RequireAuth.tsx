import { Navigate, Outlet } from 'react-router';
import { useAuth } from '../store/useAuthStore';

export function RequireAuth() {
  const auth = useAuth();
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return <Outlet />;
}
