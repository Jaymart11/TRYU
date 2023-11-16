import { ENDPOINTS } from "../constants/ENDPOINTS";
import axios from "axios";
import {
  ICreateExpense,
  IFetchExpense,
  IUpdateExpense,
} from "../interface/IExpense";

const BASE_URL = "https://testonly-1217.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchExpense = async (page: number): Promise<IFetchExpense> => {
  const response = await api.get(ENDPOINTS.EXPENSE.SHOW, { params: { page } });
  return response.data;
};

export const fetchSingleExpense = async (id: string) => {
  const response = await api.get(`${ENDPOINTS.EXPENSE.SHOW}/${id}`);
  return response.data;
};

export const createExpense = async (
  newExpenseData: ICreateExpense
): Promise<ICreateExpense> => {
  try {
    const response = await api.post<ICreateExpense>(
      ENDPOINTS.EXPENSE.CREATE,
      newExpenseData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
};

export const updateExpense = async (
  updateExpenseData: IUpdateExpense
): Promise<IUpdateExpense> => {
  try {
    const response = await api.put<IUpdateExpense>(
      `${ENDPOINTS.EXPENSE.UPDATE}/${updateExpenseData._id}`,
      { ...updateExpenseData }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
};

export const deleteExpense = async (id: string) => {
  try {
    const response = await api.delete(`${ENDPOINTS.EXPENSE.DELETE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete expense");
  }
};
