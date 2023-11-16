import { ENDPOINTS } from "../constants/ENDPOINTS";
import axios from "axios";

const BASE_URL = "https://testonly-1217.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

export const downloadReports = async () => {
  const response = await api.get(ENDPOINTS.REPORT.EXPORT, {
    responseType: "blob",
  });
  return response.data;
};
