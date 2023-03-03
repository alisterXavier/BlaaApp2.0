import { createSlice } from "@reduxjs/toolkit";
import { ContentsInterface } from "../Types/type";

const initialState: ContentsInterface = [];

const repliesReducer = createSlice({
  name: "replies",
  initialState,
  reducers: {},
});

export default repliesReducer.reducer