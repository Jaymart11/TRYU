import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  Grid,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ROUTES } from "../../../shared/constants/ROUTES";
import { useFetchBox } from "../../../shared/dao/boxDao";
import { useFetchCategory } from "../../../shared/dao/categoryDao";
import {
  useCreateProduct,
  useFetchProducts,
  useFetchSingleProduct,
  useUpdateProduct,
} from "../../../shared/dao/productsDao";
import { IProductCreate } from "../../../shared/interface/IProduct";
import { IUser } from "../../../shared/interface/IUser";
import DeleteIcon from "@mui/icons-material/Delete";

interface FormValues {
  name: string;
  code: string;
  category: string | null;
  box?: string;
  quantity?: number;
  price: number;
  combo: string[];
}

const validationSchema = Yup.object({
  name: Yup.string().required().label("Product Name"),
  code: Yup.string().required().label("Code"),
  category: Yup.string().required().label("Category"),
  box: Yup.string().required().label("Packaging"),
  price: Yup.number().label("Price"),
  combo: Yup.array().of(Yup.string().required("Product is required")),
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
    combo: [],
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
        combo: [],
      });
    }

    //eslint-disable-next-line
  }, [singleProduct]);

  const { data } = useFetchCategory();
  const { data: BoxData } = useFetchBox();

  const navigate = useNavigate();

  const handleAddItem = () => {
    formik.setValues({
      ...formik.values,
      box: undefined,
      combo: [...formik.values.combo, ""],
    });
  };

  const handleDeleteItem = (index: number) => {
    const newItems = [...formik.values.combo];
    newItems.splice(index, 1);
    formik.setValues({ ...formik.values, combo: newItems });
  };

  const { data: productData } = useFetchProducts();

  const productDatas = productData
    ? productData.flatMap((data) => {
        return data.product.map((product) => ({
          name: product.name,
          _id: product._id,
        }));
      })
    : [];

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        justifyContent: "center",
        marginTop: "100px",
      }}
    >
      <Grid container rowSpacing={2} direction="column" width="50vw">
        {user?.role === "Manager" && (
          <>
            <Grid item>
              <FormControl
                fullWidth
                variant="outlined"
                error={
                  formik.touched.category && Boolean(formik.errors.category)
                }
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
            </Grid>
            <Grid item>
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
              />
            </Grid>
            <Grid item>
              <TextField
                label="Product Name"
                variant="outlined"
                fullWidth
                id="name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
              />
            </Grid>
            {formik.values.combo.length === 0 && (
              <Grid item>
                <FormControl
                  fullWidth
                  variant="outlined"
                  error={formik.touched.box && Boolean(formik.errors.box)}
                >
                  <InputLabel>Packaging</InputLabel>
                  <Select
                    id="box"
                    name="box"
                    value={formik.values.box || ""}
                    onChange={formik.handleChange}
                    label="Select Box/Packaging"
                  >
                    <MenuItem value={""}>Empty</MenuItem>
                    {BoxData?.map((box) => (
                      <MenuItem key={box._id} value={box._id}>
                        {box.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormHelperText sx={{ color: "#f44336" }}>
                  {formik.touched.combo && formik.errors.box}
                </FormHelperText>
              </Grid>
            )}
            {formik.values.combo.map((_, idx) => (
              <Grid item>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <FormControl
                    fullWidth
                    variant="outlined"
                    error={
                      formik.touched?.combo && formik.errors?.combo
                        ? Boolean(formik.errors?.combo[idx])
                        : false
                    }
                  >
                    <InputLabel>Product</InputLabel>
                    <Select
                      id="{`combo[${idx}]`}"
                      name={`combo[${idx}]`}
                      value={formik.values.combo[idx] || ""}
                      onChange={formik.handleChange}
                      label="Select Product"
                    >
                      {productDatas?.map((prod) => (
                        <MenuItem key={prod._id} value={prod._id}>
                          {prod.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <IconButton
                    aria-label="delete"
                    onClick={() => handleDeleteItem(idx)}
                  >
                    <DeleteIcon color="error" sx={{ cursor: "pointer" }} />
                  </IconButton>
                </div>
                <FormHelperText sx={{ color: "#f44336" }}>
                  {formik.touched.combo && formik.errors.combo
                    ? formik.errors.combo[idx]
                    : ""}
                </FormHelperText>
              </Grid>
            ))}
            {!formik.values.box && (
              <>
                <Grid item>
                  <FormControlLabel
                    sx={{ color: "white" }}
                    control={<Checkbox />}
                    label="With Drinks"
                  />
                </Grid>
                <Grid item>
                  <Button
                    variant="outlined"
                    color="success"
                    onClick={handleAddItem}
                  >
                    Add Product
                  </Button>
                </Grid>
              </>
            )}
          </>
        )}
        {user?.role === "Cashier" && (
          <Grid
            container
            spacing={2}
            direction="column"
            sx={{ color: "white" }}
          >
            <Grid item>
              <Typography variant="h6">
                <b style={{ color: "#fffb00b0" }}>Product:</b>{" "}
                {formik.values.name}
              </Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">
                <b style={{ color: "#fffb00b0" }}>Current Quantity:</b>{" "}
                {singleProduct?.quantity}
              </Typography>
            </Grid>
          </Grid>
        )}
        <Grid item>
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
          />
        </Grid>

        {user?.role === "Manager" && (
          <Grid item>
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
            />
          </Grid>
        )}
        <Grid item>
          <div>
            <Button
              color="primary"
              variant="outlined"
              type="submit"
              sx={{ marginRight: "10px" }}
            >
              {isEdit ? "Update" : "Submit"}
            </Button>
            <Button
              color="error"
              variant="outlined"
              type="submit"
              onClick={() => navigate(ROUTES.PRODUCT.LIST)}
            >
              Cancel
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default InventoryView;
