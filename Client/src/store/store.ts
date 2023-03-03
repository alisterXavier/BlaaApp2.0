import { configureStore } from "@reduxjs/toolkit";
import userProfileReducer from "../features/userProfileReducer";
import ChatReducer from "../features/ChatReducer";
import NavReducer from "../features/NavReducer";
import ContentReducer from "../features/ContentReducer";

export const store = configureStore({
  reducer: {
    userProfile: userProfileReducer,
    content: ContentReducer,
    chats: ChatReducer,
    navbar: NavReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
