import { RxCross2 } from "react-icons/rx";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import {
  ContentInterface,
  ContentsInterface,
  userProfileState,
} from "../../Types/type";
import {
  EnlargeImage,
  PostsContext,
  ReplyPostAndSelectPostContext,
} from "../../utils/ContextApi";
import { useContext, useEffect, useRef, useState } from "react";
import { auth } from "../../firebase/firebase";
import { createRippleEffect } from "../../utils/helperFn";
import { sendReply } from "../../utils/requests";
import { getPostReplies, selectById } from "../../features/ContentReducer";
import EmojiComp from "../EmojiComp";
import UploadImage from "../UploadImage";
import { PostSkeleton } from "../Skeleton";
import "@/styles/posts.css";
import { FormatContent } from "../FormatContent";
import { useMobileSize, useStyle } from "../../utils/Hooks";
import { Masonry } from "@mui/lab";
import Box from "@mui/material/Box";
import Empty from "../Empty";
import Replies from "./Replies";
import Buttons from "../Buttons";
import MasonryPost from "./Masonrypost";

export const Posts = () => {
  const navigate = useNavigate();
  const posts = useContext(PostsContext);
  const { setPostId } = useContext(ReplyPostAndSelectPostContext);
  const isMobile = useMobileSize();
  const style = useStyle();
  const { setEnlargeImage } = useContext(EnlargeImage);
  const userProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );

  return (
    <div
      className={`posts-wrapper ${
        userProfile.layout === "Masonry" && !isMobile
          ? "posts--masonry--wrapper"
          : "posts--default--wrapper"
      }`}
    >
      <div className="posts">
        {posts && posts?.length > 0 ? (
          userProfile.layout === "Masonry" && !isMobile ? (
            <MasonryPost
              posts={posts}
            />
          ) : (
            posts.map((post) => {
              return (
                <div
                  key={post.id}
                  id={post.id}
                  className="post flex flex-col items-start justify-between p-5"
                  style={{
                    border: `${style?.border}`,
                  }}
                  onClick={() => {
                    setPostId(post.id);
                    navigate(`/content=${post.id}`);
                  }}
                >
                  <div className="post-details flex items-end w-fit leading-4">
                    <figure
                      className="userprofile"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate(`/profile/${post.uid}`);
                      }}
                    >
                      <img src={post.userprofile}></img>
                    </figure>
                    <div className="text-start ml-2">
                      <p
                        className="post-username decoration-none"
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/profile/${post.uid}`);
                        }}
                      >
                        {post.username}
                      </p>
                      <p className="post-date">{post.date}</p>
                    </div>
                  </div>
                  <div className="post-content w-full max-h-[200px] lg:h-auto mt-5 overflow-hidden">
                    {FormatContent(post.content)}

                    {post.images && post.images.length > 0 && (
                      <div className="post-content-image mt-5">
                        {post.images?.slice(0, 4).map((image, index) => (
                          <figure
                            className="m-2 overflow-hidden"
                            onClick={(e) => {
                              e.stopPropagation();
                              post.images && setEnlargeImage(post.images);
                            }}
                          >
                            <img
                              src={image}
                              onClick={(e) => {
                                e.preventDefault();
                              }}
                              style={{ height: "100%" }}
                            />
                            {post.images?.length && index === 3 && (
                              <div
                                className="more-images flex items-center justify-center cursor-pointer"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  post.images && setEnlargeImage(post.images);
                                }}
                              >
                                <p className="">More images</p>
                              </div>
                            )}
                          </figure>
                        ))}
                      </div>
                    )}
                  </div>
                  <Buttons post={post} />
                </div>
              );
            })
          )
        ) : (
          <Empty />
        )}
      </div>
    </div>
  );
};

export const Post = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const style = useStyle();
  const { selectPost, setPostId } = useContext(ReplyPostAndSelectPostContext);
  const { setEnlargeImage } = useContext(EnlargeImage);
  const post: ContentInterface | undefined | null = useSelector(
    (state: { content: ContentsInterface }) =>
      selectPost ? selectById(state.content, selectPost) : null
  );
  const replies: ContentsInterface | undefined = useSelector(
    (state: { content: ContentsInterface }) =>
      selectPost ? getPostReplies(state.content, selectPost) : []
  );
  const userProfile = useSelector(
    (state: { userProfile: { user: userProfileState } }) =>
      state.userProfile.user
  );
  const [content, setContent] = useState<string>("");
  const [images, setImages] = useState<FileList | null>();
  const [isReplyLoading, setIsReplyLoading] = useState<boolean>(true);

  const mount = useRef(false);

  useEffect(() => {
    if (mount.current) {
      id && setPostId(id);
    } else mount.current = true;
  }, [selectPost, id]);

  useEffect(() => {
    if (replies && isReplyLoading) setIsReplyLoading(false);
  }, [replies]);

  return userProfile ? (
    <div
      className="post-wrapper flex flex-col items-start justify-start p-2 lg:p-5"
      style={{ border: `${style?.border}` }}
    >
      <div
        className="cross"
        style={{ border: `${style?.border}` }}
        onClick={() => {
          navigate(-1);
        }}
      >
        <RxCross2 size={30} className="cursor-pointer" />
      </div>
      {post ? (
        <div
          className="p-5 w-full"
          style={{ borderBottom: `2px solid ${userProfile.website_accent}` }}
        >
          <div className="post-details flex items-end w-fit leading-4">
            <figure className="userprofile">
              <img src={post?.userprofile}></img>
            </figure>
            <div className="text-start ml-2">
              <a
                href={`/profile/${post?.uid}`}
                className="post-username decoration-none"
              >
                {post?.username}
              </a>
              <p className="post-date">{post?.date}</p>
            </div>
          </div>
          <div className="post-content mt-5">
            {FormatContent(post.content)}
            {post?.images && post.images.length > 0 && (
              <div className="post-content-image mt-5">
                {post.images?.slice(0, 5).map((image, index) => (
                  <figure
                    className="m-2 overflow-hidden"
                    onClick={(e) => {
                      e.stopPropagation();
                      post.images && setEnlargeImage(post.images);
                    }}
                    key={index}
                  >
                    <img
                      src={image}
                      onClick={(e) => {
                        e.preventDefault();
                      }}
                      style={{ height: "100%" }}
                    />
                    {post.images?.length && index === 4 && (
                      <div
                        className="more-images flex items-center justify-center cursor-pointer"
                        onClick={(e) => {
                          e.stopPropagation();
                          post.images && setEnlargeImage(post.images);
                        }}
                      >
                        <p className="">More images</p>
                      </div>
                    )}
                  </figure>
                ))}
              </div>
            )}
          </div>
          <Buttons post={post} />
        </div>
      ) : (
        <PostSkeleton number={1} />
      )}
      <div className="reply-text-container w-full mt-5">
        <div className="flex justify-start items-center flex-col lg:flex-row w-full">
          <div
            className="text-container flex"
            style={{ border: `${style?.border}` }}
          >
            <textarea
              onChange={(e) => {
                setContent(e.currentTarget.value);
              }}
              value={content}
            ></textarea>
            <div className="image-emoji-wrapper flex justify-evenly items-center w-[30%] lg:w-[10%]">
              <EmojiComp content={content} setContent={setContent} />
              <UploadImage setImages={setImages}></UploadImage>
            </div>
          </div>
          <button
            className="lg:ml-5 btn ripple-effect lg:w-auto w-[90%]"
            onClick={(e) => {
              createRippleEffect(e);
              sendReply(
                {
                  content: content,
                  images: [],
                  date: new Date().toISOString(),
                  username: userProfile.username,
                  userprofile: userProfile.profilePicture,
                  uid: auth.currentUser?.uid,
                  pid: selectPost,
                },
                images
              );
              setContent("");
            }}
          >
            Reply
          </button>
        </div>
      </div>
      <div className="replies relative w-full min-h-[200px] max-h-fit mt-5 flex flex-col">
        {replies ? (
          replies.length > 0 ? (
            replies.map((reply) => <Replies reply={reply} />)
          ) : (
            <h1 className="text-2xl">No Replies...</h1>
          )
        ) : (
          <PostSkeleton number={5}></PostSkeleton>
        )}
      </div>
    </div>
  ) : (
    <></>
  );
};
