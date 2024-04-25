import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  FormHelperText,
  LinearProgress,
  Snackbar,
  Stack,
  Typography,
  createTheme,
} from "@mui/material";
import { ThemeProvider } from "@emotion/react";
import { loginUserReqAction } from "../../store/State/login/loginSlice";
import { LOADING_ENUMS } from "../../enums/enums";
import useAuth from "../../hooks/useAuth";
import { setAuthSessionDirectly } from "../../store/State/session/sessionSlice";

const Login = () => {
  const { auth, setAuth } = useAuth();
  const dispatch = useDispatch();
  const {
    loading,
    error: stateError,
    requestStatus,
    user,
  } = useSelector((state) => state.loginState);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [formInfo, setFormInfo] = React.useState({
    email: "",
    password: "",
  });
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState({
    emailError: "",
  });
  const theme = createTheme({
    palette: {},
  });
  React.useEffect(() => {
    return () => {
      // dispatch(resetEmailPassInfoLoadingBackToIdle());
    };
  }, []);
  const formValidation = (infoObj) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(infoObj?.email)) {
      setIsError(true);
      setError((prevErr) => {
        return { ...prevErr, emailError: "Enter a valid email" };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, emailError: "" };
      });
    }
    return true;
  };
  const handleChange = (e) => {
    if (e.target.name === "email") {
      setError({ ...error, emailError: "" });
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const filledDataObj = {
      email: data.get("email"),
      password: data.get("password"),
    };
    console.log("submit called-", filledDataObj);
    const isValid = formValidation(filledDataObj);
    if (isValid) {
      dispatch(
        loginUserReqAction({
          email: filledDataObj.email,
          password: filledDataObj.password,
        })
      );
    }
  };
  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };
  React.useEffect(() => {
    if (loading === LOADING_ENUMS.LOAD_SUCCEDED) {
      dispatch(setAuthSessionDirectly({ isAuthorize: true, user: user }));
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        navigate("/chat");
        return () => clearTimeout(timer);
      }, 2000);
    }
  }, [loading]);
  console.log("requsetStatus-inLogin-", requestStatus);
  return (
    <Box sx={{ padding: "15px" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", color: "slategray" }}
      >
        Login
      </Typography>
      <Box sx={{ width: "100%", my: "40px" }}>
        <ThemeProvider theme={theme}>
          <Stack sx={{ width: "50%", margin: " 30px auto" }}>
            {loading === LOADING_ENUMS.LOAD_FAILED && (
              <Alert severity="error">
                {stateError || "Error in login try again"}
              </Alert>
            )}
            {isError && (
              <FormHelperText error={true}>Invalid fields *</FormHelperText>
            )}
            {loading === LOADING_ENUMS.LOAD_PENDING && <LinearProgress />}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 3 }}>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                    error={error.emailError}
                    onChange={handleChange}
                  />
                  {error.emailError && (
                    <FormHelperText error={true}>
                      {error.emailError}
                    </FormHelperText>
                  )}
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <Button
                    disabled={loading === LOADING_ENUMS.LOAD_PENDING}
                    type="submit"
                    sx={{
                      cursor: "pointer",
                      textAlign: "center",
                      borderRadius: 2,
                      fontWeight: 600,
                      margin: "20px 0px",
                      width: "100%",
                      padding: "10px 20px",
                      boxShadow: "0 0 20px rgba(104, 85, 224, 0.2)",
                      transition: "0.4s",
                      color: "rgb(104, 85, 224)",
                      backgroundColor: "rgba(255, 255, 255, 1)",
                      border: "1px solid rgba(104, 85, 224, 1)",

                      "&:hover": {
                        color: "white",
                        boxShadow: "0 0 20px rgba(104, 85, 224, 0.6)",
                        backgroundColor: "rgba(104, 85, 224, 1)",
                      },
                    }}
                  >
                    Login
                  </Button>
                </Grid>
              </Grid>
            </Box>
          </Stack>
          <Snackbar
            open={snackbarOpen}
            autoHideDuration={6000}
            onClose={handleSnackbarClose}
          >
            <Alert
              onClose={handleSnackbarClose}
              severity="success"
              variant="filled"
              sx={{ width: "100%" }}
            >
              {requestStatus.message}
            </Alert>
          </Snackbar>
        </ThemeProvider>
      </Box>
    </Box>
  );
};

export default Login;
