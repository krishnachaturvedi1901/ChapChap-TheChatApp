import React from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const CompanyGuard = ({ children }) => {
  const { isDataAvailable } = useSelector((state) => state.personalInfoState);
  if (!isDataAvailable) {
    return <Navigate to={"/signup"} />;
  }
  return children;
};

export default CompanyGuard;
