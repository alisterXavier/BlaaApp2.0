import "@/styles/chats.css";
import { useDispatch, useSelector } from "react-redux";
import {
  chatInterface,
  userProfileState,
  userProfilesState,
} from "../../Types/type";
import { BsThreeDotsVertical } from "react-icons/bs";
import { FaTelegramPlane } from "react-icons/fa";
import { auth } from "../../firebase/firebase";
import axios from "axios";
import { createRippleEffect } from "../../utils/helperFn";
import { useContext, useEffect, useRef, useState } from "react";
import { toastFn } from "../../utils/Toast";
import { Route, Routes, useNavigate, useParams } from "react-router-dom";
import { RxArrowRight, RxCross2 } from "react-icons/rx";
import { Users } from "../Search/Search";
import { setLoadSelection } from "../../features/NavReducer";
import UploadImage from "../UploadImage";
import EmojiComp from "../EmojiComp";
import { UploadImageToStorage, messageUser } from "../../utils/requests";
import { FormatContent } from "../FormatContent";
import { EnlargeImage } from "../../utils/ContextApi";
import { selectChatById } from "../../features/ChatReducer";
import { ChatSkeleton } from "../Skeleton";
import { useMobileSize, useStyle } from "../../utils/Hooks";

var searchTimer: ReturnType<typeof setTimeout>;

const SendMessage = ({ chatId }: { chatId: string | undefined }) => {
  const navigate = useNavigate();
  const [searchUser, setSearchUser] = useState<string>("");
  const [userList, setUserlist] = useState<userProfilesState>([]);

  const addToList = (user: userProfileState) => {
    if (userList.includes(user))
      setUserlist((prev) => prev.filter((p) => p.uid !== user.uid));
    else setUserlist((prev) => [...prev, user]);
  };

  return (
    <div className="send-message-wrapper">
      <div className="send-message p-5">
        <div className="cross w-full relative">
          <RxCross2
            size={30}
            onClick={() => [navigate(-1)]}
            className="cursor-pointer absolute right-0"
          />
        </div>
        <div className="w-full h-96">
          <input
            type="text"
            placeholder="Enter user"
            onChange={(e) => {
              const { value } = e.currentTarget;
              if (searchTimer) clearTimeout(searchTimer);
              setTimeout(() => {
                setSearchUser(value);
              }, 1500);
            }}
          />
          <div className="selected-users my-3 p-3 flex bg-black">
            {userList.map((user) => {
              return (
                <p
                  style={{ color: `${user.website_accent}` }}
                  className="mx-2 cursor-pointer"
                  onClick={() => {
                    addToList(user);
                  }}
                >
                  {user.username}
                </p>
              );
            })}
          </div>
          <div className="results-wrapper flex flex-col items-center justify-start p-5 bg-black">
            {searchUser.length > 0 && (
              <Users searchContent={searchUser} Event={addToList} />
            )}
          </div>
          <div className="w-full">
            <button
              className="w-full btn ripple-effect my-2"
              onClick={() => {
                messageUser(userList, chatId);
                createRippleEffect();
              }}
            >
              Message users
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const Conversation = ({
  chatId,
  setChatId,
}: {
  chatId: string;
  setChatId: (
    value:
      | string
      | undefined
      | ((preVar: string | undefined) => string | undefined)
  ) => void;
}) => {
  const navigate = useNavigate();
  const userProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const chatConversation = useSelector(
    (state: { chats: Array<chatInterface> }) =>
      selectChatById(chatId, state.chats)
  );
  const isMobile = useMobileSize();
  const { setEnlargeImage } = useContext(EnlargeImage);
  const [chatOptionsToggle, setChatOptionsToggle] = useState<boolean>(false);
  const [images, setImages] = useState<FileList | null>();
  const [content, setContent] = useState<string>("");
  const style = useStyle();

  const sendtext = async () => {
    if (
      auth.currentUser &&
      (content.length > 0 || (images && images?.length > 0))
    ) {
      const imagesUrl: Array<string> = [];
      images &&
        images.length > 0 &&
        (await Promise.all(
          Object.keys(images).map(async (image) =>
            imagesUrl.push(
              (await UploadImageToStorage(
                images[image as any],
                "chats"
              )) as string
            )
          )
        ));

      const data = {
        uid: chatId,
        conversation: {
          userId: `users/${auth.currentUser.uid}`,
          date: new Date().toISOString(),
          content: content,
          images: imagesUrl,
          username: userProfile.username,
        },
      };
      axios
        .post(`${import.meta.env.VITE_SERVER_API}/chats/text`, data)
        .then(() => {
          setContent("");
        });
    }
  };

  const deleteChat = () => {
    if (chatConversation) {
      const data = {
        uid: auth.currentUser?.uid,
        chatId: chatConversation.chatId,
      };
      if (chatConversation.userDetails.length > 2) {
        axios
          .post(
            `${import.meta.env.VITE_SERVER_API}/chats/exit-conversation`,
            data
          )
          .then((res) => {
            setChatId(undefined);
            toastFn("Conversation deleted successfully", "succcess");
          });
      } else if (chatConversation.userDetails.length === 2) {
        axios
          .post(
            `${import.meta.env.VITE_SERVER_API}/chats/delete-conversation`,
            data
          )
          .then((res) => {
            setChatId(undefined);
            toastFn("Conversation deleted successfully", "succcess");
          });
      }
    }
  };

  return chatConversation ? (
    <>
      <div
        className="conversation-name w-full lg:w-[80%] p-5 flex items-center justify-between"
        style={{ border: `${style?.border}` }}
      >
        <div className="w-[40%] flex]">
          <h1 className="w-full text-ellipsis overflow-hidden lg:text-3xl text-xl">
            {chatConversation.userDetails
              .filter((user) => user.uid !== auth.currentUser?.uid)
              .map((user) => `${user.username} `)}
          </h1>
        </div>
        <div className="flex items-center">
          <div className="chat-options cursor-pointer">
            <div className="w-[50px]">
              <BsThreeDotsVertical
                size={20}
                style={{ color: `${userProfile.website_accent}` }}
                onClick={() => {
                  setChatOptionsToggle(!chatOptionsToggle);
                }}
              />
            </div>
            <div
              className={`options ${
                chatOptionsToggle && "active"
              } flex flex-col`}
            >
              <div
                className="details flex items-center justify-end"
                onClick={(e) => {}}
              >
                <p>Details</p>
              </div>
              <div
                className="details flex items-center justify-end"
                onClick={(e) => {
                  setChatOptionsToggle(false);
                  navigate("/chats/send-message");
                }}
              >
                <p>Add to conversation</p>
              </div>
              <div
                className="delete flex items-center justify-end"
                onClick={(e) => {
                  deleteChat();
                }}
              >
                <p>
                  {chatConversation.userDetails.length > 2
                    ? "Exit group"
                    : "Delete"}
                </p>
              </div>
            </div>
          </div>
          {isMobile && (
            <div
              className="w-[10%]"
              onClick={() => {
                setChatId(undefined);
              }}
            >
              <RxArrowRight size={30} />
            </div>
          )}
        </div>
      </div>
      <div className="texts flex flex-col-reverse items-center mt-5">
        {chatConversation.conversation?.map((convo) => {
          return (
            <div className="text relative">
              <div
                className={`flex justify-end ${
                  convo.userId?.substring(convo.userId.indexOf("/") + 1) ===
                  auth.currentUser?.uid
                    ? "items-end send"
                    : "items-start receive"
                } flex-col my-5`}
              >
                <div
                  className="p-2 inner-text"
                  style={{
                    border: `1px solid ${userProfile.website_accent}`,
                  }}
                >
                  {FormatContent(convo.content)}
                  <div className="mt-2">
                    {convo.images && convo.images.length > 0 && (
                      <figure
                        onClick={() => {
                          convo.images && setEnlargeImage([convo.images]);
                        }}
                      >
                        <img src={convo.images} />
                      </figure>
                    )}
                  </div>
                  <p className="text-right date">{convo.date}</p>
                </div>
                <p
                  className="from"
                  style={{ color: `${userProfile.website_accent}` }}
                >
                  {convo.username}
                </p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="flex items-center message-box-container">
        <div className="message-wrapper flex w-full">
          <div className="w-full flex items-center">
            <textarea
              placeholder="Enter Text"
              value={content}
              onChange={(e) => setContent(e.currentTarget.value)}
            />
            <div className="flex justify-evenly items-center w-[40%] lg:w-[20%] h-full">
              <EmojiComp content={content} setContent={setContent} />
              <UploadImage setImages={setImages} />
            </div>
          </div>
          <button className="btn" onClick={sendtext}>
            <FaTelegramPlane />
          </button>
        </div>
      </div>
    </>
  ) : (
    <ChatSkeleton></ChatSkeleton>
  );
};

const ChatList = ({
  chatId,
}: {
  chatId: (
    value:
      | undefined
      | string
      | ((preVar: string | undefined) => string | undefined)
  ) => void;
}) => {
  const navigate = useNavigate();
  const chatList = useSelector(
    (state: { chats: Array<chatInterface> }) => state.chats
  );

  return (
    <div className="chat-list flex flex-col bg-black">
      {chatList?.map((chat) => {
        return (
          <div
            className="flex cursor-pointer h-[100px] w-full p-5 items-center ripple-effect"
            onClick={(e) => {
              createRippleEffect(e);
              navigate(`${chat.chatId}`);
              chatId(chat.chatId);
            }}
          >
            <figure>
              <img
                alt="image"
                src={`${
                  chat.userDetails.filter(
                    (user) => user.uid !== auth.currentUser?.uid
                  )[0].profilePicture
                }`}
              ></img>
            </figure>
            <p className="pl-3 w-fit text-ellipsis">
              {chat.userDetails
                .filter((user) => user.uid !== auth.currentUser?.uid)
                .map((user) => `${user.username} `)}
            </p>
          </div>
        );
      })}
      <div className="send-message">
        <button
          className="ripple-effect btn w-full"
          onClick={(e) => {
            createRippleEffect(e);
            navigate("/chats/send-message");
            chatId(undefined);
          }}
        >
          Send a Message
        </button>
      </div>
    </div>
  );
};

const Chats = () => {
  const url = useParams();
  const [chatId, setChatId] = useState<string | undefined>(() => {
    return url["*"] !== "" ? url["*"] : undefined;
  });
  const isMobile = useMobileSize();
  const dispatch = useDispatch();
  const chatListRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    dispatch(setLoadSelection(null));
  }, []);

  useEffect(() => {
    chatId
      ? chatListRef.current?.classList.remove("select-conversation-active")
      : chatListRef.current?.classList.add("select-conversation-active");
  }, [chatId]);

  return (
    <div
      className="chat-wrapper select-conversation-active flex"
      ref={chatListRef}
    >
      {auth.currentUser && (
        <div className="chat-conversation lg:p-5 flex flex-col items-center lg:justify-center justify-between">
          {chatId ? (
            <Conversation chatId={chatId} setChatId={setChatId} />
          ) : (
            !isMobile && <h1>Select a conversation</h1>
          )}
        </div>
      )}
      <div className="chats">
        <ChatList chatId={setChatId} />
      </div>
      <Routes>
        <Route
          path="/send-message"
          element={<SendMessage chatId={chatId} />}
        ></Route>
      </Routes>
    </div>
  );
};

export default Chats;
