import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createBox,
  deleteBox,
  fetchBox,
  fetchSingleBox,
  updateBox,
} from "../service/boxService";
import { IBox } from "../interface/IBox";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/ROUTES";

export const useFetchBox = () => {
  return useQuery<IBox[]>("box", fetchBox);
};

export const useFetchSingleBox = (boxId: string) => {
  return useQuery<IBox>(["single_box", boxId], () => fetchSingleBox(boxId), {
    enabled: !!boxId,
  });
};

export const useCreateBox = () => {
  const navigate = useNavigate();

  const createBoxMutation = useMutation<
    Omit<IBox, "_id">,
    Error,
    Omit<IBox, "_id">
  >((newBoxData: Omit<IBox, "_id">) => createBox(newBoxData), {
    onSuccess: () => {
      navigate(ROUTES.BOX.LIST);
    },
  });

  return createBoxMutation;
};

export const useUpdateBox = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateBoxMutation = useMutation<IBox, Error, IBox>(
    (newBoxData: IBox) => updateBox(newBoxData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("box");
        navigate(ROUTES.BOX.LIST);
      },
    }
  );

  return updateBoxMutation;
};

export const useDeleteBox = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteBox(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("box");
    },
  });
};
