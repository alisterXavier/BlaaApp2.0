import { createContext } from "react";
import { ContentsInterface, SinglePostInterface } from "../Types/type";

interface search {
  searchContent: string;
  setSearchContent: (value: string | ((preVar: string) => string)) => void;
}
interface nav {
  selectNavOption: (id: string) => void;
}
interface enImage {
  enlargeImage: Array<string>;
  setEnlargeImage: (
    value: Array<string> | ((preVal: Array<string>) => Array<string>)
  ) => void;
}

export const ReplyPostAndSelectPostContext =
  createContext<SinglePostInterface>({} as SinglePostInterface);
export const NavbarContext = createContext({} as nav["selectNavOption"]);
export const PostsContext = createContext<ContentsInterface | undefined>([]);
export const SearchContext = createContext({} as search);
export const EnlargeImage = createContext({} as enImage);
