import { useState, useEffect, createContext } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import BusBooking from './pages/BusBooking';
import TrainBooking from './pages/TrainBooking';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Callback from './pages/Callback';
import ErrorPage from './pages/ErrorPage';
import NotFound from './pages/NotFound';
import { useDispatch, useSelector } from 'react-redux';
import { setUser, clearUser } from './store/userSlice';

// Create auth context
export const AuthContext = createContext(null);

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isInitialized, setIsInitialized] = useState(false);
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

  // Get authentication status with proper error handling
  const userState = useSelector((state) => state.user);
  const isAuthenticated = userState?.isAuthenticated || false;

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };
  
  // Initialize ApperUI once when the app loads
  useEffect(() => {
    const { ApperClient, ApperUI } = window.ApperSDK;
    const client = new ApperClient({
      apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
      apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
    });
    
    // Initialize but don't show login yet
    ApperUI.setup(client, {
      target: '#authentication',
      clientId: import.meta.env.VITE_APPER_PROJECT_ID,
      view: 'both',
      onSuccess: function (user) {
        setIsInitialized(true);
        // CRITICAL: This exact currentPath logic must be preserved in all implementations
        // DO NOT simplify or modify this pattern as it ensures proper redirection flow
        let currentPath = window.location.pathname + window.location.search;
        let redirectPath = new URLSearchParams(window.location.search).get('redirect');
        const isAuthPage = currentPath.includes('/login') || currentPath.includes('/signup') || currentPath.includes(
            '/callback') || currentPath.includes('/error');
        if (user) {
            // User is authenticated
            if (redirectPath) {
                navigate(redirectPath);
            } else if (!isAuthPage) {
                if (!currentPath.includes('/login') && !currentPath.includes('/signup')) {
                    navigate(currentPath);
                } else {
                    navigate('/');
                }
            } else {
                navigate('/');
            }
            // Store user information in Redux
            dispatch(setUser(JSON.parse(JSON.stringify(user))));
        } else {
            // User is not authenticated
            if (!isAuthPage) {
                navigate(
                    currentPath.includes('/signup')
                     ? `/signup?redirect=${currentPath}`
                     : currentPath.includes('/login')
                     ? `/login?redirect=${currentPath}`
                     : '/login');
            } else if (redirectPath) {
                if (
                    ![
                        'error',
                        'signup',
                        'login',
                        'callback'
                    ].some((path) => currentPath.includes(path)))
                    navigate(`/login?redirect=${redirectPath}`);
                else {
                    navigate(currentPath);
                }
            } else if (isAuthPage) {
                navigate(currentPath);
            } else {
                navigate('/login');
            }
            dispatch(clearUser());
        }
      },
      onError: function(error) {
        console.error("Authentication failed:", error);
      }
    });
  }, [dispatch, navigate]);
  
  // Authentication methods to share via context
  const authMethods = {
    isInitialized,
    isAuthenticated,
    logout: async () => {
      try {
        const { ApperUI } = window.ApperSDK;
        await ApperUI.logout();
        dispatch(clearUser());
        navigate('/login');
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Pre-declare icon components
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const BusIcon = getIcon('Bus');
  const TrainIcon = getIcon('Train');

  // Don't render routes until initialization is complete
  if (!isInitialized) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-primary">Initializing application...</div>;
  }

  return (
    <AuthContext.Provider value={authMethods}>
      <div className="min-h-screen flex flex-col">
        <header className="py-4 px-6 bg-white dark:bg-surface-800 border-b border-surface-200 dark:border-surface-700 sticky top-0 z-10 shadow-sm">
          <div className="container-custom flex justify-between items-center">
            <div className="flex items-center gap-2">
              <img 
                src="/calendar.svg" 
                alt="BookSmart Logo" 
                className="w-8 h-8" 
              />
              <h1 className="text-xl font-bold text-primary">BookSmart</h1>
            </div>
            
            {isAuthenticated ? (
              <div className="hidden md:flex gap-6 items-center">
                <a href="/" className="text-surface-600 hover:text-primary transition-colors">Home</a>
                <a href="/bus-booking" className="flex items-center gap-1 text-surface-600 hover:text-primary transition-colors">
                  <BusIcon className="w-4 h-4" />
                  <span>Bus Booking</span>
                </a>
                <a href="/train-booking" className="flex items-center gap-1 text-surface-600 hover:text-primary transition-colors">
                  <TrainIcon className="w-4 h-4" />
                  <span>Train Booking</span>
                </a>
                <button 
                  onClick={authMethods.logout} 
                  className="text-surface-600 hover:text-primary transition-colors"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex gap-4 items-center">
                <a href="/login" className="text-surface-600 hover:text-primary transition-colors">Login</a>
                <a href="/signup" className="text-surface-600 hover:text-primary transition-colors">Sign up</a>
              </div>
            )}
            
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors"
              aria-label="Toggle dark mode"
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? 'dark' : 'light'}
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? (
                    <SunIcon className="w-5 h-5 text-yellow-400" />
                  ) : (
                    <MoonIcon className="w-5 h-5 text-surface-600" />
                  )}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>
        </header>

        <main className="flex-1">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              <Route path="/callback" element={<Callback />} />
              <Route path="/error" element={<ErrorPage />} />
              <Route path="/" element={isAuthenticated ? <Home /> : <Login />} />
              <Route path="/bus-booking" element={isAuthenticated ? <BusBooking /> : <Login />} />
              <Route path="/train-booking" element={isAuthenticated ? <TrainBooking /> : <Login />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AnimatePresence>
        </main>

        <footer className="py-6 px-6 bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700">
          <div className="container-custom text-center text-surface-500 dark:text-surface-400 text-sm">
            © {new Date().getFullYear()} BookSmart. All rights reserved.
          </div>
        </footer>

        <ToastContainer
          position="bottom-right"
          autoClose={4000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme={darkMode ? "dark" : "light"}
          toastClassName="rounded-lg shadow-lg"
        />
      </div>
    </AuthContext.Provider>
  );
}

export default App;