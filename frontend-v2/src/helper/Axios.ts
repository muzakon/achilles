import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`, // Change this to your API base URL
  timeout: 20000, // Set a timeout value if needed
});

// Set up a response interceptor to catch errors
api.interceptors.response.use(
  (response) => {
    // If the response is successful, just return it
    return response;
  },
  (error) => {
    // Check if the error response is a 400
    if (error.response && error.response.status === 400) {
      console.error("Error 400: Bad Request", error.response.data);
    }

    // You can add more specific error handling based on other status codes if necessary
    if (error.response && error.response.status === 500) {
      console.error("Error 500: Server Error", error.response.data);
    }

    // If no error response, just log the error
    if (!error.response) {
      console.error("Network Error:", error.message);
    }

    // You can return the error so the promise chain can handle it (optional)
    return Promise.reject(error);
  }
);

export default api;
