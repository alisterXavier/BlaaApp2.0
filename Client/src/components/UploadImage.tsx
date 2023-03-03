import { BsPaperclip } from "react-icons/bs";

const UploadImage = ({
  setImages,
}: {
  setImages: (
    value:
      | FileList
      | undefined
      | null
      | ((preVal: FileList | undefined | null) => FileList | undefined | null)
  ) => void;
}) => {
  return (
    <div className="upload-file flex justify-center items-center relative w-[30%] h-full lg:w[10%] mx-2">
      <BsPaperclip size={20} />
      <input
        className="absolute z-10"
        type="file"
        accept="image/*"
        onChange={(e) => {
          setImages(e.currentTarget.files);
        }}
        multiple
      />
    </div>
  );
};

export default UploadImage;
