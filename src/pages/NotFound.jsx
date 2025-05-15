import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import getIcon from '../utils/iconUtils';

// Declare icon components at the top
const AlertCircleIcon = getIcon('AlertCircle');
const HomeIcon = getIcon('Home');

function NotFound() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom min-h-[70vh] flex flex-col items-center justify-center text-center py-16"
    >
      <motion.div
        initial={{ scale: 0.8 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 300 }}
        className="bg-surface-100 dark:bg-surface-800 w-20 h-20 rounded-full flex items-center justify-center mb-6"
      >
        <AlertCircleIcon className="w-10 h-10 text-primary" />
      </motion.div>
      
      <h1 className="text-4xl font-bold mb-4">404 - Page Not Found</h1>
      
      <p className="text-surface-600 dark:text-surface-400 max-w-md mb-8">
        The page you are looking for might have been removed, had its name changed, 
        or is temporarily unavailable.
      </p>
      
      <Link 
        to="/" 
        className="btn btn-primary flex items-center gap-2"
      >
        <HomeIcon className="w-5 h-5" />
        Back to Home
      </Link>
    </motion.div>
  );
}

export default NotFound;