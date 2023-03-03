import { useContext, useEffect, useState } from "react";
import { PostsContext, SearchContext } from "../../utils/ContextApi";
import { useSelector } from "react-redux";
import {
  ContentsInterface,
  userProfileState,
  userProfilesState,
} from "../../Types/type";
import "@/styles/search.css";
import { Posts } from "../Posts/Post";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { auth } from "../../firebase/firebase";
import { UserSkeleton } from "../Skeleton";
import Empty from "../Empty";

export const Users = ({
  searchContent,
  usersList,
  Event,
  type,
}: {
  searchContent?: string;
  usersList?: Array<string | undefined>;
  Event: (user: userProfileState) => void;
  type?: string;
}) => {
  const [users, setUsers] = useState<userProfilesState>();
  const getusers = () => {
    axios
      .post(
        `${import.meta.env.VITE_API}/${
          type && type === "follow"
            ? `user/get-users`
            : `chats/get-users?user=${searchContent}`
        }`,
        { usersList: usersList }
      )
      .then((res) => {
        setUsers(
          type && type === "follow"
            ? res.data
            : res.data.filter(
                (user: userProfileState) =>
                  user.uid !== auth.currentUser?.uid
              )
        );
      });
  };

  useEffect(() => {
    getusers();
  }, [searchContent, usersList]);

  return users ? (
    users.length > 0 ? (
      <>
        {users.map((user) => (
          <div
            className="user w-full my-2 flex items-center justify-start cursor-pointer"
            id={`${user.uid}`}
            onClick={() => {
              Event(user);
            }}
          >
            <figure>
              {user.profilePicture && (
                <img src={user.profilePicture} alt="Profile" />
              )}
            </figure>
            <p className="ml-3">{user.username}</p>
          </div>
        ))}
      </>
    ) : (
      <h1 className="text-xl p-5">No users</h1>
    )
  ) : (
    <UserSkeleton number={3} imageSize={40} textSize={150} />
  );
};

const Search = () => {
  const navigate = useNavigate();
  const { searchContent, setSearchContent } = useContext(SearchContext);
  const posts = useSelector((state: { content: ContentsInterface }) =>
    state.content.filter((post) => {
      return (
        (post.content && new RegExp(searchContent, "gi").test(post.content)) ||
        new RegExp(searchContent, "gi").test(post.username)
      );
    })
  );
  const toUserProfile = (user: userProfileState) => {
    navigate(`/profile/${user.uid}`);
  };

  return searchContent ? (
    <div className="search-wrapper flex justify-center items-center md:items-start flex-col-reverse lg:flex-row">
      {
        posts.length > 0 ? (
          <PostsContext.Provider value={posts}>
            <Posts />
          </PostsContext.Provider>
        ) : (
          <Empty/>
        )
      
      }
      <div className="users h-[300px] lg:h-[500px]">
        <div className="flex flex-col justify-center items-center p-[5px] overflow-scroll max-h-full">
          <Users searchContent={searchContent} Event={toUserProfile} />
        </div>
      </div>
    </div>
  ) : (
    <></>
  );
};

export default Search;
