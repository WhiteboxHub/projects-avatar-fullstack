// app/page.tsx

'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Hero from '../components/Hero/page'; // Make sure the path is correct

const Home = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to login page
    // router.push('/login');
  }, [router]);

  return <Hero />;; // Optionally return null or a loading spinner while redirecting
};

export default Home;
