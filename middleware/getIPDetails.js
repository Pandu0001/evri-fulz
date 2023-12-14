const axios = require('axios');

const apiKey = 'U8WRu1l8V7iNATxtW3RE';
const apiUrl = `https://extreme-ip-lookup.com/json/?key=${apiKey}`;

async function getIPDetails(req) {
    try {
      // Make an API request to get IP information
      const response = await axios.get(`${apiUrl}`);
  
      // Extract and return the IP details from the response data
      return response.data;
    } catch (error) {
      // Handle any errors that might occur during the API request
      console.error('Error fetching IP details:', error.message);
      throw error;
    }
  }
  module.exports = getIPDetails