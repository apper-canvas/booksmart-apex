/**
 * Appointment Service - Handles all data operations for the appointment1 table
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
const TABLE_NAME = 'appointment1';

/**
 * Fetch all appointments with optional filtering
 * @param {Object} filters - Optional filtering parameters
 * @returns {Promise} - Promise resolving to appointments array
 */
export const fetchAppointments = async (filters = {}) => {
  try {
    const client = getClient();
    
    // Build query parameters
    const params = {
      Fields: [
        { Field: { Name: "Id" } },
        { Field: { Name: "Name" } },
        { Field: { Name: "email" } },
        { Field: { Name: "phone" } },
        { Field: { Name: "service" } },
        { Field: { Name: "date" } },
        { Field: { Name: "time" } },
        { Field: { Name: "notes" } },
        { Field: { Name: "status" } },
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
    console.error("Error fetching appointments:", error);
    throw error;
  }
};

/**
 * Create a new appointment
 * @param {Object} appointmentData - The appointment data to create
 * @returns {Promise} - Promise resolving to the created appointment
 */
export const createAppointment = async (appointmentData) => {
  try {
    const client = getClient();
    
    // Map UI data to database fields
    const params = {
      records: [{
        Name: appointmentData.name,
        email: appointmentData.email,
        phone: appointmentData.phone || "",
        service: appointmentData.service,
        date: appointmentData.date,
        time: appointmentData.time,
        notes: appointmentData.notes || "",
        status: "confirmed"
      }]
    };
    
    const response = await client.createRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to create appointment");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

/**
 * Update an existing appointment
 * @param {Number} id - The appointment ID to update
 * @param {Object} appointmentData - The updated appointment data
 * @returns {Promise} - Promise resolving to the updated appointment
 */
export const updateAppointment = async (id, appointmentData) => {
  try {
    const client = getClient();
    
    // Map UI data to database fields
    const params = {
      records: [{
        Id: id,
        ...appointmentData
      }]
    };
    
    const response = await client.updateRecord(TABLE_NAME, params);
    
    if (!response || !response.success || !response.results || response.results.length === 0) {
      throw new Error("Failed to update appointment");
    }
    
    return response.results[0].data;
  } catch (error) {
    console.error("Error updating appointment:", error);
    throw error;
  }
};

/**
 * Delete an appointment by ID
 * @param {Number} id - The appointment ID to delete
 * @returns {Promise} - Promise resolving to success status
 */
export const deleteAppointment = async (id) => {
  try {
    const client = getClient();
    const response = await client.deleteRecord(TABLE_NAME, { RecordIds: [id] });
    return response && response.success;
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};