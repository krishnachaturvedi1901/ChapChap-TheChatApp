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
import { addPersonalInfoInStateAction } from "../../store/State/personalInfoSlice";
import { useNavigate, useOutletContext } from "react-router-dom";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { LocalizationProvider } from "@mui/x-date-pickers";
import dayjs from "dayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import {
  addCompanyInfoInStateAction,
  addcompanyInfoApiAction,
  resetCompanyInfoLoadingBackToIdle,
} from "../../store/State/companyInfoSlice";
import { LOADING_ENUMS, SESSION_ENUMS } from "../../enums/enums";
import { jwtDataDecoder } from "../../utils/jwtDataDecoder";
import { getFromSessionStorage } from "../../utils/editSessionStorage";

const CompanyDetails = () => {
  const { handleStepperMovement } = useOutletContext();
  const dispatch = useDispatch();
  const {
    loading,
    data,
    error: stateError,
    requestStatus,
    isDataAvailable,
  } = useSelector((state) => state.companyInfoState);
  const navigate = useNavigate();
  const [formInfo, setFormInfo] = useState(
    data || {
      companyName: "",
      experience: "",
      joinDate: "",
      endDate: "",
    }
  );
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [isError, setIsError] = useState(false);
  const [error, setError] = useState({
    companyNameError: "",
    experienceError: "",
    joinDateError: "",
    endDateError: "",
  });

  useEffect(() => {
    const token = getFromSessionStorage(SESSION_ENUMS.SIGNUPSESSIONKEY);
    if (token) {
      const data = jwtDataDecoder(token);
      console.log("DATA FROM TOKEN ALREADY__", data);
    }
    return () => {
      dispatch(resetCompanyInfoLoadingBackToIdle());
    };
  }, []);

  const formValidation = () => {
    const startDate = new Date(formInfo.joinDate);
    const lastDate = new Date(formInfo.endDate);

    if (!formInfo.joinDate || formInfo.joinDate?.length === 0) {
      setIsError(true);
      setError((prevErr) => {
        return {
          ...prevErr,
          joinDateError: "Join date is required fields",
        };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, joinDateError: "" };
      });
    }
    if (!formInfo.endDate || formInfo.endDate?.length === 0) {
      setIsError(true);
      setError((prevErr) => {
        return {
          ...prevErr,
          endDateError: "End date is required fields",
        };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, endDateError: "" };
      });
    }

    if (startDate >= lastDate) {
      setIsError(true);
      setError((prevErr) => {
        return {
          ...prevErr,
          endDateError: "End date must be greater then join date",
        };
      });
      return false;
    } else {
      setIsError(false);
      setError((prevErr) => {
        return { ...prevErr, endDateError: "" };
      });
    }
    return true;
  };

  const handleChange = (e) => {
    setIsError(false);
    const { name, value } = e.target;
    setFormInfo((prevInfo) => {
      return { ...prevInfo, [name]: value };
    });
  };

  const handleExperienceChange = (e) => {
    const { name, value } = e.target;
    setFormInfo((prevInfo) => {
      return { ...prevInfo, [name]: value };
    });
  };

  const handleDateChange = (dateKey, dateValue) => {
    setIsError(false);
    if (dateKey === "joinDate") {
      setError((prevErr) => {
        return { ...prevErr, joinDateError: "" };
      });
    }
    if (dateKey === "endDate") {
      setError((prevErr) => {
        return { ...prevErr, endDateError: "" };
      });
    }
    setFormInfo({
      ...formInfo,
      [dateKey]: dateValue,
    });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const isValid = formValidation();
    console.log("Hnadle form submit called");
    if (isValid) {
      dispatch(addCompanyInfoInStateAction(formInfo));
      dispatch(addcompanyInfoApiAction(formInfo));
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

  // console.log("formInfo--", formInfo, "formError-", error);
  // console.log("DATA IN REDUX STORE_", data);

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
              label="Company Name"
              name="companyName"
              value={formInfo.companyName}
              onChange={handleChange}
              required
              margin="normal"
              error={error.companyNameError}
            />
            {error.companyNameError && (
              <FormHelperText error>{error.companyNameError}</FormHelperText>
            )}
          </FormControl>
          <FormControl>
            <InputLabel id="demo-simple-select-label">Experience</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              label="Experience"
              name="experience"
              value={formInfo.experience}
              onChange={handleExperienceChange}
              required
            >
              <MenuItem value={1}>1</MenuItem>
              <MenuItem value={2}>2</MenuItem>
              <MenuItem value={3}>3</MenuItem>
              <MenuItem value={4}>{">3"}</MenuItem>
            </Select>
            {error.experienceError && (
              <FormHelperText>{error.experienceError}</FormHelperText>
            )}
          </FormControl>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Stack direction={"horizontal"} sx={{ gap: 4, my: "15px" }}>
              <Box width={"50%"}>
                <DatePicker
                  label="Start date"
                  defaultValue={dayjs(data?.joinDate) || ""}
                  onChange={(newValue) => {
                    handleDateChange(
                      "joinDate",
                      dayjs(newValue).format("DD/MM/YYYY")
                    );
                  }}
                  sx={{
                    width: "100%",
                  }}
                  required
                />
                {error.joinDateError && (
                  <FormHelperText error>{error.joinDateError}</FormHelperText>
                )}
              </Box>
              <Box width={"50%"}>
                <DatePicker
                  label="End date"
                  defaultValue={dayjs(data?.endDate) || ""}
                  onChange={(newValue) => {
                    handleDateChange(
                      "endDate",
                      dayjs(newValue).format("DD/MM/YYYY")
                    );
                  }}
                  sx={{
                    width: "100%",
                  }}
                  required
                />
                {error.endDateError && (
                  <FormHelperText error>{error.endDateError}</FormHelperText>
                )}
              </Box>
            </Stack>
          </LocalizationProvider>{" "}
          <Box display={"flex"} justifyContent={"space-between"} mt={10}>
            <Button
              width="100px"
              onClick={() => {
                navigate("/signup");
                handleStepperMovement(0);
              }}
            >
              <ArrowBackIosIcon fontSize="large" />
            </Button>

            <Button type="submit" width="100px" onClick={() => {}}>
              Save
            </Button>
            {(loading === LOADING_ENUMS.LOAD_SUCCEDED ||
              (loading === LOADING_ENUMS.LOAD_IDEL && isDataAvailable)) && (
              <Button
                // disabled={!loading === LOADING_ENUMS.LOAD_SUCCEDED}
                width="100px"
                onClick={() => {
                  navigate("/signup/createPassword");
                  handleStepperMovement(2);
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

export default CompanyDetails;
