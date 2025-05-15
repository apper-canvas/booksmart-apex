import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { motion, AnimatePresence } from 'framer-motion';
import getIcon from './utils/iconUtils';

// Pages
import BusBooking from './pages/BusBooking';
import Home from './pages/Home';
import NotFound from './pages/NotFound';

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' ||
    window.matchMedia('(prefers-color-scheme: dark)').matches
  );

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

  // Pre-declare icon components
  const MoonIcon = getIcon('Moon');
  const SunIcon = getIcon('Sun');
  const BusIcon = getIcon('Bus');

  return (
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
          
          <div className="hidden md:flex gap-6 items-center">
            <a href="/" className="text-surface-600 hover:text-primary transition-colors">Home</a>
            <a href="/bus-booking" className="flex items-center gap-1 text-surface-600 hover:text-primary transition-colors">
              <BusIcon className="w-4 h-4" />
              <span>Bus Booking</span>
            </a>
          </div>
          
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
            <Route path="/" element={<Home />} />
            <Route path="/bus-booking" element={<BusBooking />} />
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
  );
}

export default App;