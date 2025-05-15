import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';
import getIcon from '../utils/iconUtils';
import { fetchTrainBookings, createTrainBooking, deleteTrainBooking } from '../services/trainBookingService';
import { useSelector } from 'react-redux';

const TrainBooking = () => {
  const [trainBookings, setTrainBookings] = useState([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    id: '',
    origin: '',
    destination: '',
    date: '',
    time: '',
    passengerName: '',
    passengerCount: 1,
    classType: 'economy',
    contactNumber: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Get user information from Redux store
  const { user } = useSelector((state) => state.user);

  // Icons
  const PlusIcon = getIcon('Plus');
  const MapPinIcon = getIcon('MapPin');
  const CalendarIcon = getIcon('Calendar');
  const UserIcon = getIcon('User');
  const LoaderIcon = getIcon('Loader2');
  const PhoneIcon = getIcon('Phone');
  const XIcon = getIcon('X');
  const TrainIcon = getIcon('Train');
  
  // Load bookings from database on component mount
  const loadTrainBookings = async () => {
    try {
      setIsLoading(true);
      const bookings = await fetchTrainBookings();
      
      // Map the API response to our component state format
      const formattedBookings = bookings.map(booking => ({
        id: booking.Id,
        origin: booking.origin,
        destination: booking.destination,
        date: booking.date,
        time: booking.time,
        passengerName: booking.passenger_name,
        passengerCount: booking.passenger_count,
        classType: booking.class_type,
        contactNumber: booking.contact_number,
        createdAt: booking.CreatedOn
      }));
      
      setTrainBookings(formattedBookings);
    } catch (error) {
      toast.error(`Error loading train bookings: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTrainBookings();
  }, []);
  

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleAddBooking = async (e) => {
    e.preventDefault();
    
    // Simple validation
    if (!formData.origin || !formData.destination || !formData.date || !formData.time || !formData.passengerName) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    try {
      setIsSubmitting(true);
      await createTrainBooking(formData);
      toast.success("Train booking added successfully!");
      setIsFormOpen(false);
      loadTrainBookings();
      
      // Reset form
      setFormData({
        id: '',
      origin: '',
        destination: '',
        date: '',
        time: '',
        passengerName: '',
        passengerCount: 1,
      contactNumber: ''
    });
      });
    } catch (error) {
      toast.error(`Failed to create booking: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
  };


      try {
        setIsLoading(true);
        await deleteTrainBooking(id);
        toast.success("Train booking cancelled successfully");
        loadTrainBookings();
      } catch (error) {
        toast.error(`Failed to cancel booking: ${error.message}`);
        setIsLoading(false);
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
          <TrainIcon className="w-6 h-6 text-primary" />
          Train Booking
        </h2>
        <button 
          onClick={() => setIsFormOpen(true)}
          className="btn btn-primary flex items-center gap-1"
        >
          <PlusIcon className="w-4 h-4" />
          Add Train Booking
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
              <h3 className="text-xl font-bold">Add Train Booking</h3>
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
                  <label className="block text-sm mb-1">Class Type</label>
                  <select
                    name="classType"
                    value={formData.classType}
                    onChange={handleInputChange}
                    className="w-full"
                  >
                    <option value="economy">Economy</option>
                    <option value="business">Business</option>
                    <option value="first">First Class</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-sm mb-1">Contact Number</label>
                    min="1"
                    max="10"
                    step="1"
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
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2"><LoaderIcon className="w-4 h-4 animate-spin" /> Processing...</span>
                  ) : (
                    "Book Now"
                  )}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {trainBookings.length === 0 ? (
        isLoading ? <div className="card p-8 text-center"><LoaderIcon className="w-12 h-12 mx-auto text-primary animate-spin" /></div> :
        (<div className="card p-8 text-center">
          <TrainIcon className="w-12 h-12 mx-auto text-primary-light opacity-80 mb-4" />
          <h3 className="text-xl font-medium mb-2">No Train Bookings Yet</h3>
          <p className="text-surface-500 dark:text-surface-400 mb-6">Start by adding your first train booking</p>
          <button 
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary inline-flex items-center gap-1"
          >
            <PlusIcon className="w-4 h-4" />
            Add Train Booking
          </button>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {trainBookings.map(booking => (
            <div key={booking.id} className="card p-5 relative">
              <h3 className="text-lg font-semibold mb-4 flex justify-between">
                <span className="flex items-center gap-1">
                  <TrainIcon className="w-4 h-4 text-primary" />
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
                  <span className="text-surface-500 dark:text-surface-400">Class Type:</span>
                  <span className="font-medium capitalize">{booking.classType}</span>
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

export default TrainBooking;