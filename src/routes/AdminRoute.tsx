import { useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';

export function AdminRoute() {
  const { user, isAdmin, isLoading, initAuthListener } = useAuthStore();

  useEffect(() => {
    // initAuthListener returns the Firebase unsubscribe function.
    // This also runs in App.tsx, but calling it here ensures the listener
    // is active even if AdminRoute mounts before App's effect fires.
    // Firebase de-duplicates listeners on the same auth instance, so this is safe.
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  // Must be authenticated AND be the designated admin email
  if (!user || !isAdmin) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}
