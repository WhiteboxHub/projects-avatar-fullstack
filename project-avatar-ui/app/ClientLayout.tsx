'use client'; // This file is a Client Component

import Header from '../components/Header/Header'; // Import the Header component
import { usePathname } from 'next/navigation'; // Client-side hook

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname(); // Get the current path

  // Define routes where the header should not appear, such as the login page
  const hideHeaderRoutes = ['/login','/'];

  const shouldShowHeader = !hideHeaderRoutes.includes(pathname); // Conditionally show header

  return (
    <>
      {shouldShowHeader && <Header />} {/* Conditionally render header */}
      {children}
    </>
  );
}

