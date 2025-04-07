// frontend/components/withAuth.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.replace('/login');
      } else {
        setIsAuthenticated(true);
      }
    }, [router]);

    if (!isAuthenticated) return null; // ou um spinner, etc.

    return <WrappedComponent {...props} />;
  };

  return Wrapper;
};

export default withAuth;