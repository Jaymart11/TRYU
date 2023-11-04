import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createProduct,
  fetchProducts,
  fetchSingleProducts,
  deleteProduct,
  updateProduct,
} from "../service/productsService";
import {
  IProduct,
  IProductCreate,
  IProductUpdate,
} from "../interface/IProduct";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/ROUTES";

export const useFetchProducts = (categoryID?: string) => {
  return useQuery<IProduct[]>(["products", categoryID], () =>
    fetchProducts(categoryID)
  );
};

export const useFetchSingleProduct = (productId: string) => {
  return useQuery<IProductCreate>(
    ["single_product", productId],
    () => fetchSingleProducts(productId),
    { enabled: !!productId }
  );
};

export const useCreateProduct = () => {
  const navigate = useNavigate();

  const createProductMutation = useMutation<
    IProductCreate,
    Error,
    IProductCreate
  >((newProductData: IProductCreate) => createProduct(newProductData), {
    onSuccess: () => {
      navigate(ROUTES.PRODUCT.LIST);
    },
  });

  return createProductMutation;
};

export const useUpdateProduct = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateProductMutation = useMutation<
    IProductUpdate,
    Error,
    IProductUpdate
  >((newProductData: IProductUpdate) => updateProduct(newProductData), {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
      navigate(ROUTES.PRODUCT.LIST);
    },
  });

  return updateProductMutation;
};

// export const useCreateTask = () => {
//   const queryClient = useQueryClient();

//   return useMutation((newTask) => createTask(newTask), {
//     onSuccess: () => {
//       queryClient.invalidateQueries('tasks');
//     },
//   });
// };

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteProduct(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("products");
    },
  });
};
