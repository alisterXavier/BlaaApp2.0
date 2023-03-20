import { useContext, useEffect, useState } from "react";
import { auth } from "../firebase/firebase";
import { userProfileState } from "../Types/type";
import EmojiComp from "./EmojiComp";
import UploadImage from "./UploadImage";
import { sendPost, sendReply } from "../utils/requests";
import { RxCross2 } from "react-icons/rx";
import {
  NavbarContext,
  ReplyPostAndSelectPostContext,
} from "../utils/ContextApi";
import { useStyle } from "../utils/Hooks";
import { UploadImagesSwiper } from "./Swiper";

export const NewPost = ({
  user,
  type,
}: {
  user: userProfileState;
  type: string;
}) => {
  const style = useStyle();
  const { setTogglePost, setToggleReply, selectPost } = useContext(
    ReplyPostAndSelectPostContext
  );
  const selectNavOption = useContext(NavbarContext);
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<FileList | null>();
  const [displayImages, setDisplayImages] = useState<Array<string>>([]);
  const displayUploadedImages = () => {
    images &&
      Object.keys(images).map((keys) => {
        const url = URL.createObjectURL(images[keys as any]);
        setDisplayImages((prev) => [...prev, url]);
      });
  };
  const onPost = () => {
    if (content.length > 0) {
      const data = {
        content: content,
        uid: auth.currentUser?.uid,
        images: [],
        username: user.username,
        userprofile: user.profilePicture,
        type: "post",
      };
      setTogglePost(false);
      sendPost(data, images);
    }
  };

  const onReply = async () => {
    if (content.length > 0) {
      await sendReply(
        {
          content: content,
          images: [] as string[],
          date: new Date().toISOString(),
          username: user.username,
          userprofile: user.profilePicture,
          uid: auth.currentUser?.uid,
          pid: selectPost,
        },
        images
      );
      setToggleReply(false);
    }
  };

  useEffect(() => {
    images && images?.length > 0 && displayUploadedImages();
  }, [images]);

  return (
    <div className="reply-container">
      <div className="flex flex-col items-center justify-center w-[500px]">
        <div className="reply-cross flex justify-between my-2">
          <RxCross2
            size={50}
            className=""
            onClick={() => {
              selectNavOption(window.location.pathname.split("/")[1]);
              type === "reply" ? setToggleReply(false) : setTogglePost(false);
            }}
            style={{ color: `${user.website_accent}` }}
          />
          <div className="flex items-center justify-end w-[50%] lg:w-[40%]">
            <EmojiComp content={content} setContent={setContent} />
            <UploadImage setImages={setImages} />
            <button
              className="btn"
              onClick={() => {
                if (content !== "" || images)
                  if (type === "reply") {
                    onReply();
                  } else {
                    onPost();
                  }
                setContent("");
              }}
            >
              {type === "reply" ? "Reply" : "Post"}
            </button>
          </div>
        </div>
        <div className="text-container">
          <textarea
            placeholder="Enter text here"
            style={{ border: `${style?.border}` }}
            value={content}
            onChange={(e) => {
              const { value } = e.currentTarget;
              setContent(value);
            }}
          ></textarea>
        </div>
      </div>
      <div className="display-images">
        {displayImages?.length > 0 && <UploadImagesSwiper images={displayImages} />}
      </div>
    </div>
  );
};
