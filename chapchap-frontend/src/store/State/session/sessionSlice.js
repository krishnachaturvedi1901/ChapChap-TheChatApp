import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getAuthSession } from "../../../api/authorizeRequest";
import { LOADING_ENUMS } from "../../../enums/enums";
import { produce } from "immer";

export const getAuthSessionAction = createAsyncThunk(
  "getAuthSessionActionState",
  async (payload, thunkApi) => {
    try {
      const res = await getAuthSession();
      console.log("res.data in getAuthSessionAction ", res);
      return res;
    } catch (error) {
      console.log("error in getAuthSessionAction", error.message);
      return thunkApi.rejectWithValue(error.message);
    }
  }
);

const initialState = {
  isLoading: LOADING_ENUMS.LOAD_IDEL,
  error: null,
  auth: { isAuthorize: false, user: null },
};

const sessionSlice = createSlice({
  name: "sessionSlice",
  initialState,
  reducers: {
    expiresAuthSession: (state, action) => {
      return produce(state, (draftState) => {
        draftState.isLoading = LOADING_ENUMS.LOAD_IDEL;
        draftState.auth = { isAuthorize: false, user: null };
        draftState.error = null;
      });
    },
    setAuthSessionDirectly: (state, action) => {
      return produce(state, (draftState) => {
        draftState.isLoading = LOADING_ENUMS.LOAD_SUCCEDED;
        draftState.auth = action.payload;
        draftState.error = null;
      });
    },
  },
  extraReducers: (builder) => {
    builder.addCase(getAuthSessionAction.pending, (state, action) => {
      state.isLoading = LOADING_ENUMS.LOAD_PENDING;
    });
    builder.addCase(getAuthSessionAction.fulfilled, (state, action) => {
      state.isLoading = LOADING_ENUMS.LOAD_SUCCEDED;
      state.auth = action.payload;
    });
    builder.addCase(getAuthSessionAction.rejected, (state, action) => {
      state.isLoading = LOADING_ENUMS.LOAD_FAILED;
      state.error = action.payload;
    });
  },
});

export const { expiresAuthSession, setAuthSessionDirectly } =
  sessionSlice.actions;
export default sessionSlice.reducer;
