import { ENDPOINTS } from "../constants/ENDPOINTS";
import axios from "axios";
import { IOrder } from "../interface/IOrder";

const BASE_URL = "http://localhost:3000";

const api = axios.create({
  baseURL: BASE_URL,
});

export const createOrder = async (newOrderData: IOrder): Promise<IOrder> => {
  try {
    const response = await api.post<IOrder>(
      ENDPOINTS.ORDER.CREATE,
      newOrderData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating order:", error);
    throw error;
  }
};
