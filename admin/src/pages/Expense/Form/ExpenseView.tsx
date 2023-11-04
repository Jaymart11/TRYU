import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
} from "@mui/material";
import {
  useCreateExpense,
  useFetchSingleExpense,
  useUpdateExpense,
} from "../../../shared/dao/expenseDao";
import { ROUTES } from "../../../shared/constants/ROUTES";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ICreateExpense } from "../../../shared/interface/IExpense";
import { useFetchProducts } from "../../../shared/dao/productsDao";

interface FormValues {
  name?: string;
  product_id?: string;
  quantity: number;
  amount: number;
}

const futuristicStyles = {
  formContainer: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    borderRadius: "10px",
  },
  formControl: {
    marginBottom: "1rem",
    width: "100%",
  },
  submitButton: {
    marginTop: "1rem",
    marginRight: "1rem",
  },
};

const validationSchema = Yup.object().shape({
  name: Yup.string().test(
    "has-value",
    "Either Name or  is required",
    function (value) {
      const { product_id } = this.parent;
      return !!value || !!product_id;
    }
  ),
  product_id: Yup.string().test(
    "has-value",
    "Either name or product_id is required",
    function (value) {
      const { name } = this.parent;
      return !!value || !!name;
    }
  ),
  quantity: Yup.number().min(1).required().label("Quantity"),
});

const ExpenseView = () => {
  const createExpenseMutation = useCreateExpense();
  const updateExpenseMutation = useUpdateExpense();
  const location = useLocation();

  const ID = location.state?.id;

  const isEdit = !!ID;

  const { data: singleExpense, refetch } = useFetchSingleExpense(ID);

  const handleCreateExpense = async (value: ICreateExpense) => {
    try {
      // Call the mutation function to create the Expense
      if (isEdit) {
        const val = { _id: ID, ...value };
        await updateExpenseMutation.mutateAsync(val);
      } else {
        await createExpenseMutation.mutateAsync(value);
      }

      // Clear form after successful creation
    } catch (error) {
      console.error("Error creating Expense:", error);
    }
  };

  const initialValues: FormValues = {
    name: "",
    product_id: "",
    quantity: 0,
    amount: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleCreateExpense(values);
    },
  });

  useEffect(() => {
    if (singleExpense && isEdit) {
      refetch();
      formik.setValues({
        name: singleExpense?.name,
        quantity: singleExpense.quantity,
        product_id: singleExpense?.product_id?._id,
        amount: singleExpense?.amount,
      });
    }

    //eslint-disable-next-line
  }, [singleExpense]);

  const navigate = useNavigate();

  const { data: productData } = useFetchProducts();

  const productDatas = productData
    ? productData.flatMap((data) => {
        return data.product.map((product) => ({
          name: product.name,
          _id: product._id,
        }));
      })
    : [];

  productDatas.unshift({ name: "Empty", _id: "" });

  return (
    <Box sx={futuristicStyles.formContainer}>
      <form onSubmit={formik.handleSubmit}>
        {!formik?.values?.product_id && (
          <TextField
            label="Name"
            variant="outlined"
            fullWidth
            id="name"
            name="name"
            value={formik.values.name}
            onChange={formik.handleChange}
            error={formik.touched.name && Boolean(formik.errors.name)}
            helperText={formik.touched.name && formik.errors.name}
            sx={futuristicStyles.formControl}
            disabled={isEdit}
          />
        )}
        {!formik?.values?.name && (
          <FormControl
            fullWidth
            variant="outlined"
            error={
              formik.touched.product_id && Boolean(formik.errors.product_id)
            }
            sx={futuristicStyles.formControl}
          >
            <InputLabel>Product</InputLabel>
            <Select
              id="product_id"
              name="product_id"
              value={formik.values.product_id || ""}
              onChange={formik.handleChange}
              label="Select Product"
              disabled={isEdit}
            >
              {productDatas?.map((product) => (
                <MenuItem key={product._id} value={product._id}>
                  {product.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          id="quantity"
          name="quantity"
          value={formik.values.quantity}
          onChange={formik.handleChange}
          error={formik.touched.quantity && Boolean(formik.errors.quantity)}
          helperText={formik.touched.quantity && formik.errors.quantity}
          type="number"
          sx={futuristicStyles.formControl}
        />
        {!formik?.values?.product_id && (
          <TextField
            label="Amount"
            variant="outlined"
            fullWidth
            id="amount"
            name="amount"
            value={formik.values.amount}
            onChange={formik.handleChange}
            error={formik.touched.amount && Boolean(formik.errors.amount)}
            helperText={formik.touched.amount && formik.errors.amount}
            type="number"
            sx={futuristicStyles.formControl}
          />
        )}
        <div>
          <Button
            color="primary"
            variant="contained"
            type="submit"
            sx={futuristicStyles.submitButton}
          >
            {isEdit ? "Update" : "Submit"}
          </Button>
          <Button
            color="primary"
            variant="outlined"
            type="submit"
            onClick={() => navigate(ROUTES.EXPENSE.LIST)}
            sx={futuristicStyles.submitButton}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default ExpenseView;
