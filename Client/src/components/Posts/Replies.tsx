import { useNavigate } from "react-router-dom";
import { ContentInterface } from "../../Types/type";
import {
  EnlargeImage,
  ReplyPostAndSelectPostContext,
} from "../../utils/ContextApi";
import { useContext } from "react";
import { formatDate } from "../../utils/helperFn";
import "@/styles/posts.css";
import Buttons from "../Buttons";

const Replies = ({ reply }: { reply: ContentInterface }) => {
  const navigate = useNavigate();
  const { setPostId } = useContext(ReplyPostAndSelectPostContext);
  const { setEnlargeImage } = useContext(EnlargeImage);
  return (
    <div
      className="reply p-5 cursor-pointer"
      onClick={() => {
        setPostId(reply.id);
        navigate(`/content=${reply.id}`);
      }}
      style={{ borderBottom: "1px solid" }}
    >
      <div className="reply-details flex items-end">
        <figure className="userprofile">
          <img className="" src={reply.userprofile}></img>
        </figure>
        <div className="text-start ml-2">
          <a
            href={`/profile/${reply.uid}`}
            className="reply-username decoration-none"
          >
            {reply.username}
          </a>
          <p className="reply-date">{formatDate(reply?.date)}</p>
        </div>
      </div>
      <div className="reply-content max-h-[300px] overflow-hidden flex flex-col items-start justify-start mt-5">
        <p className="whitespace-pre-line text-left">{reply.content}</p>
        <div className="reply-content-image flex mt-5 w-full">
          {reply.images?.slice(0, 4).map((image, index) => (
            <figure
              className="m-2 overflow-hidden"
              onClick={(e) => {
                e.stopPropagation();
                reply.images && setEnlargeImage(reply.images);
              }}
            >
              <img
                src={image}
                onClick={(e) => {
                  e.preventDefault();
                }}
              ></img>
              {reply.images?.length && index === 3 && (
                <div
                  className="more-images flex items-center justify-center cursor-pointer"
                  onClick={(e) => {
                    e.stopPropagation();
                    reply.images && setEnlargeImage(reply.images);
                  }}
                >
                  <p className="">More images</p>
                </div>
              )}
            </figure>
          ))}
        </div>
      </div>
      <div className="reply-btns">
        <Buttons post={reply} />
      </div>
    </div>
  );
};

export default Replies;
