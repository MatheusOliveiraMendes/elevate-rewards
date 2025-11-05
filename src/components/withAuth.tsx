// frontend/components/withAuth.tsx
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { getActiveSession } from '../services/authStorage';

const withAuth = (WrappedComponent: React.ComponentType) => {
  const Wrapper = (props: React.ComponentProps<typeof WrappedComponent>) => {
    const router = useRouter();
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      const session = getActiveSession();
      if (!session) {
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
