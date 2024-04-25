import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { logoutRequest } from "../../../api/logoutRequest";
import { LOADING_ENUMS } from "../../../enums/enums";
import { produce } from "immer";

export const logoutAction = createAsyncThunk(
  "logoutActionStatus",
  async (payload, thunkApi) => {
    try {
      const res = await logoutRequest();
      console.log("res after logout after action", res);
      return res;
    } catch (error) {
      console.log("error after logout in action-", error);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const logoutState = {
  isLoading: LOADING_ENUMS.LOAD_IDEL,
  error: null,
  message: null,
};

const logoutSlice = createSlice({
  initialState: logoutState,
  name: "logoutSlice",
  reducers: {
    resetLogoutStateBackToIdle: (state, action) => {
      return produce(state, (draftState) => {
        draftState.isLoading = LOADING_ENUMS.LOAD_IDEL;
        draftState.message = null;
        draftState.error = null;
      });
    },
  },

  extraReducers: (builder) => {
    builder.addCase(logoutAction.pending, (state, action) => {
      state.isLoading = LOADING_ENUMS.LOAD_PENDING;
    });
    builder.addCase(logoutAction.fulfilled, (state, action) => {
      state.isLoading = LOADING_ENUMS.LOAD_SUCCEDED;
      state.message = action.payload;
    });
    builder.addCase(logoutAction.rejected, (state, action) => {
      state.isLoading = LOADING_ENUMS.LOAD_FAILED;
      state.error = action.payload;
    });
  },
});

export const { resetLogoutStateBackToIdle } = logoutSlice.actions;
export default logoutSlice.reducer;
