import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import { useNavigate, useOutletContext } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Alert,
  Box,
  FormHelperText,
  LinearProgress,
  Snackbar,
  Stack,
  createTheme,
} from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import {
  addEmailPassInfoApiAction,
  addEmailPassInfoInStateAction,
  resetEmailPassInfoLoadingBackToIdle,
} from "../../store/State/signup/emailPassInfoSlice";
import { ThemeProvider } from "@emotion/react";
import { LOADING_ENUMS } from "../../enums/enums";

const CreateEmailPassword = () => {
  const { handleStepperMovement } = useOutletContext();
  const dispatch = useDispatch();
  const {
    loading,
    data,
    error: stateError,
    requestStatus,
  } = useSelector((state) => state.emailPasswordInfoState);
  const navigate = useNavigate();
  const [snackbarOpen, setSnackbarOpen] = React.useState(false);
  const [formInfo, setFormInfo] = React.useState({
    email: "",
    password: "",
  });
  const [isError, setIsError] = React.useState(false);
  const [error, setError] = React.useState({
    emailError: "",
    passwordError: "",
    confirmPasswordError: "",
  });
  const theme = createTheme({
    palette: {},
  });

  React.useEffect(() => {
    return () => {
      dispatch(resetEmailPassInfoLoadingBackToIdle());
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
    if (infoObj?.password !== infoObj?.confirmPassword) {
      setIsError(true);
      setError((prevErr) => {
        return { ...prevErr, confirmPasswordError: "Password does not match" };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, confirmPasswordError: "" };
      });
    }
    return true;
  };

  const handleChange = (e) => {
    if (e.target.name === "email") {
      setError({ ...error, emailError: "" });
    }
    if (e.target.name === "confirmPassword") {
      setError({ ...error, confirmPasswordError: "" });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const filledDataObj = {
      email: data.get("email"),
      password: data.get("password"),
      confirmPassword: data.get("confirmPassword"),
    };
    console.log("submit called-", filledDataObj);
    const isValid = formValidation(filledDataObj);
    if (isValid) {
      setFormInfo((prevInfo) => {
        return {
          ...prevInfo,
          email: data.get("email"),
          password: data.get("password"),
        };
      });
      dispatch(
        addEmailPassInfoInStateAction({
          email: filledDataObj.email,
          password: filledDataObj.password,
        })
      );
      dispatch(
        addEmailPassInfoApiAction({
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
      setSnackbarOpen(true);
      const timer = setTimeout(() => {
        navigate("/");
        return () => clearTimeout(timer);
      }, 2000);
    }
  }, [loading]);

  console.log("formInfo--", formInfo, "formError-", error);
  console.log("DATA IN REDUX STORE_", data);
  return (
    <ThemeProvider theme={theme}>
      <Box>
        <Stack sx={{ width: "70%", margin: " 30px auto" }}>
          {loading === LOADING_ENUMS.LOAD_FAILED && (
            <Alert severity="error">{stateError}</Alert>
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
                <TextField
                  required
                  fullWidth
                  name="confirmPassword"
                  label="Confirm Password"
                  type="password"
                  id="confirmPassword"
                  onChange={handleChange}
                />
                {error.confirmPasswordError && (
                  <FormHelperText error={true}>
                    {error.confirmPasswordError}
                  </FormHelperText>
                )}
              </Grid>
            </Grid>
            <Box display={"flex"} justifyContent={"space-between"} mt={10}>
              <Button
                width="100px"
                onClick={() => {
                  navigate("/signup/companyInfo");
                  handleStepperMovement(1);
                }}
              >
                <ArrowBackIosIcon fontSize="large" />
              </Button>

              <Button type="submit" width="100px" variant="contained">
                Register
              </Button>
            </Box>
          </Box>
        </Stack>
      </Box>
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
  );
};

export default CreateEmailPassword;
