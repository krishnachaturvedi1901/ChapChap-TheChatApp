import { Box, Card, Stack } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <Stack
      direction={"column"}
      sx={{
        gap: 1,
        width: "60%",
        alignItems: "center",
        margin: "auto",
      }}
    >
      <Card
        sx={{
          padding: "10px",
          textAlign: "center",
          backgroundColor: "gainsboro",
          color: "black",
          cursor: "pointer",
        }}
        onClick={() => navigate("/login")}
      >
        Login
      </Card>
      <Card
        sx={{
          padding: "10px",
          textAlign: "center",
          backgroundColor: "blueviolet",
          color: "whitesmoke",
          cursor: "pointer",
        }}
        onClick={() => navigate("/signup")}
      >
        Signup
      </Card>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log("Login Failed");
        }}
        useOneTap
      />

      <Card
        sx={{
          padding: "10px",
          textAlign: "center",
          backgroundColor: "#4164AE",
          color: "whitesmoke",
        }}
      >
        Signup using facebook
      </Card>
    </Stack>
  );
};

export default Home;
