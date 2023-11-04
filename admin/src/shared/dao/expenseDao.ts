import { useMutation, useQuery, useQueryClient } from "react-query";
import {
  createExpense,
  deleteExpense,
  fetchExpense,
  fetchSingleExpense,
  updateExpense,
} from "../service/expenseService";
import {
  IFetchExpense,
  ICreateExpense,
  IUpdateExpense,
  IExpense,
} from "../interface/IExpense";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../constants/ROUTES";

export const useFetchExpense = (page = 1) => {
  return useQuery<IFetchExpense>("expense", () => fetchExpense(page));
};

export const useFetchSingleExpense = (expenseId: string) => {
  return useQuery<IExpense>(
    ["single_expense", expenseId],
    () => fetchSingleExpense(expenseId),
    {
      enabled: !!expenseId,
    }
  );
};

export const useCreateExpense = () => {
  const navigate = useNavigate();

  const createExpenseMutation = useMutation<
    ICreateExpense,
    Error,
    ICreateExpense
  >((newExpenseData: ICreateExpense) => createExpense(newExpenseData), {
    onSuccess: () => {
      navigate(ROUTES.EXPENSE.LIST);
    },
  });

  return createExpenseMutation;
};

export const useUpdateExpense = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const updateExpenseMutation = useMutation<
    IUpdateExpense,
    Error,
    IUpdateExpense
  >((newExpenseData: IUpdateExpense) => updateExpense(newExpenseData), {
    onSuccess: () => {
      queryClient.invalidateQueries("expense");
      navigate(ROUTES.EXPENSE.LIST);
    },
  });

  return updateExpenseMutation;
};

export const useDeleteExpense = () => {
  const queryClient = useQueryClient();

  return useMutation((id: string) => deleteExpense(id), {
    onSuccess: () => {
      queryClient.invalidateQueries("expense");
    },
  });
};
