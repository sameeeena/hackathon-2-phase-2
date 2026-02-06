import { useState, useEffect } from 'react';
import { authClient } from '@/lib/auth-client';

interface SessionData {
  user?: {
    token: string;
  };
  isLoading?: boolean;
}

export function useSession() {
  const [session, setSession] = useState<SessionData | null>(null);
  const [isPending, setIsPending] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      setIsPending(true);

      try {
        const result = await authClient.getSession();
        setSession(result.data);
      } catch (error) {
        console.error('Session check error:', error);
        setSession(null);
      } finally {
        setIsPending(false);
      }
    };

    checkSession();

    // Set up interval to periodically check session validity
    const interval = setInterval(checkSession, 60000); // Check every minute

    return () => clearInterval(interval);
  }, []);

  return { data: session, isPending };
}