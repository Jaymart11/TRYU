import { useFormik } from "formik";
import * as Yup from "yup";
import {
  TextField,
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Box,
} from "@mui/material";
import {
  useCreateUser,
  useFetchSingleUser,
  useUpdateUser,
} from "../../../shared/dao/userDao";
import { ROUTES } from "../../../shared/constants/ROUTES";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { IUser } from "../../../shared/interface/IUser";

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
    <Box sx={futuristicStyles.formContainer}>
      <form onSubmit={formik.handleSubmit}>
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
          sx={futuristicStyles.formControl}
        />
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
          sx={futuristicStyles.formControl}
        />
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
          sx={futuristicStyles.formControl}
        />
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
          sx={futuristicStyles.formControl}
        />
        <FormControl
          fullWidth
          variant="outlined"
          error={formik.touched.role && Boolean(formik.errors.role)}
          sx={futuristicStyles.formControl}
        >
          <InputLabel>Box/Packaging</InputLabel>
          <Select
            id="box"
            name="box"
            value={formik.values.role || ""}
            onChange={formik.handleChange}
            label="Select Box/Packaging"
          >
            <MenuItem value={"Manager"}>Manager</MenuItem>
            <MenuItem value={"Cashier"}>Cashier</MenuItem>
          </Select>
        </FormControl>
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
            onClick={() => navigate(ROUTES.USER.LIST)}
            sx={futuristicStyles.submitButton}
          >
            Cancel
          </Button>
        </div>
      </form>
    </Box>
  );
};

export default UserView;
