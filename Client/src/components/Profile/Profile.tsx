import { useNavigate, useParams } from "react-router-dom";
import "@/styles/profile.css";
import { useDispatch, useSelector } from "react-redux";
import {
  ContentsInterface,
  chatInterface,
  userProfileState,
} from "../../Types/type";
import {
  filterByUserId,
  getPosts,
  getReplies,
} from "../../features/ContentReducer";
import { PostsContext } from "../../utils/ContextApi";
import { createRippleEffect } from "../../utils/helperFn";
import { setLoadSelection } from "../../features/NavReducer";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Posts } from "../Posts/Post";
import { FaTelegramPlane } from "react-icons/fa";
import { HeaderSkeleton } from "../Skeleton";
import { RxCross2 } from "react-icons/rx";
import { Users } from "../Search/Search";
import { findUserChat } from "../../features/ChatReducer";
import { messageUser } from "../../utils/requests";
import { auth } from "../../firebase/firebase";

const ProfileHeader = ({
  userProfile,
  setFollowModal,
}: {
  userProfile: userProfileState | undefined;
  setFollowModal: (value: boolean | ((preVar: boolean) => boolean)) => void;
}) => {
  const navigate = useNavigate();
  const currentUserProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const chats = useSelector(
    (state: { chats: Array<chatInterface> }) => state.chats
  );

  const sendMessage = async () => {
    if (userProfile?.uid && currentUserProfile?.uid) {
      const chatIdToNavigate = findUserChat(
        userProfile.uid,
        currentUserProfile.uid,
        chats
      );
      if (chatIdToNavigate) {
        navigate(`/chats/${chatIdToNavigate.chatId}`);
      } else {
        await messageUser([userProfile], null).then(() => {
          navigate("/chats");
        });
      }
    }
  };

  const followUser = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_API}/user/follow`, {
        uid: userProfile?.uid,
        cuid: currentUserProfile.uid,
      })
      .then((res) => {});
  };

  const unFollowUser = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_API}/user/unfollow`, {
        uid: userProfile?.uid,
        cuid: currentUserProfile.uid,
      })
      .then((res) => {});
  };

  return (
    <div className="header w-full flex justify-center items-center my-5">
      {userProfile ? (
        <div className="w-[90%] flex items-center">
          <figure className="profile-userImage">
            <img src={`${userProfile.profilePicture}`}></img>
          </figure>
          <div className="flex">
            <div className="m-4">
              <div className="flex items-center">
                <h1 className="w-fit my-2 cursor-pointer text-xl lg:text-3xl">
                  {userProfile.username}
                  <span
                    className="user-underline"
                    style={{ background: `${userProfile.website_accent}` }}
                  ></span>
                </h1>
                {auth?.currentUser &&
                  currentUserProfile.uid !== userProfile.uid && (
                    <div className="follow-message-btns flex lg:justify-center items-center w-[300px]">
                      {userProfile.followers.includes(
                        currentUserProfile.uid
                      ) ? (
                        <button
                          className="btn follow-btn mx-2 w-[50%]"
                          onClick={unFollowUser}
                        >
                          Unfollow
                        </button>
                      ) : (
                        <button
                          className="btn follow-btn mx-2 w-[50%]"
                          onClick={followUser}
                        >
                          Follow
                        </button>
                      )}
                      <FaTelegramPlane
                        size={20}
                        className="mx-2 cursor-pointer w-[50%] lg:w-auto"
                        onClick={sendMessage}
                      />
                    </div>
                  )}
              </div>
              <div className="flex items-center">
                <div
                  className="mx-2 cursor-pointer"
                  onClick={() => setFollowModal(true)}
                >
                  <p className="text-lg lg:text-2xl">
                    {userProfile.followers ? userProfile.followers.length : "0"}
                  </p>
                  <p className="text-sm">followers</p>
                </div>
                <div className="mx-2 cursor-pointer">
                  <p
                    className="text-lg lg:text-2xl"
                    onClick={() => setFollowModal(true)}
                  >
                    {userProfile.following ? userProfile.following.length : "0"}
                  </p>
                  <p className="text-sm">following</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <HeaderSkeleton />
      )}
    </div>
  );
};

const FollowComponent = ({
  userProfile,
  setFollowModal,
}: {
  userProfile: userProfileState;
  setFollowModal: (value: boolean | ((preVar: boolean) => boolean)) => void;
}) => {
  const navigate = useNavigate();
  const [display, setDisplay] = useState<Array<string | undefined>>(
    userProfile.followers
  );
  const followersRef = useRef<HTMLParagraphElement>(null);
  const followingRef = useRef<HTMLParagraphElement>(null);
  const toUserProfile = (user: userProfileState) => {
    navigate(`/profile/${user.uid}`);
    setFollowModal(false);
  };
  return (
    <div className="follow-wrapper">
      <div className="follow p-5 relative">
        <div className="cross w-full sticky top-0">
          <RxCross2
            size={30}
            className="cursor-pointer"
            onClick={() => setFollowModal(false)}
          />
        </div>
        <div className="results-wrapper h-full p-5">
          <div className="follow-header h-[15%] w-full flex">
            <p
              className="w-[50%] cursor-pointer active border-r m-2"
              ref={followersRef}
              onClick={() => {
                followersRef.current?.classList.toggle("active");
                followingRef.current?.classList.toggle("active");
                setDisplay(userProfile.followers);
              }}
            >
              Followers {userProfile.followers.length}
            </p>
            <p
              className="w-[50%] cursor-pointer m-2"
              ref={followingRef}
              onClick={() => {
                followersRef.current?.classList.toggle("active");
                followingRef.current?.classList.toggle("active");
                setDisplay(userProfile.following);
              }}
            >
              Following {userProfile.following.length}
            </p>
            <span className="slider" style={{}}></span>
          </div>
          <div className="users h-[80%] flex flex-col items-center justify-start overflow-scroll">
            {display && display.length > 0 && (
              <Users
                usersList={display}
                Event={toUserProfile}
                type={"follow"}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Profile = () => {
  let { user } = useParams();
  const dispatch = useDispatch();
  const [followModal, setFollowModal] = useState<boolean>(false);
  const optionsRef = useRef<HTMLDivElement>(null);
  const [isPost, setIsPost] = useState<boolean>(true);
  const [userProfile, setUserProfile] = useState<userProfileState | undefined>(
    undefined
  );
  const posts = useSelector(
    (state: { content: ContentsInterface }) =>
      user && getPosts(filterByUserId(state.content, user))
  );
  const Curruser = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const replies = useSelector(
    (state: { content: ContentsInterface }) =>
      user && getReplies(filterByUserId(state.content, user), user)
  );

  const optionToggle = () => {
    optionsRef.current?.classList.toggle("optons-active");
  };

  const getUser = () => {
    axios
      .post(`${import.meta.env.VITE_SERVER_API}/user/get-users?user=${user}`)
      .then((res) => {
        setUserProfile(res.data);
      });
  };
  useEffect(() => {
    if (user === Curruser.uid) dispatch(setLoadSelection(null));
    if (user !== Curruser.uid) getUser();
  }, [user]);

  return (
    <>
      <div className="profile-wrapper">
        <div className="flex">
          <div className="profile-content">
            <ProfileHeader
              userProfile={user === Curruser.uid ? Curruser : userProfile}
              setFollowModal={setFollowModal}
            />
            {isPost ? (
              posts && posts.length > 0 ? (
                <PostsContext.Provider value={posts}>
                  <Posts />
                </PostsContext.Provider>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <h1 className="text-sm lg:text-xl">No post yet.</h1>
                </div>
              )
            ) : replies && replies.length > 0 ? (
              <PostsContext.Provider value={replies}>
                <Posts />
              </PostsContext.Provider>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <h1 className="text-sm lg:text-xl">No replies yet.</h1>
              </div>
            )}
          </div>
          <div className="options" ref={optionsRef} onClick={optionToggle}>
            <ul>
              <li
                className="ripple-effect"
                onClick={(e) => {
                  createRippleEffect(e);
                  setIsPost(true);
                }}
                style={{
                  color: `${isPost ? Curruser.website_accent : "white"}`,
                }}
              >
                <p>Posts</p>
              </li>
              <li
                className="ripple-effect"
                onClick={(e) => {
                  createRippleEffect(e);
                  setIsPost(false);
                }}
                style={{
                  color: `${!isPost ? userProfile?.website_accent : "white"}`,
                }}
              >
                <p>Replies</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
      {followModal && userProfile ? (
        <FollowComponent
          setFollowModal={setFollowModal}
          userProfile={user === Curruser.uid ? Curruser : userProfile}
        />
      ) : (
        <></>
      )}
    </>
  );
};

export default Profile;
