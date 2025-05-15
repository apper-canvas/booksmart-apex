/**
 * Bus Booking Service - Handles all data operations for the bus_booking table
 */

// Initialize ApperClient
const getClient = () => {
  const { ApperClient } = window.ApperSDK;
  return new ApperClient({
    apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
    apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
  });
};

// Table name from the provided tables JSON
const TABLE_NAME = 'bus_booking';

/**
 * Fetch all bus bookings with optional filtering
 * @param {Object} filters - Optional filtering parameters
 * @returns {Promise} - Promise resolving to bus bookings array
 */
export const fetchBusBookings = async (filters = {}) => {
  try {
    const client = getClient();
    
    // Build query parameters
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "origin" } },
        { Field: { Name: "destination" } },
        { Field: { Name: "date" } },
        { Field: { Name: "time" } },
        { Field: { Name: "passenger_name" } },
        { Field: { Name: "passenger_count" } },
        { Field: { Name: "seat_type" } },
        { Field: { Name: "contact_number" } },
        { Field: { Name: "CreatedOn" } }
      ],
      pagingInfo: {
        limit: 100,
        offset: 0
      }
    };
    
    // Add where conditions if filters are provided
    if (Object.keys(filters).length > 0) {
      params.where = Object.entries(filters).map(([fieldName, value]) => ({
        fieldName,
        Operator: "ExactMatch",
        values: [value]
      }));
    }
    
    const response = await client.fetchRecords(TABLE_NAME, params);
    
    if (!response || !response.data) {
      return [];
    }
    
    return response.data;
  } catch (error) {
    console.error("Error fetching bus bookings:", error);
    throw error;
  }
};

/**
 * Create a new bus booking
 * @param {Object} bookingData - The booking data to create
 * @returns {Promise} - Promise resolving to the created booking
 */
export const createBusBooking = async (bookingData) => {
  try {
    const client = getClient();
    
    // Map UI data to database fields
    const params = {
      records: [{
        Name: `${bookingData.origin} to ${bookingData.destination}`,
        origin: bookingData.origin,
        destination: bookingData.destination,
        date: bookingData.date,
        time: bookingData.time,
        passenger_name: bookingData.passengerName,
        passenger_count: bookingData.passengerCount,
        seat_type: bookingData.seatType,
        contact_number: bookingData.contactNumber || ""
      }]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to create bus booking");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating bus booking:", error);
    throw error;
  }
};

/**
 * Update an existing bus booking
 * @param {Number} id - The booking ID to update
 * @param {Object} bookingData - The updated booking data
 * @returns {Promise} - Promise resolving to the updated booking
 */
export const updateBusBooking = async (id, bookingData) => {
  try {
    const client = getClient();
    
    // We'll only update the fields that are allowed to be updated
    const params = {
      records: [{
        Id: id,
        passenger_name: bookingData.passengerName,
        date: bookingData.date,
        time: bookingData.time
      }]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to update bus booking");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating bus booking:", error);
    throw error;
  }
};

/**
 * Delete a bus booking by ID
 * @param {Number} id - The booking ID to delete
 * @returns {Promise} - Promise resolving to success status
 */
export const deleteBusBooking = async (id) => {
  try {
    const client = getClient();
    const response = await client.deleteRecord(TABLE_NAME, { RecordIds: [id] });
    return response && response.success;
  } catch (error) {
    console.error("Error deleting bus booking:", error);
    throw error;
  }
};