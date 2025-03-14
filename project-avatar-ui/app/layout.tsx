// // app/layout.tsx
// import { Metadata } from 'next';
// import './globals.css'; // Your global styles

// export const metadata: Metadata = {
//   title: 'wbl Admin',
//   description: 'This is whitebox-learning admin page',
// };
// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html lang="en">
//       <body id="__next">
//         {children}
//       </body>
//     </html>
//   );
// }

// wbl_admin\app\layout.tsx
import { Metadata } from 'next';
import { Toaster } from 'react-hot-toast';
import './globals.css';
import { AuthProvider } from '../components/AuthContext'; // Import AuthProvider
import ClientLayout from './ClientLayout'; // Import the client-side layout component

export const metadata: Metadata = {
  title: 'Avatar',
  description: 'Innovapath Admin page',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="__next">
        <AuthProvider>
          {/* Wrap the client-side layout */}
          <ClientLayout>
            {children}
          </ClientLayout>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
