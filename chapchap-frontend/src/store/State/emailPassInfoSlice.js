import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { addEmailPasswordInfo } from "../../api/signupRequests";
import { produce } from "immer";
import { LOADING_ENUMS } from "../../enums/enums";

export const addEmailPassInfoApiAction = createAsyncThunk(
  "signup/addEmailPassInfoStatus",
  async (payload, thunkApi) => {
    try {
      const response = await addEmailPasswordInfo(payload);
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

const emailPassInfoInitialState = {
  loading: LOADING_ENUMS.LOAD_IDEL,
  data: {},
  isDataAvailable: false,
  requestStatus: {},
  error: null,
};

const emailPassInfoSlice = createSlice({
  name: "emailPassInfoSlice",
  initialState: emailPassInfoInitialState,
  reducers: {
    addEmailPassInfoInStateAction: (state, action) => {
      return produce(state, (draftState) => {
        draftState.data = action.payload;
        draftState.isDataAvailable = true;
      });
    },
    resetEmailPassInfoLoadingBackToIdle: (state, action) => {
      return produce(state, (draftState) => {
        draftState.loading = LOADING_ENUMS.LOAD_IDEL;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(addEmailPassInfoApiAction.pending, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_PENDING;
    });
    builder.addCase(addEmailPassInfoApiAction.fulfilled, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_SUCCEDED;
      state.requestStatus = action.payload;
    });
    builder.addCase(addEmailPassInfoApiAction.rejected, (state, action) => {
      state.loading = LOADING_ENUMS.LOAD_FAILED;
      state.error = action.payload;
    });
  },
});

export default emailPassInfoSlice.reducer;
export const {
  addEmailPassInfoInStateAction,
  resetEmailPassInfoLoadingBackToIdle,
} = emailPassInfoSlice.actions;
