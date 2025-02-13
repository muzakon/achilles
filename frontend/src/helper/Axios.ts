import axios from "axios";
import { push } from "notivue";

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
      push.error(error.response.data);
    } else if (error.response && error.response.status === 401) {
      Promise.reject(error);
    }

    // You can add more specific error handling based on other status codes if necessary
    else if (error.response && error.response.status === 500) {
      push.error(
        "An error occured when trying to perform your request. Please try again later."
      );
    }

    // If no error response, just log the error
    if (!error.response) {
      push.error("Network error occured. Please try again later.");
    }

    // You can return the error so the promise chain can handle it (optional)
    return Promise.reject(error);
  }
);

export default api;
