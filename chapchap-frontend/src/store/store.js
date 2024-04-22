import { configureStore } from "@reduxjs/toolkit";
import personalInfoReducer from "./State/signup/personalInfoSlice";
import companyInfoReducer from "./State/signup/companyInfoSlice";
import emailPassInfoReducer from "./State/signup/emailPassInfoSlice";
import loginReducer from "./State/login/loginSlice";

export const store = configureStore({
  reducer: {
    personalInfoState: personalInfoReducer,
    companyInfoState: companyInfoReducer,
    emailPasswordInfoState: emailPassInfoReducer,
    loginState: loginReducer,
  },
});

store.subscribe(() => {
  console.log("in strore", store.getState());
});
