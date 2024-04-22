import React from "react";
import { Route, Routes } from "react-router-dom";
import PersonalDetails from "../components/SignupCompo/PersonalDetails";
import CompanyDetails from "../components/SignupCompo/CompanyDetails";
import CreateEmailPassword from "../components/SignupCompo/CreateEmailPassword";
import EmailPassGuard from "./Guards/EmailPassGuard";
import CompanyGuard from "./Guards/CompanyGuard";
import { AuthGuard } from "./Guards/AuthGuard";
import Home from "../pages/Home/Home";
import Login from "../components/HomeCompo/Login";
import Signup from "../components/HomeCompo/Signup";
import ChatPage from "../pages/ChatPage/ChatPage";

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
        path="/chat"
        element={
          <AuthGuard>
            <ChatPage />
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
