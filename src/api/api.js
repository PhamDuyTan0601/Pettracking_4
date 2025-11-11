import axios from "axios";

const API_URL = "https://pettracking2.onrender.com";

// Helper để gửi token
const getAuthHeader = () => {
  const token = localStorage.getItem("token");
  if (!token) throw new Error("No authentication token found!");
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
};

// USER APIs
export const registerUser = (userData) =>
  axios.post(`${API_URL}/api/users/register`, userData);

export const loginUser = async (userData) => {
  const response = await axios.post(`${API_URL}/api/users/login`, userData);
  if (response.data.token) {
    localStorage.setItem("token", response.data.token);
    localStorage.setItem("user", JSON.stringify(response.data.user));
  }
  return response;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

// PET APIs
export const getPetsByUser = async () =>
  axios.get(`${API_URL}/api/pets/my-pets`, getAuthHeader());

export const addPet = async (petData) =>
  axios.post(`${API_URL}/api/pets`, petData, getAuthHeader());

export const getPetById = async (petId) =>
  axios.get(`${API_URL}/api/pets/${petId}`, getAuthHeader());

export const deletePet = async (petId) =>
  axios.delete(`${API_URL}/api/pets/${petId}`, getAuthHeader());

// PET DATA APIs
export const getLatestPetData = async (petId) =>
  axios.get(`${API_URL}/api/petData/pet/${petId}/latest`, getAuthHeader());

export const getAllPetData = async (petId) =>
  axios.get(`${API_URL}/api/petData/pet/${petId}`, getAuthHeader());

// DEVICE APIs
export const registerDevice = async (deviceId, petId) =>
  axios.post(
    `${API_URL}/api/devices/register`,
    { deviceId, petId },
    getAuthHeader()
  );

export const getMyDevices = async () =>
  axios.get(`${API_URL}/api/devices/my-devices`, getAuthHeader());

// Axios interceptor
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      logoutUser();
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
