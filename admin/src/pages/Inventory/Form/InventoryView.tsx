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
  Typography,
} from "@mui/material";
import { IProductCreate } from "../../../shared/interface/IProduct";
import {
  useCreateProduct,
  useFetchSingleProduct,
  useUpdateProduct,
} from "../../../shared/dao/productsDao";
import { useFetchCategory } from "../../../shared/dao/categoryDao";
import { ROUTES } from "../../../shared/constants/ROUTES";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useFetchBox } from "../../../shared/dao/boxDao";
import { IUser } from "../../../shared/interface/IUser";

interface FormValues {
  name: string;
  code: string;
  category: string | null;
  box?: string;
  quantity?: number;
  price: number;
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
    // width: "100%",
  },
  submitButton: {
    marginTop: "1rem",
    marginRight: "1rem",
  },
};

const validationSchema = Yup.object({
  name: Yup.string().required(),
  code: Yup.string().required(),
  category: Yup.string().required(),
  box: Yup.string().required(),
  price: Yup.number(),
  combo: Yup.array(Yup.string()),
});

const InventoryView = () => {
  const createProductMutation = useCreateProduct();
  const updateProductMutation = useUpdateProduct();
  const location = useLocation();

  const userJson = localStorage.getItem("user");
  const user: IUser = userJson ? JSON.parse(userJson) : null;

  const ID = location.state?.id;

  const isEdit = !!ID;

  const { data: singleProduct, refetch } = useFetchSingleProduct(ID);

  const handleCreateProduct = async (value: IProductCreate) => {
    try {
      // Call the mutation function to create the product
      if (isEdit) {
        const val = { _id: ID, ...value };
        if (user?.role === "Manager") {
          await updateProductMutation.mutateAsync(val);
        } else {
          await updateProductMutation.mutateAsync({
            ...val,
            quantity:
              singleProduct?.quantity !== undefined &&
              val?.quantity !== undefined
                ? singleProduct?.quantity + val.quantity
                : 0,
          });
        }
      } else {
        await createProductMutation.mutateAsync(value);
      }

      // Clear form after successful creation
    } catch (error) {
      console.error("Error creating product:", error);
    }
  };

  const initialValues: FormValues = {
    name: "",
    code: "",
    box: "",
    category: null,
    quantity: undefined,
    price: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleCreateProduct(values);
    },
  });

  useEffect(() => {
    if (singleProduct && isEdit) {
      refetch();
      formik.setValues({
        name: singleProduct.name,
        code: singleProduct.code,
        category: singleProduct.category,
        quantity: user?.role === "Manager" ? singleProduct.quantity : 0,
        price: singleProduct.price,
        box: singleProduct?.box,
      });
    }

    //eslint-disable-next-line
  }, [singleProduct]);

  const { data } = useFetchCategory();
  const { data: BoxData } = useFetchBox();

  const navigate = useNavigate();

  return (
    <Box sx={futuristicStyles.formContainer}>
      <form onSubmit={formik.handleSubmit}>
        {user?.role === "Manager" && (
          <>
            <FormControl
              fullWidth
              variant="outlined"
              error={formik.touched.category && Boolean(formik.errors.category)}
              sx={futuristicStyles.formControl}
            >
              <InputLabel>Category</InputLabel>
              <Select
                id="category"
                name="category"
                value={formik.values.category || ""}
                onChange={formik.handleChange}
                label="Select Category"
              >
                {data?.map((category) => (
                  <MenuItem key={category._id} value={category._id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Code"
              variant="outlined"
              fullWidth
              id="code"
              name="code"
              value={formik.values.code}
              onChange={formik.handleChange}
              error={formik.touched.code && Boolean(formik.errors.code)}
              helperText={formik.touched.code && formik.errors.code}
              sx={futuristicStyles.formControl}
            />
            <TextField
              label="Product"
              variant="outlined"
              fullWidth
              id="name"
              name="name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
              sx={futuristicStyles.formControl}
            />
            <FormControl
              fullWidth
              variant="outlined"
              error={formik.touched.box && Boolean(formik.errors.box)}
              sx={futuristicStyles.formControl}
            >
              <InputLabel>Box/Packaging</InputLabel>
              <Select
                id="box"
                name="box"
                value={formik.values.box || ""}
                onChange={formik.handleChange}
                label="Select Box/Packaging"
              >
                {BoxData?.map((box) => (
                  <MenuItem key={box._id} value={box._id}>
                    {box.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>{" "}
          </>
        )}
        {user?.role === "Cashier" && (
          <Box sx={{ marginBottom: "20px", width: "100%" }}>
            <Typography variant="body1" sx={{ marginBottom: "20px" }}>
              <b>Product:</b> {formik.values.name}
            </Typography>
            <Typography variant="body1">
              <b>Current Quantity:</b> {singleProduct?.quantity}
            </Typography>
          </Box>
        )}

        <TextField
          label="Quantity"
          variant="outlined"
          fullWidth
          id="quantity"
          name="quantity"
          value={formik.values.quantity || ""}
          onChange={formik.handleChange}
          error={formik.touched.quantity && Boolean(formik.errors.quantity)}
          helperText={formik.touched.quantity && formik.errors.quantity}
          type="number"
          sx={futuristicStyles.formControl}
        />

        {user?.role === "Manager" && (
          <TextField
            label="Price"
            variant="outlined"
            fullWidth
            id="price"
            name="price"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
            helperText={formik.touched.price && formik.errors.price}
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
            onClick={() => navigate(ROUTES.PRODUCT.LIST)}
            sx={futuristicStyles.submitButton}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default InventoryView;
