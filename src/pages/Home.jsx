import { useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import MainFeature from '../components/MainFeature';
import getIcon from '../utils/iconUtils';

// Declare icons at the top
const CalendarIcon = getIcon('Calendar');
const CheckCircleIcon = getIcon('CheckCircle');
const BellIcon = getIcon('Bell');
const ClockIcon = getIcon('Clock');

function Home() {
  const [showWelcome, setShowWelcome] = useState(true);

  const dismissWelcome = () => {
    setShowWelcome(false);
    toast.success("Welcome to BookSmart! Let's get started.");
  };

  return (
    <div className="container-custom py-8">
      {/* Welcome banner */}
      {showWelcome && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-gradient-to-r from-primary to-secondary text-white p-6 rounded-2xl shadow-soft"
        >
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold mb-2">Welcome to BookSmart!</h2>
              <p className="text-white/90 max-w-2xl">
                Your all-in-one appointment booking and management solution. Start by creating 
                your first service or time slot to begin accepting bookings.
              </p>
            </div>
            <button 
              onClick={dismissWelcome}
              className="px-4 py-2 bg-white text-primary font-medium rounded-lg hover:bg-opacity-90 transition-all"
            >
              Get Started
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Feature */}
      <MainFeature />
      
      {/* Benefits Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="mt-16"
      >
        <h3 className="text-xl md:text-2xl font-bold mb-8 text-center">Why Use BookSmart?</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Benefit 1 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card p-6 flex flex-col items-center text-center"
          >
            <div className="bg-primary/10 dark:bg-primary/20 p-3 rounded-full mb-4">
              <CalendarIcon className="w-6 h-6 text-primary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Smart Scheduling</h4>
            <p className="text-surface-600 dark:text-surface-400">
              Intelligent calendar system that prevents double bookings and optimizes your availability.
            </p>
          </motion.div>
          
          {/* Benefit 2 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card p-6 flex flex-col items-center text-center"
          >
            <div className="bg-secondary/10 dark:bg-secondary/20 p-3 rounded-full mb-4">
              <BellIcon className="w-6 h-6 text-secondary" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Automated Reminders</h4>
            <p className="text-surface-600 dark:text-surface-400">
              Reduce no-shows with automatic notifications for upcoming appointments.
            </p>
          </motion.div>
          
          {/* Benefit 3 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card p-6 flex flex-col items-center text-center"
          >
            <div className="bg-accent/10 dark:bg-accent/20 p-3 rounded-full mb-4">
              <ClockIcon className="w-6 h-6 text-accent" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Time-Saving Tools</h4>
            <p className="text-surface-600 dark:text-surface-400">
              Streamline your booking workflow and save hours on administrative tasks.
            </p>
          </motion.div>
          
          {/* Benefit 4 */}
          <motion.div 
            whileHover={{ y: -5 }}
            className="card p-6 flex flex-col items-center text-center"
          >
            <div className="bg-green-500/10 dark:bg-green-500/20 p-3 rounded-full mb-4">
              <CheckCircleIcon className="w-6 h-6 text-green-500" />
            </div>
            <h4 className="text-lg font-semibold mb-2">Client Satisfaction</h4>
            <p className="text-surface-600 dark:text-surface-400">
              Provide a seamless booking experience that will delight your clients.
            </p>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

export default Home;