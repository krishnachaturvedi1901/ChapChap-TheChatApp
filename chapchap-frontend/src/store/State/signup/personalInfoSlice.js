import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addPersonalInfo } from "../../../api/signupRequests";
import { produce } from "immer";
import { LOADING_ENUMS } from "../../../enums/enums";

export const addPersonalInfoApiAction = createAsyncThunk(
  "signup/addPersonalInfoStatus",
  async (payload, thunkApi) => {
    try {
      const res = await addPersonalInfo(payload);
      console.log("res in redux-", res);
      if (res.isAdded) {
        return res;
      }
    } catch (error) {
      console.log("error in redux-", error);
      return thunkApi.rejectWithValue(`${error}`);
    }
  }
);

const personalInfoInitialState = {
  loading: LOADING_ENUMS.LOAD_IDEL,
  data: {},
  isDataAvailable: false,
  requestStatus: {},
  error: null,
};

export const personalInfoSlice = createSlice({
  name: "personalInfoSlice",
  initialState: personalInfoInitialState,
  reducers: {
    addPersonalInfoInStateAction: (state, action) => {
      return produce(state, (draftState) => {
        draftState.data = action.payload;
        draftState.isDataAvailable = true;
      });
    },
    resetLoadingBackToIdle: (state, action) => {
      return produce(state, (draftState) => {
        draftState.loading = LOADING_ENUMS.LOAD_IDEL;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addPersonalInfoApiAction.pending, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_PENDING;
    });
    builder.addCase(addPersonalInfoApiAction.fulfilled, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_SUCCEDED;
      state.requestStatus = action.payload;
    });
    builder.addCase(addPersonalInfoApiAction.rejected, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_FAILED;
      state.error = action.payload;
    });
  },
});

export default personalInfoSlice.reducer;
export const { addPersonalInfoInStateAction, resetLoadingBackToIdle } =
  personalInfoSlice.actions;
