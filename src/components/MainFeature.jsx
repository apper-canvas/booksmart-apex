import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { format, parseISO, addDays, isAfter, startOfToday } from 'date-fns';
import { fetchAppointments, createAppointment, deleteAppointment } from '../services/appointmentService';
import { useSelector } from 'react-redux';
import getIcon from '../utils/iconUtils';

// Declare icons at the top
const PlusIcon = getIcon('Plus');
const CalendarIcon = getIcon('Calendar');
const ClockIcon = getIcon('Clock');
const UserIcon = getIcon('User');
const CheckIcon = getIcon('Check');
const XIcon = getIcon('X');
const TrashIcon = getIcon('Trash');
const InfoIcon = getIcon('Info');
const RefreshCwIcon = getIcon('RefreshCw');
const LoaderIcon = getIcon('Loader2');

function MainFeature() {
  // State for the appointment form
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    service: '',
    date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
    time: '09:00',
    notes: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State for the list of appointments
  const [appointments, setAppointments] = useState([]);
  
  // Get user information from Redux store
  const { user } = useSelector((state) => state.user);
  
  // Load appointments from database
  const loadAppointments = async () => {
    try {
      setIsLoading(true);
      const data = await fetchAppointments();
      
      // Map the API response to our component state format
      const formattedAppointments = data.map(appointment => ({
        id: appointment.Id,
        name: appointment.Name,
        email: appointment.email,
        phone: appointment.phone,
        service: appointment.service,
        date: appointment.date,
        time: appointment.time,
        notes: appointment.notes,
        status: appointment.status,
        createdAt: appointment.CreatedOn
      }));
      
      setAppointments(formattedAppointments);
    } catch (error) {
      toast.error(`Error loading appointments: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  // List of available services
  const services = [
    { id: 'Initial Consultation', name: 'Initial Consultation', duration: 30 },
    { id: 'Haircut & Styling', name: 'Haircut & Styling', duration: 60 },
    { id: 'Massage Therapy', name: 'Massage Therapy', duration: 90 },
    { id: 'Facial Treatment', name: 'Facial Treatment', duration: 60 },
    { id: 'Coaching Session', name: 'Coaching Session', duration: 45 }
  ];
  
  // Available time slots
  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', '13:00', 
    '14:00', '15:00', '16:00', '17:00'
  ];
  
  // Load appointments on component mount
  useEffect(() => {
    loadAppointments();
  }, []);

  // Handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.name || !formData.email || !formData.service || !formData.date || !formData.time) {
      toast.error("Please fill in all required fields");
      return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    
    // Check for date in the past
    const selectedDate = parseISO(`${formData.date}T${formData.time}`);
    if (!isAfter(selectedDate, new Date())) {
      toast.error("Please select a future date and time");
      return;
    }
    
    // Check for time slot availability (no double booking)
    const isTimeSlotTaken = appointments.some(appointment => 
      appointment.date === formData.date && 
      appointment.time === formData.time
    );
    
    if (isTimeSlotTaken) {
      toast.error("This time slot is already booked. Please select another.");
      return;
    }
    try {
      setIsSubmitting(true);
      await createAppointment(formData);
      
      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        service: '',
        date: format(addDays(new Date(), 1), 'yyyy-MM-dd'),
        time: '09:00',
        notes: ''
      });
      
      setIsFormOpen(false);
      toast.success("Appointment booked successfully!");
      loadAppointments();
    } catch (error) {
      toast.error(`Failed to create appointment: ${error.message}`);
    } finally {
      setIsSubmitting(false);
    }
    toast.success("Appointment booked successfully!");
  };
  
  const handleCancelAppointment = async (id) => {
    try {
      await deleteAppointment(id);
        toast.success("Appointment cancelled successfully");
        loadAppointments();
      } catch (error) {
        toast.error(`Failed to cancel appointment: ${error.message}`);
      }
      }
  };
  // Formatting function for displaying dates
  const formatAppointmentDate = (dateString, timeString) => {
    try {
      const date = parseISO(`${dateString}T${timeString}`);
      return format(date, 'EEEE, MMMM d, yyyy - h:mm a');
    } catch (error) {
      return `${dateString} at ${timeString}`;
    }
  };
  
  // Function to get service duration by id
  const getServiceDuration = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.duration : 0;
  };
  
  // Function to get service name by id
  const getServiceName = (serviceId) => {
    const service = services.find(s => s.id === serviceId);
    return service ? service.name : 'Unknown Service';
  };
  
  // Reset all appointments (for demo purposes)
  const handleResetAll = () => {
    if (confirm("This will only clear your local view. Actual data will remain in database.")) {
      setAppointments([]);
      toast.info("Local view cleared");
    }
  };

  // Loading state display
  return (
    <div className="card overflow-visible">
      <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-surface-900 dark:text-white">
            Appointment Management
          </h2>
          <p className="text-surface-600 dark:text-surface-400 mt-1">
            Schedule, view, and manage your appointments
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setIsFormOpen(true)}
            className="btn btn-primary flex items-center gap-2"
          >
            <PlusIcon className="w-5 h-5" />
            <span>New Appointment</span>
          </button>
          
          {appointments.length > 0 && (
            <button
              onClick={handleResetAll}
              className="btn btn-outline flex items-center gap-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
            >
              <RefreshCwIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Appointment booking form */}
      <AnimatePresence>
        {isFormOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden border-b border-surface-200 dark:border-surface-700"
          >
            <form onSubmit={handleSubmit} className="p-6 bg-surface-50 dark:bg-surface-800/50">
              <h3 className="text-xl font-semibold mb-4">Book a New Appointment</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Client Information */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                      Full Name *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <UserIcon className="w-5 h-5 text-surface-400" />
                      </div>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full pl-10"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full"
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
                
                {/* Appointment Details */}
                <div className="space-y-4">
                  <div>
                    <label htmlFor="service" className="block text-sm font-medium mb-1">
                      Service *
                    </label>
                    <select
                      id="service"
                      name="service"
                      value={formData.service}
                      onChange={handleInputChange}
                      className="w-full"
                      required
                    >
                      <option value="">Select a service</option>
                      {services.map(service => (
                        <option key={service.id} value={service.id}>
                          {service.name} ({service.duration} min)
                        </option>
                      ))}
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="date" className="block text-sm font-medium mb-1">
                      Date *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <CalendarIcon className="w-5 h-5 text-surface-400" />
                      </div>
                      <input
                        type="date"
                        id="date"
                        name="date"
                        value={formData.date}
                        onChange={handleInputChange}
                        className="w-full pl-10"
                        min={format(startOfToday(), 'yyyy-MM-dd')}
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="time" className="block text-sm font-medium mb-1">
                      Time *
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <ClockIcon className="w-5 h-5 text-surface-400" />
                      </div>
                      <select
                        id="time"
                        name="time"
                        value={formData.time}
                        onChange={handleInputChange}
                        className="w-full pl-10"
                        required
                      >
                        {timeSlots.map(time => {
                          // Check if this time slot is already booked for the selected date
                          const isBooked = appointments.some(
                            app => app.date === formData.date && app.time === time
                          );
                          
                          return (
                            <option key={time} value={time} disabled={isBooked}>
                              {time} {isBooked ? '(Booked)' : ''}
                            </option>
                          );
                        })}
                      </select>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mb-6">
                <label htmlFor="notes" className="block text-sm font-medium mb-1">
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows="3"
                  className="w-full"
                  placeholder="Any special requests or information..."
                ></textarea>
              </div>
              
              <div className="flex justify-end gap-3">
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
                  {isSubmitting ? <span className="flex items-center gap-2"><LoaderIcon className="w-4 h-4 animate-spin" /> 
                  Processing...</span> : "Book Appointment"}
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Appointments list */}
      <div className="p-6">
        {appointments.length === 0 ? (
          isLoading ? <div className="text-center py-12"><LoaderIcon className="w-12 h-12 mx-auto text-primary animate-spin" /></div> :
          (<div className="text-center py-12">
            <div className="bg-surface-100 dark:bg-surface-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon className="w-8 h-8 text-surface-400" />
            </div>
            <h3 className="text-xl font-medium mb-2">No appointments yet</h3>
            <p className="text-surface-500 dark:text-surface-400 max-w-md mx-auto mb-6">
              Click the "New Appointment" button to schedule your first appointment.
            </p>
            <button
              onClick={() => setIsFormOpen(true)}
              className="btn btn-primary inline-flex items-center gap-2"
            >
              <PlusIcon className="w-5 h-5" />
              New Appointment
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold">
              Upcoming Appointments ({appointments.length})
            </h3>
            
            <div className="grid grid-cols-1 gap-4">
              {appointments
                .sort((a, b) => {
                  // Sort by date and time
                  const dateA = new Date(`${a.date}T${a.time}`);
                  const dateB = new Date(`${b.date}T${b.time}`);
                  return dateA - dateB;
                })
                .map(appointment => (
                  <motion.div
                    key={appointment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-surface-200 dark:border-surface-700 rounded-xl overflow-hidden hover:shadow-soft transition-all duration-300"
                  >
                    <div className="flex flex-col sm:flex-row">
                      {/* Time indicator */}
                      <div className="bg-primary/10 dark:bg-primary/20 px-6 py-4 sm:w-48 flex flex-row sm:flex-col items-center sm:items-start justify-between sm:justify-center gap-2">
                        <div className="text-center sm:text-left">
                          <div className="text-sm font-medium text-surface-500 dark:text-surface-400">
                            {format(parseISO(appointment.date), 'MMM d, yyyy')}
                          </div>
                          <div className="text-2xl font-bold text-primary">
                            {appointment.time}
                          </div>
                          <div className="text-sm text-surface-500 dark:text-surface-400">
                            {getServiceDuration(appointment.service)} min
                          </div>
                        </div>
                        <div className="sm:mt-3 px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs font-medium rounded-full flex items-center gap-1">
                          <CheckIcon className="w-3 h-3" />
                          Confirmed
                        </div>
                      </div>
                      
                      {/* Appointment details */}
                      <div className="flex-1 p-4 sm:p-6 flex flex-col sm:flex-row gap-4 justify-between">
                        <div>
                          <h4 className="font-semibold text-lg mb-1">{getServiceName(appointment.service)}</h4>
                          <div className="text-surface-600 dark:text-surface-400 text-sm mb-3">
                            {formatAppointmentDate(appointment.date, appointment.time)}
                          </div>
                          
                          <div className="flex flex-col gap-1">
                            <div className="text-sm">
                              <span className="font-medium">Client:</span> {appointment.name}
                            </div>
                            <div className="text-sm">
                              <span className="font-medium">Email:</span> {appointment.email}
                            </div>
                            {appointment.phone && (
                              <div className="text-sm">
                                <span className="font-medium">Phone:</span> {appointment.phone}
                              </div>
                            )}
                            {appointment.notes && (
                              <div className="mt-2 p-2 bg-surface-50 dark:bg-surface-800 rounded border border-surface-200 dark:border-surface-700 text-sm">
                                <span className="font-medium flex items-center gap-1 mb-1">
                                  <InfoIcon className="w-4 h-4" />
                                  Notes:
                                </span>
                                {appointment.notes}
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex sm:flex-col gap-2 justify-end">
                          <button
                            onClick={() => handleCancelAppointment(appointment.id)}
                            className="btn btn-outline text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                          >
                            <TrashIcon className="w-4 h-4" />
                            <span>Cancel</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default MainFeature;