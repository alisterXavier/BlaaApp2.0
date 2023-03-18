
import { EmojiClickData } from "emoji-picker-react";
import { selectEmoji } from "../utils/helperFn";
import { MouseEvent, useEffect, useRef, useState } from "react";
import { BsEmojiSmile } from "react-icons/bs";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";

const EmojiComp = ({
  content,
  setContent,
}: {
  content: string;
  setContent: (value: string | ((preval: string) => string)) => void;
}) => {
  const [isEmojiList, setIsEmojiList] = useState<boolean>(false);
  const emojiRef = useRef<HTMLDivElement>(null);
  const addEmoji = (emoji: EmojiClickData, event: MouseEvent) => {
    setContent(selectEmoji(emoji, content));
  };

  const handleOutsideClick = (e: EventTarget | null) => {
    if (
      emojiRef !== null &&
      emojiRef.current &&
      !emojiRef.current.contains(e as HTMLElement)
    )
      setIsEmojiList(false);
  };

  useEffect(() => {
    document.addEventListener("click", (e) => handleOutsideClick(e.target));
    return () =>
      document.removeEventListener("click", (e) =>
        handleOutsideClick(e.target)
      );
  }, []);

  return (
    <div className="emoji-wrapper w-[20%] h-full lg:w[10%] relative flex items-center justify-center cursor-pointer mx-2">
      <BsEmojiSmile
        size={20}
        className="absolute z-10"
        onClick={(e) => {
          e.stopPropagation();
          setIsEmojiList(!isEmojiList);
        }}
      />
      {isEmojiList && (
        <div
          className="emoji fixed left-0 bottom-0 z-10"
          ref={emojiRef}
          onClick={(e) => e.stopPropagation()}
        >
          <Picker data={data} onEmojiSelect={addEmoji} />
        </div>
      )}
    </div>
  );
};

export default EmojiComp;
