import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "../pages/Signup";
import Home from "../pages/Home";
import PersonalDetails from "../components/SignupCompo/PersonalDetails";
import CompanyDetails from "../components/SignupCompo/CompanyDetails";
import CreateEmailPassword from "../components/SignupCompo/CreateEmailPassword";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard/Dashboard";
import EmailPassGuard from "./Guards/EmailPassGuard";
import CompanyGuard from "./Guards/CompanyGuard";
import { AuthGuard } from "./Guards/AuthGuard";

const AllRoutes = () => {
  return (
    <Routes>
      <Route index path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />}>
        <Route index element={<PersonalDetails />} />
        <Route
          path="companyInfo"
          element={
            <CompanyGuard>
              <CompanyDetails />
            </CompanyGuard>
          }
        />
        <Route
          path="createPassword"
          element={
            <EmailPassGuard>
              <CreateEmailPassword />
            </EmailPassGuard>
          }
        />
      </Route>
      <Route
        path="/dashboard"
        element={
          <AuthGuard>
            <Dashboard />
          </AuthGuard>
        }
      />
      <Route
        path={"/*"}
        element={
          <h1 style={{ textAlign: "center", color: "red", marginTop: "60px" }}>
            404: Not Found
          </h1>
        }
      />
    </Routes>
  );
};

export default AllRoutes;
