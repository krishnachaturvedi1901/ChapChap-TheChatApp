import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  LinearProgress,
  MenuItem,
  Select,
  Snackbar,
  Stack,
  TextField,
} from "@mui/material";
import React, { useEffect, useLayoutEffect, useState } from "react";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useDispatch, useSelector } from "react-redux";
import {
  addPersonalInfoApiAction,
  addPersonalInfoInStateAction,
  resetLoadingBackToIdle,
} from "../../store/State/signup/personalInfoSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import { getFromSessionStorage } from "../../utils/editSessionStorage";
import { LOADING_ENUMS, SESSION_ENUMS } from "../../enums/enums";
import { jwtDataDecoder } from "../../utils/jwtDataDecoder";

const PersonalDetails = () => {
  const { handleStepperMovement } = useOutletContext();
  const dispatch = useDispatch();
  const {
    loading,
    data,
    error: stateError,
    requestStatus,
    isDataAvailable,
  } = useSelector((state) => state.personalInfoState);
  const navigate = useNavigate();
  const [formInfo, setFormInfo] = useState(
    data || {
      name: "",
      age: "",
      gender: "",
    }
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({
    nameError: "",
    genderError: "",
    ageError: "",
  });

  useEffect(() => {
    const personalInfoToken = getFromSessionStorage(
      SESSION_ENUMS.SIGNUPSESSIONKEY
    );
    if (personalInfoToken) {
      const data = jwtDataDecoder(personalInfoToken);
      console.log("DATA FROM TOKEN ALREADY__", data);
    }
    return () => {
      dispatch(resetLoadingBackToIdle());
    };
  }, []);

  const formValidation = () => {
    if (formInfo.age < 18 || formInfo.age > 100) {
      setIsError(true);
      setError((prevErr) => {
        return { ...prevErr, ageError: "Age must be between 18-100" };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, ageError: "" };
      });
    }
    if (formInfo?.name?.replace(/\s+/g, " ").length < 2) {
      setIsError(true);
      setError((prevErr) => {
        return {
          ...prevErr,
          nameError:
            "This is a required field and must contain atleast 2 character",
        };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, nameError: "" };
      });
    }
    if (formInfo?.gender?.length === 0) {
      setIsError(true);
      setError((prevErr) => {
        return { ...prevErr, genderError: "This is a required field" };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, genderError: "" };
      });
    }
    return true;
  };

  const handleChange = (e) => {
    setIsError(false);
    const { name, value } = e.target;
    if (name === "age") {
      setError((prevErr) => {
        return { ...prevErr, ageError: "" };
      });
      setFormInfo((prevInfo) => {
        return { ...prevInfo, [name]: Math.round(value) };
      });
    } else if (name === "name") {
      setError((prevErr) => {
        return { ...prevErr, nameError: "" };
      });
      setFormInfo((prevInfo) => {
        const trimName = value.replace(/\s+/g, " ");
        return { ...prevInfo, [name]: value };
      });
    }
  };

  const handleGenderChange = (e) => {
    const { name, value } = e.target;
    setError((prevErr) => {
      return { ...prevErr, genderError: "" };
    });
    setFormInfo((prevInfo) => {
      return { ...prevInfo, [name]: value };
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const isValid = formValidation();

    console.log("Hnadle form submit called");
    if (isValid) {
      dispatch(addPersonalInfoInStateAction(formInfo));
      dispatch(addPersonalInfoApiAction(formInfo));
    } else {
      setIsError(true);
    }
  };

  const handleSnackbarClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (loading === LOADING_ENUMS.LOAD_SUCCEDED) {
      setSnackbarOpen(true);
    }
  }, [loading]);

  console.log("formInfo--", formInfo);
  console.log("PersonalInfo state in UI-", data);

  return (
    <Box>
      <form onSubmit={handleFormSubmit}>
        <Stack sx={{ width: "70%", margin: " 30px auto" }}>
          {loading === LOADING_ENUMS.LOAD_FAILED && (
            <Alert severity="error">{stateError}</Alert>
          )}
          {isError && (
            <FormHelperText error={true}>Invalid fields *</FormHelperText>
          )}
          {loading === LOADING_ENUMS.LOAD_PENDING && <LinearProgress />}
          <FormControl>
            <TextField
              label="Name"
              name="name"
              value={formInfo.name}
              onChange={handleChange}
              required
              margin="normal"
            />
            {error.nameError && (
              <FormHelperText error>{error.nameError}</FormHelperText>
            )}
            <TextField
              label="Age"
              name="age"
              type="number"
              value={formInfo.age || ""}
              onChange={handleChange}
              required
              margin="normal"
              error={error?.ageError?.length > 0}
            />
            {error.ageError && (
              <FormHelperText error={true}>{error.ageError}</FormHelperText>
            )}
          </FormControl>

          <FormControl sx={{ mt: "15px" }}>
            <InputLabel id="demo-simple-select-label">Gender</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Gender"
              name="gender"
              value={formInfo.gender}
              onChange={handleGenderChange}
              required
            >
              <MenuItem value={"male"}>Male</MenuItem>
              <MenuItem value={"female"}>Female</MenuItem>
            </Select>
            {error.genderError && (
              <FormHelperText>{error.genderError}</FormHelperText>
            )}
          </FormControl>
          <Box display={"flex"} justifyContent={"flex-end"} mt={10}>
            <Button type="submit" width="100px" onClick={() => {}}>
              Save
            </Button>
            {(loading === LOADING_ENUMS.LOAD_SUCCEDED ||
              (loading === LOADING_ENUMS.LOAD_IDEL && isDataAvailable)) && (
              <Button
                // disabled={!loading === LOADING_ENUMS.LOAD_SUCCEDED}
                width="100px"
                onClick={() => {
                  navigate("/signup/companyInfo");
                  handleStepperMovement(1);
                }}
              >
                <ArrowForwardIosIcon fontSize="large" />
              </Button>
            )}
          </Box>
        </Stack>
      </form>
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
    </Box>
  );
};

export default PersonalDetails;
