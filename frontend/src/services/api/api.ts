import api from "@/helper/Axios"; // Importing the Axios instance for making API requests
import type { Ref } from "vue";
import { FormRuleService } from "../helper/FormRuleHelperService";

type Headers = {
  [key: string]: string | string[] | undefined;
};

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
  async request(
    method: string,
    url: string,
    params: object | null,
    data: object | null,
    loadingInstance: Ref<boolean> | null = null
  ) {
    try {
      const accessToken: string = FormRuleService.getCookie("accessToken");
      const headers: Headers = {};

      if (accessToken) {
        headers["Authorization"] = `Bearer ${accessToken}`;
      }

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
}

// Export the Api class to be used in other parts of the application
export default Api;
