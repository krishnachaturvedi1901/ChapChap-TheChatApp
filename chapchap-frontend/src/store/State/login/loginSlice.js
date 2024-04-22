import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { loginUserReq } from "../../../api/loginRequest";
import { LOADING_ENUMS } from "../../../enums/enums";
import { produce } from "immer";

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
  reducers: {
    resetLoginStateBackToIdle: (state, action) => {
      return produce(state, (draftState) => {
        draftState.loading = LOADING_ENUMS.LOAD_IDEL;
        draftState.user = {};
        draftState.requestStatus = {};
        draftState.error = null;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loginUserReqAction.pending, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_PENDING;
    });
    builder.addCase(loginUserReqAction.fulfilled, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_SUCCEDED;
      state.requestStatus = {
        isLogin: action?.payload?.isLogin,
        message: action?.payload?.message,
      };
      state.user = action?.payload?.data?.user;
    });
    builder.addCase(loginUserReqAction.rejected, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_FAILED;
      state.error = action.payload;
    });
  },
});
export const { resetLoginStateBackToIdle } = loginSlice.actions;
export default loginSlice.reducer;
