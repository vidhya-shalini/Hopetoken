import axios from "axios";

const API_URL = "http://localhost:4000/api";

export const getOrphanages = async () => {
  try {
    const response = await axios.get(`${API_URL}/orphanages`);
    return response.data;
  } catch (error) {
    console.error("Error fetching orphanages:", error);
    return [];
  }
};
