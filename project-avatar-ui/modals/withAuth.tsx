// "use client"
// import { useEffect, useState } from 'react';
// import { useRouter } from 'next/navigation'; // Correct import from 'next/router'
// import { useAuth } from '../components/AuthContext'; // Adjust the path to your AuthContext

// const withAuth = (WrappedComponent: React.FC) => {
//   return (props: any) => {
//     const { auth } = useAuth();
//     const router = useRouter();
//     const [isMounted, setIsMounted] = useState(false);

//     useEffect(() => {
//       // Ensure the component is only rendered on the client side
//       setIsMounted(true);
//     }, []);

//     useEffect(() => {
//       if (isMounted && !auth.isAuthenticated) {
//         router.push('/login'); // Redirect to login page if not authenticated
//       }
//     }, [auth, isMounted, router]);

//     // Render nothing if the component is not mounted yet or user is not authenticated
//     if (!isMounted || !auth.isAuthenticated) {
//       return null; // Optionally, you could return a loader or spinner here
//     }

//     return <WrappedComponent {...props} />;
//   };
// };

// export default withAuth;

// ------------------------------old code ------------------------------------------------


// ---------------------------------------------------------------------------------------
// import React from 'react';
// import { Navigate } from 'react-router-dom';

// // Define a type for the props that your wrapped component will receive
// type WithAuthProps = {
//   // Define any props that your WrappedComponent might receive here
// };

// // Create a type for the WrappedComponent itself
// type WrappedComponentProps = WithAuthProps & React.ComponentPropsWithoutRef<'div'>;

// const withAuth = <P extends WithAuthProps>(WrappedComponent: React.ComponentType<P>) => {
//   return (props: P) => {
//     const isAuthenticated = localStorage.getItem('isAuthenticated');

//     if (isAuthenticated) {
//       return <WrappedComponent {...props} />;
//     } else {
//       return <Navigate to="/error" />;
//     }
//   };
// };

// export default withAuth;

// --------------------------------------------------------------------------------------------------------
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthContext';

const withAuth = (WrappedComponent: React.FC) => {
  const AuthenticatedComponent: React.FC = (props: any) => {
    const { auth, isLoading } = useAuth(); // Access auth state from context
    const router = useRouter();
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
      setIsMounted(true); // Make sure the component is mounted before checking auth status

      // If not loading and the user is not authenticated, redirect to login
      if (!isLoading && !auth.isAuthenticated) {
        router.push('/login');
      }
    }, [auth.isAuthenticated, isLoading, router]);

    if (!isMounted || isLoading) {
      return <div>Loading...</div>; // Show loading while the auth status is being checked
    }

    if (auth.isAuthenticated) {
      return <WrappedComponent {...props} />;
    }

    return null; // Avoid rendering if user is being redirected
  };

  return AuthenticatedComponent;
};

export default withAuth;
