import { useState, useRef, useEffect } from "react";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { AiOutlineGoogle } from "react-icons/ai";
import "@/styles/Login.css";
import { auth, db, googleProvider } from "../../firebase/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { EventProp, userProfileState } from "../../Types/type";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { toastFn } from "../../utils/Toast";

const randomAvatar = (email: string | null) => {
  var randomColor = () => Math.floor(Math.random() * 16777215).toString(16);
  return `https://ui-avatars.com/api/?background=${randomColor()}&color=${randomColor()}&name=${email?.substring(
    0,
    4
  )}`;
};

const LoginPage = ({ handleSwitch, loginResponse, loading }: EventProp) => {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean>(false);
  const [usernameToggle, setUserNameToggle] = useState<boolean>(false);
  const [passwordToggle, setPasswordToggle] = useState<boolean>(false);
  const [username, setuserName] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const passwordRef = useRef<HTMLLabelElement>(null);
  const emailRef = useRef<HTMLLabelElement>(null);
  const [Switch, setSwitch] = useState<boolean>(false);
  const loginFadeRef = useRef<
    Array<
      | HTMLHeadingElement
      | HTMLLabelElement
      | HTMLButtonElement
      | HTMLAnchorElement
      | null
    >
  >([]);
  const createFadeRef = useRef<
    Array<
      | HTMLHeadingElement
      | HTMLLabelElement
      | HTMLButtonElement
      | HTMLAnchorElement
      | null
    >
  >([]);

  const Lresponse = (value: boolean | null) => {
    loginResponse(value);
  };

  const credentialWarn = () => {
    emailRef.current?.classList.add("warn");
    passwordRef.current?.classList.add("warn");
    setTimeout(() => {
      emailRef.current?.classList.remove("warn");
      passwordRef.current?.classList.remove("warn");
      Lresponse(null);
    }, 2000);
  };

  const storeUser = async (userData: userProfileState) => {
    const ref = collection(db, "users");
    const queryRes = query(ref, where("email", "==", userData.email));
    const queryDoc = await getDocs(queryRes);
    var EmailExists = false;
    
    queryDoc.forEach((w) => {
      EmailExists = true;
    });

    !EmailExists &&
      userData.uid &&
      (await setDoc(doc(db, "users", userData.uid), userData));
  };

  const handleSignUp = async () => {
    if (username.length > 0 && password.length > 5) {
      createUserWithEmailAndPassword(auth, username, password)
        .then((userCred) => {
          storeUser({
            uid: userCred.user.uid,
            chatIds: [],
            posts: [],
            profilePicture: randomAvatar(userCred.user.email),
            replies: [],
            email: userCred.user.email,
            username: "",
            website_accent: "#14FF00",
            following: [],
            followers: [],
            layout: "Default",
          });
          toastFn("Account created.", "success");
        })
        .catch((err) => {
          if (err.code === "auth/email-already-in-use")
            toastFn("Email exists.", "error");
          Lresponse(false);
          credentialWarn();
        });
    } else credentialWarn();
  };

  const googleSignIn = async () => {
    await signInWithPopup(auth, googleProvider)
      .then(async (userCred) => {
        Lresponse(true);
        storeUser({
          uid: userCred.user.uid,
          chatIds: [],
          posts: [],
          profilePicture: userCred.user.photoURL,
          replies: [],
          email: userCred.user.email,
          username: "",
          website_accent: "#14FF00",
          following: [],
          followers: [],
          layout: "Default",
        });
      })
      .catch((err) => {
        console.log(err);
        Lresponse(false);
      })
      .finally(() => {
        loading(false);
      });
  };

  const handleLogin = () => {
    if (username.length > 0 && password.length > 5) {
      loading(true);
      signInWithEmailAndPassword(auth, username, password)
        .then((userCred) => {
          Lresponse(true);
        })
        .catch(async (err) => {
          setTimeout(() => {
            Lresponse(false);
            if (err.code === "auth/invalid-email")
              toastFn("Invalid email.", "error");
            if (err.code === "auth/wrong-password")
              toastFn("Wrong password.", "error");
            credentialWarn();
          }, 2000);
        })
        .finally(() => {
          setTimeout(() => {
            loading(false);
          }, 2000);
        });
    } else {
      credentialWarn();
    }
  };

  const SignUpSwitch = () => {
    loginFadeRef.current.forEach((element) => {
      element?.classList.remove("delay");
      element?.classList.add("login-fade-out");
    });
    createFadeRef.current.forEach((element) => {
      element?.classList.add("create-fade-in");
    });
    handleSwitch();
  };

  const LoginSwitch = () => {
    loginFadeRef.current.forEach((element) => {
      element?.classList.remove("login-fade-out");
      element?.classList.add("delay");
    });
    createFadeRef.current.forEach((element) => {
      element?.classList.remove("create-fade-in");
    });
  };

  useEffect(() => {
    Switch ? SignUpSwitch() : LoginSwitch();
  }, [Switch]);

  return (
    <>
      <div className="title my-3 flex items-center relative w-full">
        <h1
          className={`login-content text-4xl mx-2 font-bold`}
          ref={(e) => {
            loginFadeRef.current[0] = e;
          }}
        >
          Login
        </h1>
        <h1
          className="create-content text-4xl mx-2 font-bold"
          ref={(e) => {
            createFadeRef.current[0] = e;
          }}
        >
          Create
        </h1>
      </div>
      <div className="flex flex-col">
        <label
          className="my-4 flex items-center user-pass-wrapper p-3"
          ref={emailRef}
        >
          <p className={`placeholder ${usernameToggle && "active"}`}>Email</p>
          <input
            className="rounded user-pass-input"
            type="text"
            onClick={(e) => {
              if (username.length === 0) {
                const value = !usernameToggle;
                if (!value) e.currentTarget.blur();
                setUserNameToggle(!usernameToggle);
              }
              if (password.length === 0) setPasswordToggle(false);
            }}
            onChange={(e) => {
              setuserName(e.currentTarget.value);
            }}
          />
        </label>
        <label
          className="my-4 flex items-center user-pass-wrapper p-3"
          ref={passwordRef}
        >
          <p className={`placeholder ${passwordToggle && "active"}`}>
            Password
          </p>
          <input
            className="rounded user-pass-input"
            type={`${passwordVisibility ? "text" : "password"}`}
            onClick={(e) => {
              const value = !passwordToggle;
              if (password.length === 0) {
                if (!value) {
                  e.currentTarget.blur();
                }
                setPasswordToggle(!passwordToggle);
              }
              if (username.length === 0) setUserNameToggle(false);
            }}
            onChange={(e) => {
              setPassword(e.currentTarget.value);
            }}
          />
          {passwordVisibility ? (
            <AiFillEyeInvisible
              className="cursor-pointer relative z-10"
              size={20}
              onClick={(e) => {
                e.preventDefault();
                setPasswordVisibility(false);
              }}
            />
          ) : (
            <AiFillEye
              className="cursor-pointer relative z-10"
              size={20}
              onClick={(e) => {
                e.preventDefault();
                setPasswordVisibility(true);
              }}
            />
          )}
        </label>
      </div>
      <div className="w-full">
        <div className="w-full flex items-center overflow-hidden relative buttons">
          <button
            className="login-content w-full btn my-2 mr-4 login-btn border-none"
            onClick={handleLogin}
            ref={(e) => {
              loginFadeRef.current[1] = e;
            }}
          >
            Login
          </button>
          <button
            className="signUp-btn btn create-content my-2 w-full border-none"
            onClick={handleSignUp}
            ref={(e) => {
              createFadeRef.current[1] = e;
            }}
          >
            Sign Up
          </button>
        </div>
        <button
          className="flex btn justify-between items-center px-2 bg-blue-600 border-none"
          onClick={googleSignIn}
        >
          <AiOutlineGoogle size={20} className="" />
          <p className="mx-1">Google</p>
        </button>
        <div className="w-full flex justify-center my-3 relative links">
          <a
            className="login-content cursor-pointer mr-3"
            onClick={() => {
              setSwitch(!Switch);
            }}
            ref={(e) => {
              loginFadeRef.current[2] = e;
            }}
          >
            Sign up
          </a>
          <a
            className="create-content cursor-pointer"
            ref={(e) => {
              createFadeRef.current[2] = e;
            }}
            onClick={() => {
              setSwitch(!Switch);
            }}
          >
            Login In
          </a>
        </div>
      </div>
    </>
  );
};

export default LoginPage;
