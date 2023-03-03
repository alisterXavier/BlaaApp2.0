import { useDispatch } from "react-redux";
import "@/styles/home.css";
import "@/styles/stories.css";
import { useRef, useState, useContext, useEffect } from "react";
import SearchPage from "../Search/Search";
import { SearchContext } from "../../utils/ContextApi";
import PostWrapper from "../../wrappers/PostWrapper";
import { setLoadSelection } from "../../features/NavReducer";
import { Posts } from "../Posts/Post";

var searchDebounce: ReturnType<typeof setTimeout>;

const Search = () => {
  const [searchToggle, setSearchToggle] = useState<boolean>(false);
  const { searchContent, setSearchContent } = useContext(SearchContext);
  const searchRef = useRef<HTMLInputElement>(null);
  return (
    <div className="search ml-auto flex justify-end items-center">
      <label
        className="flex items- bg-neutral-700"
        onClick={() => {
          const value = !searchToggle;
          if (searchContent.length === 0) {
            setSearchToggle(value);
            !value && searchRef.current?.blur();
          }
        }}
      >
        <input
          type="search"
          ref={searchRef}
          onChange={(e) => {
            const value = e.currentTarget.value;
            if (searchDebounce) clearTimeout(searchDebounce);
            searchDebounce = setTimeout(() => {
              setSearchContent(value);
            }, 1500);
          }}
        />
        <p className={`${searchToggle && "active"}`}>Search</p>
      </label>
    </div>
  );
};

const Home = () => {
  const dispatch = useDispatch();
  const [searchContent, setSearchContent] = useState<string>("");
  useEffect(() => {
    dispatch(setLoadSelection(null));
  }, []);
  return (
    
      <div className="content">
        <SearchContext.Provider value={{ searchContent, setSearchContent }}>
          <div className="search-box-wrapper w-full lg:w-[90%]">
            <Search />
          </div>
          {searchContent.length === 0 ? (
            <PostWrapper>
              <Posts />
            </PostWrapper>
          ) : (
            <SearchPage />
          )}
        </SearchContext.Provider>
      </div>
  )
};

export default Home;
