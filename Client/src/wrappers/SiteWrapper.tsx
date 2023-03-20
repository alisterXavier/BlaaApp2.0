import {
  getDoc,
  doc,
  onSnapshot,
  collection,
  DocumentReference,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import Home from "../components/Home/Home";
import Navbar from "../components/Navbar/Navbar";
import {
  ContentInterface,
  ContentsInterface,
  chatInterface,
  userProfileState,
} from "../Types/type";
import { setContent } from "../features/ContentReducer";
import { init } from "../features/userProfileReducer";
import { auth, db } from "../firebase/firebase";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import Settings from "../components/Settings/Settings";
import { formatDateInObj } from "../utils/helperFn";
import {
  EnlargeImage,
  NavbarContext,
  ReplyPostAndSelectPostContext,
} from "../utils/ContextApi";
import Chats from "../components/Chats/Chats";
import { ChatInit } from "../features/ChatReducer";
import Profile from "../components/Profile/Profile";
import { changeSelection } from "../features/NavReducer";
import { Post } from "../components/Posts/Post";
import { NewPost } from "../components/NewPost";
import Slider from "../components/Swiper";
import SelectUser from "../components/LoginAndCreate/SelectUser";
import {
  useMobileSize,
  useReplyToggle,
  useSelectPost,
} from "../utils/Hooks";
import { AiOutlineMenu } from "react-icons/ai";

const SiteWrapper = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [enlargeImage, setEnlargeImage] = useState<Array<string>>([]);
  const [selectPost, setPostId] = useSelectPost();
  const [postModal, setTogglePost] = useState(false);
  const [replyModal, setToggleReply] = useState(false);
  const isMobileSize = useMobileSize();
  const [navOpen, setNavOpen] = useState<boolean>(false);
  const loading = useSelector(
    (state: { userProfile: { loading: boolean } }) => state.userProfile.loading
  );
  const userProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const selectNavOption = (id: string) => {
    if (id !== "post")
      if (id === "home") navigate("/");
      else if (id === "profile") navigate(`/${id}/${auth.currentUser?.uid}`);
      else if (id !== "logOut") navigate(`/${id}`);
    dispatch(changeSelection({ id: id }));
  };

  const setChats = async () => {
    onSnapshot(collection(db, "chats"), async (change) => {
      var nwChange: Array<chatInterface> = [];
      change.forEach((c) => {
        nwChange.push(c.data() as chatInterface);
      });

      const filteredNwChange = await Promise.all(
        nwChange
          .filter(
            (c) =>
              auth.currentUser &&
              (c.userDetails as unknown as Array<string>).includes(
                auth.currentUser.uid
              )
          )
          .map(async (d) => {
            return {
              ...d,
              userDetails: await Promise.all(
                d.userDetails.map(async (user) => {
                  const res = await getDoc(doc(db, `users/${user}`));
                  const data = res.data();
                  return {
                    username: data?.username,
                    website_accent: data?.website_accent,
                    uid: data?.uid,
                    profilePicture: data?.profilePicture,
                  };
                })
              ),
              conversation: d.conversation
                ?.map((item) => formatDateInObj(item))
                .sort(
                  (a, b) =>
                    new Date(b.date).valueOf() - new Date(a.date).valueOf()
                ),
            };
          })
      );

      dispatch(ChatInit({ chats: filteredNwChange }));
    });
  };

  const setPosts = async () => {
    onSnapshot(collection(db, "posts"), (change) => {
      var sorted: ContentsInterface = [];
      change.forEach((c) => sorted.push(c.data() as ContentInterface));
      sorted = sorted
        .sort((a, b) => new Date(b.date).valueOf() - new Date(a.date).valueOf())
        .map((item: ContentInterface) => formatDateInObj(item));
      dispatch(setContent({ data: sorted }));
    });
  };

  const setUser = async () => {
    const user = auth.currentUser?.uid;
    if (user)
      onSnapshot(doc(db, "users", user), (change) => {
        if (change) {
          const nData = {
            ...change.data(),
            chatIds: change
              .data()
              ?.chatIds?.map((res: DocumentReference) => res.path),
          };
          dispatch(init(nData));
        }
      });
  };

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        setUser();
      } else {
        dispatch(init(false));
      }
      setPosts();
    });
  }, []);

  useEffect(() => {
    userProfile.chatIds && setChats();
  }, [userProfile]);

  return (
    <div className={`main-wrapper relative ${navOpen ? "nav-active" : ""}`}>
      <>
        {userProfile.username?.length === 0 ? (
          <SelectUser />
        ) : (
          <NavbarContext.Provider value={selectNavOption}>
            <ReplyPostAndSelectPostContext.Provider
              value={{
                selectPost,
                setPostId,
                replyModal,
                setToggleReply,
                postModal,
                setTogglePost
              }}
            >
              {!loading && <Navbar navOpen={navOpen} setNavOpen={setNavOpen} />}
              <EnlargeImage.Provider value={{ enlargeImage, setEnlargeImage }}>
                <div className="content-wrapper">
                  {isMobileSize && (
                    <AiOutlineMenu
                      size={30}
                      onClick={() => {
                        setNavOpen(!navOpen);
                      }}
                      className="fixed top-5 left-2 z-10"
                    />
                  )}
                  <Routes>
                    <Route path="/" element={<Home />}></Route>
                    <Route path="/content=:id" element={<Post />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/chats/*" element={<Chats />}></Route>
                    <Route path="/profile/*">
                      <Route path=":user/*" element={<Profile />} />
                    </Route>
                  </Routes>
                </div>
                {replyModal && <NewPost user={userProfile} type="reply" />}
                {postModal && <NewPost user={userProfile} type="newPost" />}
                {enlargeImage.length > 0 && (
                  <div className="bigger-image">
                    <Slider />
                  </div>
                )}
              </EnlargeImage.Provider>
            </ReplyPostAndSelectPostContext.Provider>
          </NavbarContext.Provider>
        )}
      </>
    </div>
  );
};

export default SiteWrapper;
