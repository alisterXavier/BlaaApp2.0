import { ReactNode } from "react";

export interface WrapperContent {
  children: ReactNode;
}

export interface EventProp {
  handleSwitch: () => void;
  loginResponse: (
    value: boolean | null | ((preVar: boolean | null) => boolean)
  ) => void;
  loading: (value: boolean | ((preVar: boolean) => boolean)) => void;
}

export interface Loading {
  loading: boolean | undefined;
}

// UserState
export interface userProfileState {
  username: string | undefined;
  website_accent: string | null;
  posts: Array<string> | undefined;
  replies: Array<string> | undefined;
  uid: string | undefined;
  profilePicture: string | null;
  email: string | null;
  following: Array<string | undefined>;
  followers: Array<string | undefined>;
  chatIds: Array<string>;
  layout: string;
}
export interface userProfilesState extends Array<userProfileState> {}

// Nav
export interface obj {
  home: () => void;
  chat: () => void;
  post: () => void;
  settings: () => void;
  profile: () => void;
  "log-out": () => void;
}

// SinglePost
export interface SinglePostInterface {
  selectPost: string | undefined;
  setPostId: (id: string) => void;
  replyModal: boolean;
  setToggleReply: (val: boolean | ((preVal: boolean) => boolean )) => void;
  postModal: boolean;
  setTogglePost: (val: boolean | ((preVal: boolean) => boolean )) => void;
}

// StoryState
export interface StoryInterface {
  username: string;
  image: string;
  date: string;
  userprofile?: string;
}
export interface storiesInterface extends Array<StoryInterface> {}

// PostStat
export interface ContentInterface {
  type: string;
  id: string;
  pid?: string;
  uid?: string;
  userprofile: string;
  username: string;
  date: string;
  images?: Array<string>;
  content?: string;
  replies?: Array<string>;
  likes?: Array<string>;
}
export interface ContentsInterface extends Array<ContentInterface> {}

// ChatState
export interface chatInterface {
  chatId: string;
  chatName: string;
  userDetails: userProfilesState;
  conversation: Array<{
    userId: string;
    date: string;
    content: string;
    images?: string;
    username: string;
  }>;
}
