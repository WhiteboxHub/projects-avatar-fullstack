import React, { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from './AuthContext'; // Adjust the path if necessary

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { auth } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!auth.isAuthenticated) {
      router.push('/'); // Redirect to homepage if not authenticated
    }
  }, [auth.isAuthenticated, router]);

  // Render nothing or a loading spinner while checking authentication
  if (!auth.isAuthenticated) {
    return null; // or a loading spinner
  }

  return <>{children}</>; // Render the protected component if authenticated
};

export default ProtectedRoute;
