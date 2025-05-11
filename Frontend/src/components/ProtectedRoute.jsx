import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const token = localStorage.getItem('token'); // Check if the token exists

  if (!token) {
    // Redirect to login if no token is found
    return <Navigate to="/login" replace />;
  }

  return children; // Render the protected route if authenticated
}