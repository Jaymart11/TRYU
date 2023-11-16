import { ENDPOINTS } from "../constants/ENDPOINTS";
import axios from "axios";
import { ICategory } from "../interface/ICategory";

const BASE_URL = "https://testonly-1217.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchCategory = async () => {
  const response = await api.get(ENDPOINTS.CATEGORY.SHOW);
  return response.data;
};

export const fetchSingleCategory = async (id: string) => {
  const response = await api.get(`${ENDPOINTS.CATEGORY.SHOW}/${id}`);
  return response.data;
};

export const createCategory = async (
  newCategoryData: Pick<ICategory, "name">
): Promise<Pick<ICategory, "name">> => {
  try {
    const response = await api.post<Pick<ICategory, "name">>(
      ENDPOINTS.CATEGORY.CREATE,
      newCategoryData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating category:", error);
    throw error;
  }
};

export const updateCategory = async (
  updateCategoryData: ICategory
): Promise<ICategory> => {
  try {
    const response = await api.put<ICategory>(
      `${ENDPOINTS.CATEGORY.UPDATE}/${updateCategoryData._id}`,
      { ...updateCategoryData }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating category:", error);
    throw error;
  }
};

export const deleteCategory = async (id: string) => {
  try {
    const response = await api.delete(`${ENDPOINTS.CATEGORY.DELETE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete product");
  }
};
