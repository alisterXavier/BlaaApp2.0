import { createSlice } from "@reduxjs/toolkit";
import { chatInterface } from "../Types/type";
import { arraysEqual } from "../utils/helperFn";

const initialState: Array<chatInterface> = [];

const ChatReducer = createSlice({
  name: "chats",
  initialState,
  reducers: {
    resetChat: () => {
      return [];
    },
    ChatInit: (state, action) => {
      const { chats } = action.payload;
      return !arraysEqual(chats, [...state]) ? [...chats] : [...state];
    },
  },
});

export const findUserChat = (
  sid: string,
  cid: string,
  state: Array<chatInterface>
) =>
  state.find((chat: chatInterface) =>
    arraysEqual(
      chat.userDetails.map((user) => user.uid).sort(),
      [sid, cid].sort()
    )
  );
export const selectChatById = (id: string, state: Array<chatInterface>) =>
  state.find((chat: chatInterface) => chat.chatId === id);
export const { ChatInit, resetChat } = ChatReducer.actions;
export default ChatReducer.reducer;
