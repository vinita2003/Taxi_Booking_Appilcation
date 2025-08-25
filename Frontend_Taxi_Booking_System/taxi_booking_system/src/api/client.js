import axios from "axios";

let accessToken = null;
export const setAccessToken = (token) => {
    console.log("Setting access token:", token);
  accessToken = token;
  console.log("Access token set:", accessToken);
}   
export const getAccessToken = () => {
  return accessToken;
}
 const api = axios.create({
    baseURL: 'http://localhost:3000',
    withCredentials: true,
 });

 api.interceptors.request.use((config) => {
    console.log(accessToken);
    const token = getAccessToken();
    if(token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
 });

 let isRefreshing = false;
 let queue = [];

 api.interceptors.response.use(
    response => {
        return response;
    },
    async error => {
        const originalRequest = error.config;
        if (error.response.status === 401 && !originalRequest._retry) {
            if (!isRefreshing) {
                isRefreshing = true;
                try {
                    const response = await axios.get('http://localhost:3000/rider/auth/refresh', { withCredentials: true });
                    console.log("Refreshing token:", response.data.accessToken);
                    setAccessToken(response.data.accessToken);
                    queue.forEach(callback => callback(response.data.accessToken));
                    queue = [];
                } catch (refreshError) {
                    queue.forEach(callback => callback(null));
                    queue = [];
                    return Promise.reject(refreshError);
                } finally {
                    isRefreshing = false;
                }
            }
            return new Promise((resolve, reject) => {
                queue.push((token) => {
                    if (token) {
                        originalRequest.headers.Authorization = `Bearer ${token}`;
                        resolve(api(originalRequest));
                    } else {
                        reject(error);
                    }
                });
            });
        }
        return Promise.reject(error);
    }
    );

    export default api;