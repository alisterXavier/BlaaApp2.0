import { createSlice } from "@reduxjs/toolkit";

export interface navInterface {
  home: boolean;
  chats: boolean;
  post: boolean;
  settings: boolean;
  profile: boolean;
  logOut: boolean;
}
const initialState: navInterface = {
  home: true,
  chats: false,
  post: false,
  settings: false,
  profile: false,
  logOut: false,
};

const NavReducer = createSlice({
  name: "navbar",
  initialState,
  reducers: {
    changeSelection: (state, action) => {
      const { id } = action.payload;
      Object.keys(state).map((d) => (state[d as keyof navInterface] = false));
      if (id === "") state["home"] = true;
      else if(id === "post") state["post"] = true
      else state[id as keyof navInterface] = true;
    },
    setLoadSelection: (state, action) => {
      const url = window.location.pathname;
      action.payload = { id: url.split("/")[1] };
      NavReducer.caseReducers.changeSelection(state, action);
    },
  },
});

export const { changeSelection, setLoadSelection } = NavReducer.actions;
export default NavReducer.reducer;
