import { Box, Step, StepLabel, Stepper, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useParams } from "react-router-dom";

const steps = [
  "Provide personal information",
  "Provide company information",
  "Create password",
];

const Signup = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const location = useLocation();
  const pathname = location.pathname;

  const handleStepperMovement = (stepIndex) => {
    setCurrentStep(stepIndex);
  };

  useEffect(() => {
    console.log("current params22", pathname);
    if (pathname === "/signup") {
      setCurrentStep(0);
    }
    if (pathname === "/signup/companyInfo") {
      setCurrentStep(1);
    }

    if (pathname === "/signup/createPassword") {
      setCurrentStep(2);
    }
  }, [location]);

  return (
    <Box sx={{ padding: "15px" }}>
      <Typography
        variant="h4"
        gutterBottom
        sx={{ textAlign: "center", color: "slategray" }}
      >
        Signup
      </Typography>
      <Box sx={{ width: "100%", my: "40px" }}>
        <Stepper activeStep={currentStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel sx={{ color: "whitesmoke" }}>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>
      <Outlet context={{ handleStepperMovement }} />
    </Box>
  );
};

export default Signup;
