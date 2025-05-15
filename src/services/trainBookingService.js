/**
 * Train Booking Service - Handles all data operations for the train_booking table
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
const TABLE_NAME = 'train_booking';

/**
 * Fetch all train bookings with optional filtering
 * @param {Object} filters - Optional filtering parameters
 * @returns {Promise} - Promise resolving to train bookings array
 */
export const fetchTrainBookings = async (filters = {}) => {
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
        { Field: { Name: "class_type" } },
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
    console.error("Error fetching train bookings:", error);
    throw error;
  }
};

/**
 * Create a new train booking
 * @param {Object} bookingData - The booking data to create
 * @returns {Promise} - Promise resolving to the created booking
 */
export const createTrainBooking = async (bookingData) => {
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
        class_type: bookingData.classType,
        contact_number: bookingData.contactNumber || ""
      }]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to create train booking");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating train booking:", error);
    throw error;
  }
};

/**
 * Update an existing train booking
 * @param {Number} id - The booking ID to update
 * @param {Object} bookingData - The updated booking data
 * @returns {Promise} - Promise resolving to the updated booking
 */
export const updateTrainBooking = async (id, bookingData) => {
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
      throw new Error("Failed to update train booking");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating train booking:", error);
    throw error;
  }
};

/**
 * Delete a train booking by ID
 * @param {Number} id - The booking ID to delete
 * @returns {Promise} - Promise resolving to success status
 */
export const deleteTrainBooking = async (id) => {
  try {
    const client = getClient();
    const response = await client.deleteRecord(TABLE_NAME, { RecordIds: [id] });
    return response && response.success;
  } catch (error) {
    console.error("Error deleting train booking:", error);
    throw error;
  }
};