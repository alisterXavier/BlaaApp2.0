import { useNavigate } from "react-router-dom";
import "@/styles/posts.css";
import { FormatContent } from "../FormatContent";
import { Masonry } from "@mui/lab";
import Box from "@mui/material/Box";
import Buttons from "../Buttons";
import { ContentInterface, ContentsInterface } from "../../Types/type";
import { useStyle } from "../../utils/Hooks";
import { EnlargeImage, ReplyPostAndSelectPostContext } from "../../utils/ContextApi";
import { useContext } from "react";

const MasonryPost = ({ posts }: { posts: ContentsInterface }) => {
  const navigate = useNavigate();
  const style = useStyle();
  const { setEnlargeImage } = useContext(EnlargeImage);
  const { setPostId } = useContext(ReplyPostAndSelectPostContext);

  return (
    <Box sx={{ width: "100%", minHeight: 829 }}>
      <Masonry columns={3} spacing={1}>
        {posts.map((post: ContentInterface) => {
          return (
            <div
              id={post.id}
              key={post.id}
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
              <div className="post-content w-full mt-5">
                {FormatContent(post.content)}

                {post.images && post.images.length > 0 && (
                  <div className="post-content-image mt-5">
                    {post.images
                      ?.slice(0, 4)
                      .map((image: string, index: number) => (
                        <figure
                          className="m-2 overflow-hidden relative"
                          key={index}
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
                          ></img>
                          {post.images?.length && index === 3 && (
                            <div
                              className="more-images absolute w-full h-full flex items-center justify-center cursor-pointer"
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
        })}
      </Masonry>
    </Box>
  );
};

export default MasonryPost;
