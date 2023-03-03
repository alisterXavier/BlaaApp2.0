import { Skeleton } from "@mui/material";
import { useMobileSize } from "../utils/Hooks";

export const PostsSkeleton = ({ number }: { number: number }) => {
  const size = useMobileSize()
  return (
    <div className="posts w-full flex flex-col justify-center items-center">
      {new Array(number).fill(1).map((i) => (
        <div className="post w-full flex flex-col items-start justify-between p-5">
          <div className="post-details flex items-end w-fit leading-4">
            <Skeleton variant="circular" width={70} height={70} />
            <div className="text-start ml-2">
              <Skeleton variant="text" width={150} height={30} />
              <Skeleton variant="text" width={150} height={30} />
            </div>
          </div>
          <div className="w-full mt-2">
            <Skeleton className="w-full" variant="rectangular" height={200} />
          </div>
        </div>
      ))}
    </div>
  );
};

export const PostSkeleton = ({ number }: { number: number }) => (
  <div>
    {new Array(number).fill(1).map((i) => (
      <div className="pb-5 w-full">
        <div className="post-details flex items-end w-full leading-4">
          <Skeleton variant="circular" width={70} height={70} />
          <div className="text-start ml-2">
            <Skeleton variant="text" width={150} height={30} />
            <Skeleton variant="text" width={150} height={30} />
          </div>
        </div>
        <div className="mt-5 w-full">
          <Skeleton className="w-full" variant="rectangular" height={200} />
        </div>
      </div>
    ))}
  </div>
);

export const HeaderSkeleton = () => {
  const size = useMobileSize() 
  return (
    <div className="w-full flex justify-center items-center">
      <Skeleton variant="circular" width={size ? 100 : 150 } height={size ? 100 : 150 } />
      <div className="flex w-[70%] lg:w-[80%]">
        <div className="m-4 w-full">
          <div className="flex items-center w-full h-[50px]">
            <Skeleton
              animation="wave"
              variant="text"
              width={size ? 150 : 300 }
              height={size ? 40 : 70 }
            />
          </div>
          <div className="flex items-center">
            <Skeleton
              animation="wave"
              variant="text"
              className="mx-2"
              width={size ? 30 : 50 }
              height={size ? 40 : 60 }
            />
            <Skeleton
              animation="wave"
              variant="text"
              className="mx-2"
              width={size ? 30 : 50}
              height={size ? 40 : 60}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export const UserSkeleton = ({ number, imageSize,textSize }: { number: number, imageSize: number, textSize: number }) => {
  return (
    <>
      {new Array(number).fill(1).map((user) => (
        <div className="w-full flex justify-center items-center mt-5">
          <Skeleton variant="circular" width={imageSize} height={imageSize} />
          <div className="flex w-[70%] ml-2 mr-0">
            <Skeleton animation="wave" variant="text" width={textSize} height={50} />
          </div>
        </div>
      ))}
    </>
  );
};

export const ChatSkeleton = () => {
  const size = useMobileSize() 

  return (
    <>
      <div className="conversation-name w-full p-5 flex items-center">
        <div className="w-full flex ">
          <Skeleton animation="wave" variant="text" width={size ? 150 : 200} height={50} />
        </div>
      </div>
      <div className="texts flex w-[60%] flex-col-reverse items-center mt-5">
        {new Array(7).fill(0).map((index, i) => (
          <div
            className={`text p-2 ${
              i % 2 == 0 ? "justify-start" : "justify-end"
            } flex`}
          >
            <Skeleton animation="wave" variant="text" width={size ? 150 : 200} height={size ? 60 : 100} />
          </div>
        ))}
      </div>
      <div className="flex items-center message-box-container"></div>
    </>
  );
};
