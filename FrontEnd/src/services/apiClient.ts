import axios from "axios"

export const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000/api"

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true, // cookies -> refresh token
})

/// Authorization: "Bearer asdkjasldkja"
export const setHeader = (accessToken: string) => {
  if (accessToken !== "") {
    apiClient.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`
  } else {
    delete apiClient.defaults.headers.common["Authorization"]
  }
}

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error?.response?.status === 403 && originalRequest && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const result = await apiClient.post("/auth/refresh-token")
        const newAccessToken = result.data.accessToken
        setHeader(newAccessToken)
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`
        return apiClient(originalRequest)
      } catch (refreshErr) {
        setHeader("")
      }
    }
    return Promise.reject(error)
  }
)

export default apiClient
