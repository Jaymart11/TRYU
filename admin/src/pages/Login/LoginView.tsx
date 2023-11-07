import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import {
  Alert,
  Avatar,
  Button,
  Container,
  Paper,
  Snackbar,
  TextField,
  Typography,
  styled,
} from "@mui/material";
import React, { useState } from "react";
import { userLogin } from "../../shared/service/userService";
import { useNavigate } from "react-router-dom";
import { ROUTES } from "../../shared/constants/ROUTES";

const StyledPaper = styled(Paper)(({ theme }) => ({
  marginTop: theme.spacing(8),
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  padding: theme.spacing(3),
}));

const StyledAvatar = styled(Avatar)(({ theme }) => ({
  backgroundColor: theme.palette.primary.main,
  margin: theme.spacing(1),
}));

const StyledForm = styled("form")(({ theme }) => ({
  width: "100%",
  marginTop: theme.spacing(2),
}));

const StyledSubmitButton = styled(Button)(({ theme }) => ({
  margin: theme.spacing(2, 0),
}));

const Login: React.FC = () => {
  const [username, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState<{
    status: number;
    message: string;
  }>();

  const navigate = useNavigate();

  const handleLogin = () => {
    userLogin({ username, password })
      .then((data) => {
        setMessage({ status: 200, message: data.message });
        localStorage.setItem("user", JSON.stringify(data.user));

        if (data?.user?.role.toLowerCase() === "manager") {
          navigate(ROUTES.PRODUCT.LIST);
        } else {
          navigate(ROUTES.TRANSACTION);
        }
      })
      .catch((err) => {
        console.log(err);
        setMessage({ status: 400, message: err.response.data.message });
      });
    setOpen(true);
  };

  const handleClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  return (
    <>
      <Container
        component="main"
        maxWidth="xs"
        sx={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <StyledPaper elevation={3}>
          <StyledAvatar>
            <LockOutlinedIcon />
          </StyledAvatar>
          <Typography variant="h5" align="center">
            Login
          </Typography>
          <StyledForm noValidate>
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Username"
              autoFocus
              value={username}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <StyledSubmitButton
              type="button"
              fullWidth
              variant="outlined"
              color="primary"
              onClick={handleLogin}
            >
              Sign In
            </StyledSubmitButton>
          </StyledForm>
        </StyledPaper>
      </Container>
      <Snackbar
        open={open}
        autoHideDuration={2000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          severity={message?.status === 200 ? "success" : "error"}
          sx={{ width: "100%" }}
        >
          {message?.message}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
