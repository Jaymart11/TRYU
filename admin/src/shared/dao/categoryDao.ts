import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createCategory,
  deleteCategory,
  fetchCategory,
  fetchSingleCategory,
  updateCategory,
} from "../service/categoryService";
import { ICategory } from "../interface/ICategory";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/ROUTES";

export const useFetchCategory = () => {
  return useQuery<ICategory[]>("category", fetchCategory);
};

export const useFetchSingleCategory = (categoryId: string) => {
  return useQuery<ICategory>(
    ["single_category", categoryId],
    () => fetchSingleCategory(categoryId),
    { enabled: !!categoryId }
  );
};

export const useCreateCategory = () => {
  const navigate = useNavigate();

  const createCategoryMutation = useMutation<
    Pick<ICategory, "name">,
    Error,
    Pick<ICategory, "name">
  >(
    (newCategoryData: Pick<ICategory, "name">) =>
      createCategory(newCategoryData),
    {
      onSuccess: () => {
        navigate(ROUTES.CATEGORY.LIST);
      },
    }
  );

  return createCategoryMutation;
};

export const useUpdateCategory = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateCategoryMutation = useMutation<ICategory, Error, ICategory>(
    (newCategoryData: ICategory) => updateCategory(newCategoryData),
    {
      onSuccess: () => {
        queryClient.invalidateQueries("category");
        navigate(ROUTES.CATEGORY.LIST);
      },
    }
  );

  return updateCategoryMutation;
};

export const useDeleteCategory = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteCategory(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("category");
    },
  });
};
