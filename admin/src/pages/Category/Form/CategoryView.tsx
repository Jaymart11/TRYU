import { useFormik } from "formik";
import * as Yup from "yup";
import { TextField, Button, Grid } from "@mui/material";
import {
  useCreateCategory,
  useFetchSingleCategory,
  useUpdateCategory,
} from "../../../shared/dao/categoryDao";
import { ROUTES } from "../../../shared/constants/ROUTES";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { ICategory } from "../../../shared/interface/ICategory";

interface FormValues {
  name: string;
}

const validationSchema = Yup.object({
  name: Yup.string().required(),
});

const CategoryView = () => {
  const createCategoryMutation = useCreateCategory();
  const updateCategoryMutation = useUpdateCategory();
  const location = useLocation();

  const ID = location.state?.id;

  const isEdit = !!ID;

  const { data: singleCategory, refetch } = useFetchSingleCategory(ID);

  const handleCreateCategory = async (value: Pick<ICategory, "name">) => {
    console.log(value);
    try {
      // Call the mutation function to create the Category
      if (isEdit) {
        const val = { _id: ID, ...value };
        await updateCategoryMutation.mutateAsync(val);
      } else {
        await createCategoryMutation.mutateAsync(value);
      }

      // Clear form after successful creation
    } catch (error) {
      console.error("Error creating Category:", error);
    }
  };

  const initialValues: FormValues = {
    name: "",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleCreateCategory(values);
    },
  });

  useEffect(() => {
    if (singleCategory && isEdit) {
      refetch();
      formik.setValues({
        name: singleCategory.name,
      });
    }

    //eslint-disable-next-line
  }, [singleCategory]);

  const navigate = useNavigate();

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "15vh",
      }}
    >
      <Grid container rowSpacing={2} direction="column" width="50vw">
        <Grid item>
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
          />
        </Grid>
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
              onClick={() => navigate(ROUTES.CATEGORY.LIST)}
            >
              Cancel
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default CategoryView;
