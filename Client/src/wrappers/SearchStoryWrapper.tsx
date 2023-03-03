import { WrapperContent } from "../Types/type";

const SearchStoryWrapper = ({ children }: WrapperContent) => {
  return (
    <div className="w-full ">
      <div className="search-wrapper w-[90%] m-auto">{children}</div>
    </div>
  );
};
export default SearchStoryWrapper;
