import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store.js";
import { AuthContextProvider } from "./context/AuthContext.jsx";
import { SnackbarProvider } from "notistack";
import { config } from "./config/config.js";
import { GoogleOAuthProvider } from "@react-oauth/google";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={config.googleOauth_clientId}>
      <SnackbarProvider>
        <Provider store={store}>
          <AuthContextProvider>
            <BrowserRouter>
              <App />
            </BrowserRouter>
          </AuthContextProvider>
        </Provider>
      </SnackbarProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
