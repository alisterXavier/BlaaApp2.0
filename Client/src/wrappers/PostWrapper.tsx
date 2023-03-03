import { useSelector } from "react-redux";
import { ContentsInterface, WrapperContent } from "../Types/type";
import { PostsContext } from "../utils/ContextApi";
import { getPosts } from "../features/ContentReducer";
import { PostsSkeleton } from "../components/Skeleton";

const PostWrapper = ({ children }: WrapperContent) => {
  const posts = useSelector((state: { content: ContentsInterface }) => getPosts(state.content));

  return posts ? (
    <PostsContext.Provider value={posts}>{children}</PostsContext.Provider>
  ) : (
    <PostsSkeleton number={5} />
  );
};

export default PostWrapper;
