import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addCompanyInfo } from "../../api/signupRequests";
import { produce } from "immer";
import { LOADING_ENUMS } from "../../enums/enums";

export const addcompanyInfoApiAction = createAsyncThunk(
  "signup/addCompanyInfoStatus",
  async (payload, thunkApi) => {
    try {
      const response = await addCompanyInfo(payload);
      console.log("res in redux-", response);
      if (response.isAdded) {
        return response;
      }
    } catch (error) {
      console.log("error in redux-", error.message);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const companyInfoInitialState = {
  loading: LOADING_ENUMS.LOAD_IDEL,
  data: {},
  isDataAvailable: false,
  requestStatus: {},
  error: null,
};

const companyInfoSlice = createSlice({
  name: "companyInfoSlice",
  initialState: companyInfoInitialState,
  reducers: {
    addCompanyInfoInStateAction: (state, action) => {
      return produce(state, (draftState) => {
        draftState.data = action.payload;
        draftState.isDataAvailable = true;
      });
    },
    resetCompanyInfoLoadingBackToIdle: (state, action) => {
      return produce(state, (draftState) => {
        draftState.loading = LOADING_ENUMS.LOAD_IDEL;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addcompanyInfoApiAction.pending, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_PENDING;
    });
    builder.addCase(addcompanyInfoApiAction.fulfilled, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_SUCCEDED;
      state.requestStatus = action.payload;
    });
    builder.addCase(addcompanyInfoApiAction.rejected, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_FAILED;
      state.error = action.payload;
    });
  },
});

export default companyInfoSlice.reducer;
export const {
  addCompanyInfoInStateAction,
  resetCompanyInfoLoadingBackToIdle,
} = companyInfoSlice.actions;
