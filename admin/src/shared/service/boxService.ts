import { ENDPOINTS } from "../constants/ENDPOINTS";
import axios from "axios";
import { IBox } from "../interface/IBox";

const BASE_URL = "https://testonly-1217.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchBox = async () => {
  const response = await api.get(ENDPOINTS.BOX.SHOW);
  return response.data;
};

export const fetchSingleBox = async (id: string) => {
  const response = await api.get(`${ENDPOINTS.BOX.SHOW}/${id}`);
  return response.data;
};

export const createBox = async (
  newBoxData: Omit<IBox, "_id">
): Promise<Omit<IBox, "_id">> => {
  try {
    const response = await api.post<Omit<IBox, "_id">>(
      ENDPOINTS.BOX.CREATE,
      newBoxData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating box:", error);
    throw error;
  }
};

export const updateBox = async (updateBoxData: IBox): Promise<IBox> => {
  try {
    const response = await api.put<IBox>(
      `${ENDPOINTS.BOX.UPDATE}/${updateBoxData._id}`,
      { ...updateBoxData }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating box:", error);
    throw error;
  }
};

export const deleteBox = async (id: string) => {
  try {
    const response = await api.delete(`${ENDPOINTS.BOX.DELETE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete box");
  }
};
