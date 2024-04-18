import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserReq } from "../../../api/loginRequest";
import { LOADING_ENUMS } from "../../../enums/enums";

export const loginUserReqAction = createAsyncThunk(
  "loginSlice/loginUserReqActionState",
  async (payload, thunkApi) => {
    try {
      const res = await loginUserReq(payload);
      if (res.isLogin) {
        return res;
      }
    } catch (error) {
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const loginInitialState = {
  loading: LOADING_ENUMS.LOAD_IDEL,
  user: {},
  requestStatus: {},
  error: null,
};

const loginSlice = createSlice({
  name: "loginSlice",
  initialState: loginInitialState,
  extraReducers: (builder) => {
    builder.addCase(loginUserReqAction.pending, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_PENDING;
    });
    builder.addCase(loginUserReqAction.fulfilled, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_SUCCEDED;
      state.requestStatus = {
        isLogin: action.payload?.isLogin,
        message: action?.payload?.message,
      };
      state.user = action.payload?.user;
    });
    builder.addCase(loginUserReqAction.rejected, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_FAILED;
      state.error = action.payload;
    });
  },
});

export default loginSlice.reducer;
