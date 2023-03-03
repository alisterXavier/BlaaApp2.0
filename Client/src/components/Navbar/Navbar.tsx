import {
  AiOutlineHome,
  AiOutlineSetting,
  AiOutlinePoweroff,
} from "react-icons/ai";
import { BsChatDots } from "react-icons/bs";
import { BiChat } from "react-icons/bi";
import "@/styles/nav.css";
import { useDispatch, useSelector } from "react-redux";
import { userProfileState } from "../../Types/type";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
  NavbarContext,
  ReplyPostAndSelectPostContext,
} from "../../utils/ContextApi";
import { init } from "../../features/userProfileReducer";
import { resetChat } from "../../features/ChatReducer";
import { auth } from "../../firebase/firebase";
import { useStyle } from "../../utils/Hooks";
import { navInterface } from "../../features/NavReducer";

const Navbar = ({
  navOpen,
  setNavOpen,
}: {
  navOpen: boolean;
  setNavOpen: (value: boolean | ((preval: boolean) => boolean)) => void;
}) => {
  const dispatch = useDispatch();
  const { postModal, togglePost } = useContext(ReplyPostAndSelectPostContext);
  const selectNavOption = useContext(NavbarContext);
  const style = useStyle();
  const navigate = useNavigate();
  const navState = useSelector((state: { navbar: navInterface }) => state.navbar);
  const userProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const styles = { fill: `${userProfile.website_accent}` };
  const toggleNav = () => {
    setNavOpen(false);
    postModal && togglePost();
  };
  const selectLogIn = () => {
    setTimeout(() => {
      navigate("/login");
    }, 500);
  };

  const logOut = () => {
    localStorage.removeItem("user");
    navigate("/");
    dispatch(init(null));
    dispatch(resetChat(null));
    auth.signOut();
  };

  return (
    <>
      <nav
        className={`nav-wrapper ${
          navOpen && "active"
        } flex justify-center flex-col items-center`}
      >
        <h1
          className={`cursor-default text-xl lg:text-lg text-left leading-none relative z-10`}
          style={{ color: `${userProfile.website_accent}` }}
        >
          {userProfile.username}
        </h1>
        <div
          className="nav flex flex-col justify-start"
          style={{ border: `${style?.border}` }}
        >
          <div className="nav-content">
            <ul className="">
              <li
                className={`nav-item ${navState.home && "selected"}`}
                id="home"
                onClick={(e) => {
                  navigate("/");
                  selectNavOption(e.currentTarget.id);
                  toggleNav();
                }}
              >
                <div>
                  <AiOutlineHome
                    style={navState.home ? styles : {}}
                    size={30}
                  />
                </div>
              </li>
              {userProfile.username && (
                <>
                  <li
                    className={`nav-item ${navState.chats && "selected"}`}
                    id="chats"
                    onClick={(e) => {
                      selectNavOption(e.currentTarget.id);
                      toggleNav();
                    }}
                  >
                    <div>
                      <BiChat style={navState.chats ? styles : {}} size={30} />
                    </div>
                  </li>
                  <li
                    className={`nav-item ${navState.post && "selected"}`}
                    id="post"
                    onClick={(e) => {
                      selectNavOption(e.currentTarget.id);
                      togglePost();
                      toggleNav();
                    }}
                  >
                    <div>
                      <BsChatDots
                        style={navState.post ? styles : {}}
                        size={30}
                      />
                    </div>
                  </li>
                  <li
                    className={`nav-item ${navState.profile && "selected"}`}
                    id="profile"
                    onClick={(e) => {
                      selectNavOption(e.currentTarget.id);
                      toggleNav();
                    }}
                  >
                    <div>
                      <img
                        alt="profile pic"
                        src={`${userProfile.profilePicture}`}
                      ></img>
                    </div>
                  </li>
                  <li
                    className={`nav-item ${navState.settings && "selected"}`}
                    id="settings"
                    onClick={(e) => {
                      selectNavOption(e.currentTarget.id);
                      toggleNav();
                    }}
                  >
                    <div>
                      <AiOutlineSetting
                        style={navState.settings ? styles : {}}
                        size={30}
                      />
                    </div>
                  </li>
                </>
              )}
              <li
                className={`nav-item ${navState.logOut && "selected"}`}
                id="logOut"
                onClick={(e) => {
                  if (userProfile.username) {
                    logOut();
                  } else selectLogIn();
                  toggleNav();
                }}
              >
                <div>
                  <AiOutlinePoweroff
                    style={navState.logOut ? styles : {}}
                    size={30}
                  />
                </div>
              </li>
              <li className="nav-item slider">
                <div
                  style={{
                    border: `3px solid ${userProfile.website_accent}`,
                  }}
                ></div>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
