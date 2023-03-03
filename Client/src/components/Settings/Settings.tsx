import { useDispatch, useSelector } from "react-redux";
import { userProfileState } from "../../Types/type";
import "@/styles/Settings.css";
import { useEffect, useRef, useState } from "react";
import { deleteUser, updatePassword } from "firebase/auth";
import { auth, db, storage } from "../../firebase/firebase";
import { toastFn } from "../../utils/Toast";
import { createRippleEffect } from "../../utils/helperFn";
import { UploadImageToStorage } from "../../utils/requests";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { BsFillGrid1X2Fill } from "react-icons/bs";
import { AiOutlineDelete, AiOutlineMenu } from "react-icons/ai";
import { ref } from "firebase/storage";
import { setLoadSelection } from "../../features/NavReducer";
import { useMobileSize, useStyle } from "../../utils/Hooks";
import UsernameComp from "../NewUsername";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const user = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isDisplay, setIsDisplay] = useState<boolean>(true);
  const [isAccount, setIsAccount] = useState<boolean>(false);
  const [tempAccent, setTempAccent] = useState<string | null>();
  const isMobile = useMobileSize();
  const [newPassword, setNewPassword] = useState<string>("");
  const [layoutSwitch, setLayoutSwitch] = useState<boolean>(
    user.layout === "Masonry"
  );
  const inputUploadRef = useRef<HTMLInputElement>(null);
  const profilePictureRef = useRef<HTMLDivElement>(null);
  const style = useStyle();

  const uploadImage = (e: HTMLInputElement) => {
    if (inputUploadRef.current?.files && inputUploadRef.current.files[0]) {
      const url = URL.createObjectURL(inputUploadRef.current.files[0]);
      profilePictureRef.current?.style.setProperty(
        "--profilePic",
        `url("${url}")`
      );
    }
  };

  const changeProfile = async () => {
    if (inputUploadRef.current?.files) {
      if (inputUploadRef.current?.files?.length > 0) {
        if (inputUploadRef.current?.files !== null && auth.currentUser) {
          var img = inputUploadRef.current?.files[0];
          const url = await UploadImageToStorage(img, "Profile picture");
          if (url) {
            var imgRef = ref(
              storage,
              `Profile picture/${auth.currentUser.uid}`
            );
            await updateDoc(doc(db, "users", auth.currentUser.uid), {
              profilePicture: url,
            }).then(() => {
              toastFn("Profile picture changed", "success");
            });
          }
        }
      } else toastFn("Enter a valid image", "error");
    }
  };

  const resetPassword = () => {
    if (newPassword.length > 5) {
      if (auth.currentUser) {
        const user = auth.currentUser;
        updatePassword(user, newPassword)
          .then((res) => {
            toastFn("Password changed", "200");
          })
          .catch((err) => {
            toastFn(err.code, "404");
          });
      }
    } else toastFn("Enter a valid pasword", "error");
  };

  const changeWebAccent = async () => {
    if (auth.currentUser) {
      var userRef = doc(db, "users", auth.currentUser?.uid);
      await updateDoc(userRef, {
        website_accent: tempAccent,
      })
        .then(() => {
          toastFn("Accent changed", "200");
        })
        .catch((err) => {
          toastFn(err.code, "error");
        });
    }
  };

  const changeGrid = async (value: boolean) => {
    if (auth.currentUser) {
      var userRef = doc(db, "users", auth.currentUser?.uid);
      if (value) {
        if (isMobile) {
          toastFn("Layout not available for mobile", "error");
        } else {
          await updateDoc(userRef, {
            layout: "Masonry",
          })
            .then(() => {
              toastFn("Layout changed", "200");
            })
            .catch((err) => {
              toastFn(err.code, "error");
            });
        }
      } else {
        await updateDoc(userRef, {
          layout: "Default",
        })
          .then(() => {
            toastFn("Layout Changed", "200");
          })
          .catch((err) => {
            toastFn(err.code, "error");
          });
      }
    }
  };

  const deleteAccount = async () => {
    if (auth.currentUser) {
      const user = auth.currentUser;

      // deletes user auth
      const deleteUserAuth = () => user.delete();

      const deleteChatHistory = async () => {
        // delete/exits frrom chats
        const chatLists = query(
          collection(db, "chats"),
          where("userDetails", "array-contains", user.uid)
        );
        await getDocs(chatLists).then(async (res) => {
          res.forEach(async (data) => {
            const chatData = data.data();
            if (chatData.userDetails.length > 2) {
              axios.post(`${import.meta.env.VITE_API}/chats/exit-conversation`, {
                chatsId: chatData.chatId,
                uid: user.uid,
              });
            } else {
              await deleteDoc(data.ref);
            }
          });
        });
      };

      const deletePostHistory = async () => {
        // deletes all posts and replies made by user
        const contentLists = query(
          collection(db, "posts"),
          where("uid", "==", user.uid)
        );
        await getDocs(contentLists).then(async (res) => {
          res.forEach(async (data) => {
            await deleteDoc(data.ref);
          });
        });
      };
      // deletes user
      const deleteUserProfile = async () =>
        await deleteDoc(doc(db, "users", user.uid));

      Promise.all([
        deleteUserAuth(),
        deleteChatHistory(),
        deletePostHistory(),
        deleteUserProfile(),
      ]).then(() => {
        navigate("/");
        toastFn("Account deleted", "200");
      });
    }
  };

  useEffect(() => {
    user && setTempAccent(user.website_accent);
  }, [user.website_accent]);
  useEffect(() => {
    dispatch(setLoadSelection(null));
  }, []);

  return (
    <div className="content justify-center flex-col-reverse items-center lg:items-start lg:flex-row">
      <div className="settings-wrapper">
        <ul
          className="settings flex flex-col items-start justify-evenly p-5 lg:p-10 lg:mt-0 mt-10"
          style={{ border: `${style?.border}` }}
        >
          {user && isDisplay ? (
            <>
              <li className="color-picker flex flex-col justify-start items-start lg:mb-0 mb-5">
                <h1 className="text-start text-xl lg:text-3xl">
                  Change accent
                </h1>
                <div className="flex flex-col lg:flex-row lg:items-center">
                  <input
                    className="my-5 mr-5"
                    type="color"
                    id="colorpicker"
                    onChange={(e) => {
                      setTempAccent(e.currentTarget.value);
                    }}
                    value={`${tempAccent}`}
                    disabled={isMobile ? true : false}
                  ></input>
                  <input
                    type="text"
                    value={`${tempAccent || ""}`}
                    onChange={(e) => setTempAccent(e.currentTarget.value)}
                  ></input>
                  <button
                    className="ripple-effect btn mx-5"
                    onClick={(e) => {
                      changeWebAccent();
                      createRippleEffect(e);
                    }}
                  >
                    Save
                  </button>
                </div>
              </li>
              <li className="color-picker flex flex-col justify-start items-start lg:mt-0 mt-10">
                <h1 className="text-start text-xl lg:text-3xl">
                  Change layout view
                </h1>
                <div className="flex items-center my-5">
                  <div className="layout-switch flex items-center justify-evenly">
                    <div
                      className={`layout-option ${
                        !layoutSwitch && "active"
                      } mx-2 w-1/2 h-full flex items-center justify-center cursor-pointer`}
                      onClick={() => {
                        setLayoutSwitch(false);
                        changeGrid(false);
                      }}
                    >
                      <AiOutlineMenu size={20} />
                    </div>
                    <div
                      className={`layout-option ${
                        layoutSwitch && "active"
                      } mx-2 w-1/2 h-full flex items-center justify-center cursor-pointer`}
                      onClick={() => {
                        setLayoutSwitch(true);
                        changeGrid(true);
                      }}
                    >
                      <BsFillGrid1X2Fill size={20} />
                    </div>
                    <span
                      className={`slider`}
                      style={{ background: `${user.website_accent}` }}
                    ></span>
                  </div>
                </div>
              </li>
            </>
          ) : (
            isAccount && (
              <>
                <li className="flex flex-col profile-pic mt-3">
                  <h1 className="text-start text-xl lg:text-3xl">
                    Change profile picture
                  </h1>
                  <div className="flex items-end my-3">
                    <div
                      className="img relative"
                      style={{ border: `${style?.border}` }}
                      ref={profilePictureRef}
                    >
                      <input
                        className="absolute left-0 z-10"
                        ref={inputUploadRef}
                        onChange={(e) => uploadImage(e.currentTarget)}
                        type="file"
                        accept="image/*"
                      />
                    </div>
                    <button
                      className="ripple-effect btn ml-4"
                      onClick={(e) => {
                        changeProfile();
                        createRippleEffect(e);
                      }}
                    >
                      Change
                    </button>
                  </div>
                </li>
                <li className="flex flex-col items-start mt-3">
                  <h1 className="text-start text-xl lg:text-3xl">
                    Reset password
                  </h1>
                  <input
                    type="password"
                    className="my-5"
                    onChange={(e) => {
                      setNewPassword(e.currentTarget.value);
                    }}
                  ></input>
                  <button
                    className="ripple-effect btn reset-btn"
                    onClick={(e) => {
                      resetPassword();
                      createRippleEffect(e);
                    }}
                  >
                    Reset
                  </button>
                </li>
                <li className="flex flex-col items-start mt-3">
                  <h1 className="text-start text-xl lg:text-3xl">
                    Change username
                  </h1>
                  <UsernameComp />
                </li>
                <li className="flex flex-col items-start mt-3">
                  <h1 className="-start text-xl lg:text-3xl">Delete Account</h1>
                  <button
                    className="flex items-center ripple-effect btn"
                    onClick={(e) => {
                      createRippleEffect(e);
                      deleteAccount();
                    }}
                  >
                    <AiOutlineDelete size={20} />
                    Delete
                  </button>
                </li>
              </>
            )
          )}
        </ul>
      </div>
      <div className="options w-full lg:w-[20%]">
        <ul className="w-[90%] lg:w-[200px]">
          <li
            className="ripple-effect option-item"
            onClick={(e) => {
              createRippleEffect(e);
              setIsDisplay(true);
              setIsAccount(false);
            }}
          >
            <p
              className=""
              style={{
                color: `${isDisplay ? user.website_accent : "white"}`,
              }}
            >
              Display
            </p>
          </li>
          <li
            className="ripple-effect option-item"
            onClick={(e) => {
              createRippleEffect(e);
              setIsAccount(true);
              setIsDisplay(false);
            }}
          >
            <p
              style={{
                color: `${isAccount ? user.website_accent : "white"}`,
              }}
            >
              Account
            </p>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Settings;
