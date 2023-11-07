import {
  Button,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import * as Yup from "yup";
import { ROUTES } from "../../../shared/constants/ROUTES";
import {
  useCreateUser,
  useFetchSingleUser,
  useUpdateUser,
} from "../../../shared/dao/userDao";
import { IUser } from "../../../shared/interface/IUser";

interface FormValues {
  firstName: string;
  lastName: string;
  username: string;
  password: string;
  role: "Manager" | "Cashier";
}

const validationSchema = Yup.object({
  firstName: Yup.string().required(),
  lastName: Yup.string().required(),
  username: Yup.string().required(),
  password: Yup.string().required(),
  role: Yup.string().required(),
});

const UserView = () => {
  const createUserMutation = useCreateUser();
  const updateUserMutation = useUpdateUser();
  const location = useLocation();

  const ID = location.state?.id;

  const isEdit = !!ID;

  const { data: singleUser, refetch } = useFetchSingleUser(ID);

  const handleCreateUser = async (value: Omit<IUser, "_id">) => {
    try {
      // Call the mutation function to create the User
      if (isEdit) {
        const val = { _id: ID, ...value };
        await updateUserMutation.mutateAsync(val);
      } else {
        await createUserMutation.mutateAsync(value);
      }

      // Clear form after successful creation
    } catch (error) {
      console.error("Error creating User:", error);
    }
  };

  const initialValues: FormValues = {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    role: "Manager",
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: (values) => {
      handleCreateUser(values);
    },
  });

  useEffect(() => {
    if (singleUser && isEdit) {
      refetch();
      formik.setValues({
        firstName: singleUser.firstName,
        lastName: singleUser.lastName,
        username: singleUser.username,
        password: singleUser.password,
        role: singleUser.role,
      });
    }

    //eslint-disable-next-line
  }, [singleUser]);

  const navigate = useNavigate();

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "48vh",
      }}
    >
      <Grid container rowSpacing={2} direction="column" width="50vw">
        <Grid item>
          <TextField
            label="First Name"
            variant="outlined"
            fullWidth
            id="firstName"
            name="firstName"
            value={formik.values.firstName}
            onChange={formik.handleChange}
            error={formik.touched.firstName && Boolean(formik.errors.firstName)}
            helperText={formik.touched.firstName && formik.errors.firstName}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Last Name"
            variant="outlined"
            fullWidth
            id="lastName"
            name="lastName"
            value={formik.values.lastName}
            onChange={formik.handleChange}
            error={formik.touched.lastName && Boolean(formik.errors.lastName)}
            helperText={formik.touched.lastName && formik.errors.lastName}
          />
        </Grid>
        <Grid item>
          <TextField
            label="User Name"
            variant="outlined"
            fullWidth
            id="username"
            name="username"
            value={formik.values.username}
            onChange={formik.handleChange}
            error={formik.touched.username && Boolean(formik.errors.username)}
            helperText={formik.touched.username && formik.errors.username}
          />
        </Grid>
        <Grid item>
          <TextField
            label="Password"
            variant="outlined"
            fullWidth
            id="password"
            name="password"
            value={formik.values.password}
            onChange={formik.handleChange}
            error={formik.touched.password && Boolean(formik.errors.password)}
            helperText={formik.touched.password && formik.errors.password}
          />
        </Grid>
        <Grid item>
          <FormControl
            fullWidth
            variant="outlined"
            error={formik.touched.role && Boolean(formik.errors.role)}
          >
            <InputLabel>Role</InputLabel>
            <Select
              id="role"
              name="role"
              value={formik.values.role || ""}
              onChange={formik.handleChange}
              label="Select Role"
            >
              <MenuItem value={"Manager"}>Manager</MenuItem>
              <MenuItem value={"Cashier"}>Cashier</MenuItem>
            </Select>
          </FormControl>
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
              color="primary"
              variant="outlined"
              type="submit"
              onClick={() => navigate(ROUTES.USER.LIST)}
            >
              Cancel
            </Button>
          </div>
        </Grid>
      </Grid>
    </form>
  );
};

export default UserView;
