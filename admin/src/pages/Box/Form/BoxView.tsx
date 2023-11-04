import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Box, Typography } from "@mui/material";
import {
  useCreateBox,
  useFetchSingleBox,
  useUpdateBox,
} from "../../../shared/dao/boxDao";
import { ROUTES } from "../../../shared/constants/ROUTES";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { IBox } from "../../../shared/interface/IBox";
import { IUser } from "../../../shared/interface/IUser";

interface FormValues {
  name: string;
  quantity: number;
}

const validationSchema = Yup.object({
  name: Yup.string().required(),
});

const userJson = localStorage.getItem("user");
const user: IUser = userJson ? JSON.parse(userJson) : null;

const BoxView = () => {
  const createBoxMutation = useCreateBox();
  const updateBoxMutation = useUpdateBox();
  const location = useLocation();

  const ID = location.state?.id;

  const isEdit = !!ID;

  const { data: singleBox, refetch } = useFetchSingleBox(ID);

  const handleCreateBox = async (value: Omit<IBox, "_id">) => {
    try {
      // Call the mutation function to create the Box
      if (isEdit) {
        const val = { _id: ID, ...value };
        if (user?.role === "Manager") {
          await updateBoxMutation.mutateAsync(val);
        } else {
          await updateBoxMutation.mutateAsync({
            ...val,
            quantity:
              singleBox?.quantity !== undefined && val?.quantity !== undefined
                ? singleBox?.quantity + val.quantity
                : 0,
          });
        }
      } else {
        await createBoxMutation.mutateAsync(value);
      }

      // Clear form after successful creation
    } catch (error) {
      console.error("Error creating Box:", error);
    }
  };

  const initialValues: FormValues = {
    name: "",
    quantity: 0,
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleCreateBox(values);
    },
  });

  useEffect(() => {
    if (singleBox && isEdit) {
      refetch();
      formik.setValues({
        name: singleBox.name,
        quantity: user?.role === "Manager" ? singleBox.quantity : 0,
      });
    }

    //eslint-disable-next-line
  }, [singleBox]);

  const navigate = useNavigate();

  return (
    <form onSubmit={formik.handleSubmit}>
      {user?.role === "Manager" ? (
        <TextField
          label="Packaging Name"
          variant="outlined"
          fullWidth
          id="name"
          name="name"
          value={formik.values.name}
          onChange={formik.handleChange}
          error={formik.touched.name && Boolean(formik.errors.name)}
          helperText={formik.touched.name && formik.errors.name}
        />
      ) : (
        <Box sx={{ marginBottom: "20px", width: "100%" }}>
          <Typography variant="body1" sx={{ marginBottom: "20px" }}>
            <b>Packaging Name:</b> {formik.values.name}
          </Typography>
          <Typography variant="body1">
            <b>Current Quantity:</b> {singleBox?.quantity}
          </Typography>
        </Box>
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
      />
      <div>
        <Button color="primary" variant="contained" type="submit">
          {isEdit ? "Update" : "Submit"}
        </Button>
        <Button
          color="primary"
          variant="outlined"
          type="submit"
          onClick={() => navigate(ROUTES.BOX.LIST)}
        >
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default BoxView;
