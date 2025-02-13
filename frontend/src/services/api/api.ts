import api from "@/helper/Axios"; // Importing the Axios instance for making API requests
import type { Ref } from "vue";
import { FormRuleService } from "../helper/FormRuleHelperService";
import { AxiosError } from "axios";

type Headers = {
  [key: string]: string | string[] | undefined;
};

/**
 * Api class is responsible for handling API requests related to image generation.
 * This class contains methods to interact with the backend for generating images based on a text prompt.
 */
class Api {
  private isRefreshing = false; // Flag to prevent multiple refresh token requests
  private refreshSubscribers: ((token: string) => void)[] = []; // Queue for requests waiting for token refresh

  changeLoadingStatus(loadingInstance: Ref<boolean> | null = null) {
    if (loadingInstance !== null) {
      loadingInstance.value = !loadingInstance.value;
    }
  }

  private async refreshAccessToken(): Promise<string | null> {
    try {
      const refreshToken = FormRuleService.getCookie("refreshToken");
      if (!refreshToken) {
        throw new Error("No refresh token available");
      }

      const response = await api.post("/user/refresh", {
        refreshToken,
      });

      const newAccessToken = response.data.accessToken;
      FormRuleService.setCookie("accessToken", newAccessToken);

      // Notify all subscribers that the new token is available
      this.refreshSubscribers.forEach((callback) => callback(newAccessToken));
      this.refreshSubscribers = []; // Clear the queue

      return newAccessToken;
    } catch (error) {
      console.error("Failed to refresh access token:", error);
      return null;
    } finally {
      this.isRefreshing = false; // Reset the refreshing flag
    }
  }

  async request(
    method: "GET" | "POST" | "PUT" | "DELETE" | "PATCH",
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
    } catch (error: unknown) {
      if (
        error instanceof AxiosError &&
        error.response &&
        error.response.status === 401
      ) {
        // Check if a token refresh is already in progress
        if (!this.isRefreshing) {
          this.isRefreshing = true; // Set the flag to true to prevent multiple refresh requests
          const newAccessToken = await this.refreshAccessToken();

          if (newAccessToken) {
            // Retry the original request with the new access token
            const headers: Headers = {
              Authorization: `Bearer ${newAccessToken}`,
            };

            const response = await api.request({
              method,
              url,
              headers,
              params,
              data,
            });

            return response.data;
          } else {
            // Handle the case where the refresh token also failed
            console.error(
              "Unable to refresh access token. Please log in again."
            );
            return null;
          }
        } else {
          // If a refresh is already in progress, queue this request to retry later
          return new Promise((resolve, reject) => {
            this.refreshSubscribers.push((newToken: string) => {
              const headers: Headers = {
                Authorization: `Bearer ${newToken}`,
              };

              api
                .request({
                  method,
                  url,
                  headers,
                  params,
                  data,
                })
                .then((response) => resolve(response.data))
                .catch((err) => reject(err));
            });
          });
        }
      } else {
        // Handle other errors
        console.error("API request failed:", error);
        return null;
      }
    } finally {
      this.changeLoadingStatus(loadingInstance);
    }
  }
}

// Export the Api class to be used in other parts of the application
export default Api;
