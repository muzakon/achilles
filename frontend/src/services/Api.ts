import api from "@/helper/Axios"; // Importing the Axios instance for making API requests
import type { Ref } from "vue";

/**
 * Api class is responsible for handling API requests related to image generation.
 * This class contains methods to interact with the backend for generating images based on a text prompt.
 */
class Api {
  changeLoadingStatus(loadingInstance: Ref<boolean> | null = null) {
    if (loadingInstance !== null) {
      loadingInstance.value = !loadingInstance.value;
    }
  }
  async generateRequest(
    method: string,
    url: string,
    params: object | null,
    data: object | null,
    loadingInstance: Ref<boolean> | null = null
  ) {
    try {
      const headers = {
        Authorization: `Bearer test`,
      };

      this.changeLoadingStatus(loadingInstance);
      const response = await api.request({
        method,
        url,
        headers,
        params,
        data,
      });

      return response.data;
    } catch {
      return null;
    } finally {
      this.changeLoadingStatus(loadingInstance);
    }
  }
  
  static async generateImageByPrompt(prompt: string) {
    try {
      // Create the data object to be sent in the POST request
      const data = {
        prompt: prompt, // The user-provided text prompt for generating the image
      };

      // Make the API request to generate the image
      const response = await api.post("/images/generate", data);

      // Return the response data containing the generated image details
      return response.data;
    } catch (error) {
      // Return the error object in case of failure
      return error;
    }
  }
}

// Export the Api class to be used in other parts of the application
export default Api;
