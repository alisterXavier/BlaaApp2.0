import { AiOutlineHeart, AiOutlineShareAlt } from "react-icons/ai";
import { BsReply } from "react-icons/bs";
import { useSelector } from "react-redux";
import { ContentInterface, userProfileState } from "../Types/type";
import { like } from "../utils/requests";
import { toastFn } from "../utils/Toast";
import "@/styles/posts.css";

const Buttons = ({ post }: { post: ContentInterface }) => {
  const userProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  return (
    <div className="btns mt-5">
      <ul className="like-reply-share flex items-center">
        <li className="like mr-2 flex items-end">
          <AiOutlineHeart
            size={30}
            onMouseEnter={(e) => {
              e.currentTarget.style.setProperty(
                "--accent",
                userProfile.website_accent
              );
            }}
            style={{
              color: `${
                userProfile.uid && post?.likes?.includes(userProfile.uid)
                  ? userProfile.website_accent
                  : "white"
              }`,
            }}
            onClick={(e) => {
              e.preventDefault();
              like(userProfile.uid, post.id);
            }}
          />
          <p className="likes-count ">{post?.likes?.length}</p>
        </li>
        <li
          className="reply flex items-end mx-2"
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <BsReply
            size={30}
            onMouseEnter={(e) => {
              e.currentTarget.style.setProperty(
                "--accent",
                userProfile.website_accent
              );
            }}
            onClick={(e) => {
              e.stopPropagation();
            }}
          />
          <p className="replies-count">
            {post?.replies ? post.replies.length : 0}
          </p>
        </li>
        <li className="share ml-2">
          <AiOutlineShareAlt
            size={30}
            onMouseEnter={(e) => {
              e.currentTarget.style.setProperty(
                "--accent",
                userProfile.website_accent
              );
            }}
            onClick={(e) => {
              e.preventDefault();
              navigator.clipboard.writeText(window.location.href).then(
                function () {
                  toastFn("Link copied", "200");
                },
                function (err) {
                  toastFn("Error while copying link", "404");
                }
              );
            }}
          />
        </li>
      </ul>
    </div>
  );
};

export default Buttons;
