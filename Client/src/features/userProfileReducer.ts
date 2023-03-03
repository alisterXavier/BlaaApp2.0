import { createSlice } from "@reduxjs/toolkit";
import { userProfileState } from "../Types/type";

const initialState: { loading: boolean; user: userProfileState} =
  {
    loading: true,
    user: {} as userProfileState
  };

export const styleReducer = createSlice({
  name: "userProfile",
  initialState,
  reducers: {
    init: (state, action) => {
      return !action.payload
        ? { loading: false, user: { website_accent: "#04ff00" } }
        : { loading: false, user: { ...action.payload } };
    },
  },
});

export const { init } =
  styleReducer.actions;

export default styleReducer.reducer;
