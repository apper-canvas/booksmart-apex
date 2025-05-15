import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';

const BusBooking = () => {
  const [busBookings, setBusBookings] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    origin: '',
    destination: '',
    date: '',
    time: '',
    passengerName: '',
    passengerCount: 1,
    seatType: 'regular',
    contactNumber: ''
  });

  // Icons
  const PlusIcon = getIcon('Plus');
  const MapPinIcon = getIcon('MapPin');
  const CalendarIcon = getIcon('Calendar');
  const UserIcon = getIcon('User');
  const PhoneIcon = getIcon('Phone');
  const XIcon = getIcon('X');
  const BusIcon = getIcon('Bus');

  // Load bookings from localStorage on component mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('busBookings');
    if (savedBookings) {
      setBusBookings(JSON.parse(savedBookings));
    }
  }, []);

  // Save bookings to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('busBookings', JSON.stringify(busBookings));
  }, [busBookings]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddBooking = (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.origin || !formData.destination || !formData.date || !formData.time || !formData.passengerName) {
      toast.error('Please fill in all required fields');
      return;
    }

    const newBooking = {
      ...formData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString()
    };

    setBusBookings([...busBookings, newBooking]);
    toast.success('Bus booking added successfully!');
    setIsFormOpen(false);
    setFormData({
      id: '',
      origin: '',
      destination: '',
      date: '',
      time: '',
      passengerName: '',
      passengerCount: 1,
      seatType: 'regular',
      contactNumber: ''
    });
  };

  const handleCancelBooking = (id) => {
    if (window.confirm('Are you sure you want to cancel this booking?')) {
      setBusBookings(busBookings.filter(booking => booking.id !== id));
      toast.info('Bus booking cancelled');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container-custom py-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <BusIcon className="w-6 h-6 text-primary" />
          Bus Booking
        </h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />
          Add Bus Booking
        </button>
      </div>

      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full shadow-lg"
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Add Bus Booking</h3>
              <button 
                onClick={() => setIsFormOpen(false)}
                className="p-1 rounded-full hover:bg-surface-100 dark:hover:bg-surface-700"
              >
                <XIcon className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handleAddBooking} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Origin</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-2.5 w-4 h-4 text-surface-400" />
                    <input
                      type="text"
                      name="origin"
                      value={formData.origin}
                      onChange={handleInputChange}
                      className="pl-9 w-full"
                      placeholder="From"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Destination</label>
                  <div className="relative">
                    <MapPinIcon className="absolute left-3 top-2.5 w-4 h-4 text-surface-400" />
                    <input
                      type="text"
                      name="destination"
                      value={formData.destination}
                      onChange={handleInputChange}
                      className="pl-9 w-full"
                      placeholder="To"
                      required
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Date</label>
                  <div className="relative">
                    <CalendarIcon className="absolute left-3 top-2.5 w-4 h-4 text-surface-400" />
                    <input
                      type="date"
                      name="date"
                      value={formData.date}
                      onChange={handleInputChange}
                      className="pl-9 w-full"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm mb-1">Time</label>
                  <input
                    type="time"
                    name="time"
                    value={formData.time}
                    onChange={handleInputChange}
                    className="w-full"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Passenger Name</label>
                <div className="relative">
                  <UserIcon className="absolute left-3 top-2.5 w-4 h-4 text-surface-400" />
                  <input
                    type="text"
                    name="passengerName"
                    value={formData.passengerName}
                    onChange={handleInputChange}
                    className="pl-9 w-full"
                    placeholder="Enter passenger name"
                    required
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm mb-1">Passenger Count</label>
                  <input
                    type="number"
                    name="passengerCount"
                    value={formData.passengerCount}
                    onChange={handleInputChange}
                    className="w-full"
                    min="1"
                    max="10"
                  />
                </div>
                <div>
                  <label className="block text-sm mb-1">Seat Type</label>
                  <select
                    name="seatType"
                    value={formData.seatType}
                    onChange={handleInputChange}
                    className="w-full"
                  >
                    <option value="regular">Regular</option>
                    <option value="business">Business</option>
                    <option value="sleeper">Sleeper</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Contact Number</label>
                <div className="relative">
                  <PhoneIcon className="absolute left-3 top-2.5 w-4 h-4 text-surface-400" />
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleInputChange}
                    className="pl-9 w-full"
                    placeholder="Enter contact number"
                  />
                </div>
              </div>
              
              <div className="flex justify-end gap-2 mt-6">
                <button 
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="btn btn-outline"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="btn btn-primary"
                >
                  Book Now
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {busBookings.length === 0 ? (
        <div className="card p-8 text-center">
          <BusIcon className="w-12 h-12 mx-auto text-primary-light opacity-80 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Bus Bookings Yet</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Start by adding your first bus booking</p>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary inline-flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            Add Bus Booking
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {busBookings.map(booking => (
            <div key={booking.id} className="card p-5 relative">
              <h3 className="text-lg font-semibold mb-4 flex justify-between">
                <span className="flex items-center gap-1">
                  <BusIcon className="w-4 h-4 text-primary" />
                  {booking.origin} to {booking.destination}
                </span>
              </h3>
              
              <div className="space-y-3 text-sm mb-4">
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Date & Time:</span>
                  <span className="font-medium">{booking.date} at {booking.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Passenger:</span>
                  <span className="font-medium">{booking.passengerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Seat Type:</span>
                  <span className="font-medium capitalize">{booking.seatType}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-500 dark:text-surface-400">Passengers:</span>
                  <span className="font-medium">{booking.passengerCount}</span>
                </div>
                {booking.contactNumber && (
                  <div className="flex justify-between">
                    <span className="text-surface-500 dark:text-surface-400">Contact:</span>
                    <span className="font-medium">{booking.contactNumber}</span>
                  </div>
                )}
              </div>
              
              <div className="flex justify-end mt-4">
                <button 
                  onClick={() => handleCancelBooking(booking.id)}
                  className="btn btn-danger text-sm py-1 px-3"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default BusBooking;