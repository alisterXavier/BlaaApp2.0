import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "@/styles/swiper.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper";
import { RxCross2 } from "react-icons/rx";
import { useContext } from "react";
import { EnlargeImage } from "../utils/ContextApi";

const Slider = () => {
  const { setEnlargeImage, enlargeImage } = useContext(EnlargeImage);
  return (
    <div
      className="fixed z-50 top-0 left-0 right-0 bottom-0 flex"
      onClick={(e) => e.stopPropagation()}
      key={"images-swiper"}
    >
      <RxCross2
        className="absolute z-10 top-10 right-10"
        size={30}
        onClick={() => setEnlargeImage([])}
      />
      <Swiper
        navigation={true}
        pagination={true}
        loop={true}
        modules={[Navigation, Pagination]}
        className="mySwiper"
      >
        {enlargeImage?.map((image: string) => (
          <SwiperSlide className="flex w-screen h-screen justify-center items-center">
            <figure>
              <img src={image}></img>
            </figure>
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export const UploadImagesSwiper = ({images} : {images : Array<string>}) => {
  return (
    <Swiper
      pagination={true}
      loop={true}
      modules={[Navigation, Pagination]}
      className="mySwiper"
    >
      {images?.map((image: string) => (
        <SwiperSlide>
          <figure>
            <img src={image}></img>
          </figure>
        </SwiperSlide>
      ))}
    </Swiper>
  );
};

export default Slider;
