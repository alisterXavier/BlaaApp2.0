import { createSlice } from "@reduxjs/toolkit";
import { ContentsInterface } from "../Types/type";

const initialState: ContentsInterface | null = null;

const ContentReducer = createSlice({
  name: "content",
  initialState,
  reducers: {
    setContent: (state, action) => {
      const { data } = action.payload;
      return data;
    },
  },
});

export const getPosts = (state: ContentsInterface) => {
  return state?.filter((content) => content.type === "post");
};
export const getPostReplies = (state: ContentsInterface, pid?: string) => {
  return state?.filter((content) => content.type === "reply" && content.pid === pid);
};
export const getReplies = (state: ContentsInterface, uid: string) => {
  return state?.filter((content) => content.type === "reply" && content.uid === uid);
};
export const selectById = (state: ContentsInterface, postId: string | null) => {
  return state?.find((post) => post.id === postId);
};
export const filterByUserId = (state: ContentsInterface, userId: string) => {
  return state?.filter((post) => post.uid === userId);
};

export const { setContent } = ContentReducer.actions;
export default ContentReducer.reducer;
