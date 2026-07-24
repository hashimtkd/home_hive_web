import { BrowserRouter as Router } from 'react-router-dom';
import { useEffect } from 'react';
import { AppRoutes } from './routes/AppRoutes';
import { useAuthStore } from './store/useAuthStore';

function App() {
  const initAuthListener = useAuthStore((state) => state.initAuthListener);

  useEffect(() => {
    const unsubscribe = initAuthListener();
    return () => unsubscribe();
  }, [initAuthListener]);

  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
