import { Box, Button, Card, Stack, Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../config/axios.config";
import { config } from "../../config/config";
import Login from "../../components/HomeCompo/Login";
import useAuth from "../../hooks/useAuth";

const Home = () => {
  const { auth } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (auth.isAuthorize) {
      navigate("/chat");
    }
  }, [auth]);
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
      <Login />

      <Typography
        sx={{
          color: "black",
          mb: "10px",
          "&:hover": {
            cursor: "pointer",
            color: "rgba(104, 85, 224, 1)",
            fontWeight: "bold",
          },
        }}
        onClick={() => navigate("/signup")}
      >
        New to this page?{" "}
        <span style={{ color: "rgba(104, 85, 224, 1)" }}>Signup</span>
      </Typography>

      <Box
        sx={{
          width: 230,
          height: 40,
          borderRadius: 5,
          border: "none",
          outline: "none",
          backgroundColor: "white",
          boxShadow:
            "0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%)",
          fontSize: 16,
          fontWeight: 500,
          margin: "0 0 20px 0",
          color: "#2c444e",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
        onClick={() => {
          window.open(`${config.api_url}/auth/google`, "_self");
        }}
      >
        <img
          src="./google.png"
          alt="google icon"
          style={{
            width: 30,
            height: 30,
            objectFit: "cover",
            marginRight: 10,
          }}
        />
        <span
          sx={{
            marginLeft: 10,
            fontSize: 16,
            fontWeight: 500,
            color: "#2c444e",
          }}
        >
          Sign in with Google
        </span>
      </Box>
      <Box
        sx={{
          position: "relative",
          margin: "0.2em",
          padding: "5px 40px",
          border: "none",
          textAlign: "center",
          lineHeight: "34px",
          whiteSpace: "nowrap",
          borderRadius: "0.2em",
          fontSize: 16,
          color: "#FFF",
          backgroundColor: "#4C69BA",
          backgroundImage: "linear-gradient(#4C69BA, #3B55A0)",
          textShadow: "0 -1px 0 #354C8C",
          "&:before": {
            content: "''",
            boxSizing: "border-box",
            position: "absolute",
            top: 0,
            left: 0,
            width: 34,
            height: "100%",
            borderRight: "#364e92 1px solid",
            background:
              "url('https://s3-us-west-2.amazonaws.com/s.cdpn.io/14082/icon_facebook.png') 6px 6px no-repeat",
          },
          "&:hover, &:focus": {
            cursor: "pointer",
            backgroundColor: "#5B7BD5",
            backgroundImage: "linear-gradient(#5B7BD5, #4864B1)",
          },
        }}
      >
        Signin with Facebook
      </Box>
    </Stack>
  );
};

export default Home;
