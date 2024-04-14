import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const EmailPassGuard = ({ children }) => {
  const { isDataAvailable } = useSelector((state) => state.companyInfoState);
  if (!isDataAvailable) {
    return <Navigate to={"/signup/companyInfo"} />;
  }
  return children;
};

export default EmailPassGuard;
