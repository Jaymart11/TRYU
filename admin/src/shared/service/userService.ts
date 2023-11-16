import { ENDPOINTS } from "../constants/ENDPOINTS";
import axios from "axios";
import { IUser } from "../interface/IUser";

const BASE_URL = "https://testonly-1217.onrender.com/";

const api = axios.create({
  baseURL: BASE_URL,
});

export const fetchUser = async () => {
  const response = await api.get(ENDPOINTS.USER.SHOW);
  return response.data;
};

export const fetchSingleUser = async (id: string) => {
  const response = await api.get(`${ENDPOINTS.USER.SHOW}/${id}`);
  return response.data;
};

export const createUser = async (
  newUserData: Omit<IUser, "_id">
): Promise<Omit<IUser, "_id">> => {
  try {
    const response = await api.post<Omit<IUser, "_id">>(
      ENDPOINTS.USER.CREATE,
      newUserData
    );
    return response.data;
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};

export const userLogin = async (
  userData: Pick<IUser, "username" | "password">
) => {
  const response = await api.get(`${ENDPOINTS.USER.LOGIN}`, {
    params: userData,
  });
  return response.data;
};

export const updateUser = async (updateUserData: IUser): Promise<IUser> => {
  try {
    const response = await api.put<IUser>(
      `${ENDPOINTS.USER.UPDATE}/${updateUserData._id}`,
      { ...updateUserData }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating user:", error);
    throw error;
  }
};

export const deleteUser = async (id: string) => {
  try {
    const response = await api.delete(`${ENDPOINTS.USER.DELETE}/${id}`);
    return response.data;
  } catch (error) {
    throw new Error("Failed to delete user");
  }
};
