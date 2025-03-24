import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from "axios";
import React from "react"
// Define the structure of the token refresh response
interface RefreshTokenResponse {
  access: string;
}

// Create an Axios instance
const api: AxiosInstance = axios.create({
  baseURL: "http://localhost:8000/api/", // Base URL for the Django API
  withCredentials: true, // Ensures cookies are included in requests
});


export const getAuthenticatedUser = async (url:string) => {
  try {
    const response = await api.get(url);

    return response.data;

  } catch (err:any) {
    return null

  } 
}


// Function to refresh tokens periodically
export const startTokenRefreshInterval = (): void => {
  setInterval(async () => {
    try {
      const response: AxiosResponse<RefreshTokenResponse> = await axios.post(
        "http://localhost:8000/api/token/refresh/",
        {},
        { withCredentials: true }
      );
      console.log("Refresh token renewed:", response.data);
    } catch (error) {
      console.error("Failed to refresh tokens. Logging out...");
      logout();
    }
  }, 2 * 60 * 1000); // Refresh every 2 minutes
};

// Logout function
export const logout = async (): Promise<void> => {
  try {
    await api.post("/logout/");
    window.location.href = "/login"; // Redirect to login page
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// Axios interceptor for handling access token expiration
api.interceptors.response.use(
  (response: AxiosResponse) => response, // Pass through successful responses
  async (error: any) => {
    const originalRequest: AxiosRequestConfig & { _retry?: boolean } = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Prevent infinite retry loop

      try {
        const refreshResponse: AxiosResponse<RefreshTokenResponse> = await axios.post(
          "http://localhost:8000/api/token/refresh/",
          {},
          { withCredentials: true }
        );

        if (refreshResponse.data) {
          console.log("Access token refreshed successfully");
          return api(originalRequest); // Retry the original request
        }
      } catch (refreshError) {
        console.error("Failed to refresh access token:", refreshError);
        logout(); // Log out if refresh fails
      }
    }

    return Promise.reject(error); // Reject other errors
  }
);

export default api;



export const getData = async (
  url: string,
  setError: React.Dispatch<React.SetStateAction<string | null>>,
  setLoading: React.Dispatch<React.SetStateAction<boolean>>
) => {
  try {
    const response = await api.get(url);

    console.log(response);

    if(response.statusText!="OK") {
      throw new Error("Something went wrong fetching the data.")
    }
    return response.data;

  } catch(err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }

}

