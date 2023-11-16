import { ENDPOINTS } from "../constants/ENDPOINTS";
import axios from "axios";
import { IProductCreate, IProductUpdate } from "../interface/IProduct";

const BASE_URL = "https://testonly-1217.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchProducts = async (categoryID?: string) => {
  let getURL = ENDPOINTS.PRODUCT.SHOW;
  if (categoryID) {
    getURL = ENDPOINTS.PRODUCT.SHOW + "?category_id=" + categoryID;
  } else {
    getURL = ENDPOINTS.PRODUCT.SHOW;
  }
  const response = await api.get(getURL);
  return response.data;
};

export const fetchSingleProducts = async (id: string) => {
  const response = await api.get(`${ENDPOINTS.PRODUCT.SHOW}/${id}`);
  return response.data;
};

export const createProduct = async (
  newProductData: IProductCreate
): Promise<IProductCreate> => {
  try {
    const response = await api.post<IProductCreate>(
      ENDPOINTS.PRODUCT.CREATE,
      newProductData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating product:", error);
    throw error;
  }
};

export const updateProduct = async (
  updateProductData: IProductUpdate
): Promise<IProductUpdate> => {
  try {
    const response = await api.put<IProductUpdate>(
      `${ENDPOINTS.PRODUCT.UPDATE}/${updateProductData._id}`,
      { ...updateProductData, _id: undefined }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating product:", error);
    throw error;
  }
};

export const deleteProduct = async (id: string) => {
  try {
    const response = await api.delete(`${ENDPOINTS.PRODUCT.DELETE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete product");
  }
};
