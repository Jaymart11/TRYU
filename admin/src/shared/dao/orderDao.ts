import { useMutation } from "react-query";
import { createOrder } from "../service/orderService";
import { IOrder } from "../interface/IOrder";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/ROUTES";

export const useCreateOrder = () => {
  const navigate = useNavigate();

  const createOrderMutation = useMutation<IOrder, Error, IOrder>(
    (newOrderData: IOrder) => createOrder(newOrderData),
    {
      onSuccess: () => {
        navigate(ROUTES.PRODUCT.LIST);
      },
    }
  );

  return createOrderMutation;
};
