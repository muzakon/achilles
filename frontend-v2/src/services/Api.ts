import api from "@/helper/Axios"; // Importing the Axios instance for making API requests

/**
 * Api class is responsible for handling API requests related to image generation.
 * This class contains methods to interact with the backend for generating images based on a text prompt.
 */
class Api {
  /**
   * Generates an image based on the given text prompt.
   *
   * @param prompt - The text prompt used to generate the image. This should be a string describing the image you want to create.
   *
   * @returns The API response data, which typically contains the generated image URL or other image details.
   *          In case of an error, the error object is returned.
   *
   * @throws Will throw an error if the API request fails or the response is not successful.
   */
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
