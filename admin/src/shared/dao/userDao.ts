import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createUser,
  deleteUser,
  fetchUser,
  fetchSingleUser,
  updateUser,
} from "../service/userService";
import { IUser } from "../interface/IUser";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/ROUTES";

export const useFetchUser = () => {
  return useQuery<IUser[]>("user", fetchUser);
};

export const useFetchSingleUser = (userId: string) => {
  return useQuery<IUser>(
    ["single_user", userId],
    () => fetchSingleUser(userId),
    {
      enabled: !!userId,
    }
  );
};

export const useCreateUser = () => {
  const navigate = useNavigate();

  const createUserMutation = useMutation<
    Omit<IUser, "_id">,
    Error,
    Omit<IUser, "_id">
  >((newUserData: Omit<IUser, "_id">) => createUser(newUserData), {
    onSuccess: () => {
      navigate(ROUTES.USER.LIST);
    },
  });

  return createUserMutation;
};

export const useUpdateUser = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateUserMutation = useMutation<IUser, Error, IUser>(
    (newUserData: IUser) => updateUser(newUserData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("user");
        navigate(ROUTES.USER.LIST);
      },
    }
  );

  return updateUserMutation;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteUser(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("user");
    },
  });
};
