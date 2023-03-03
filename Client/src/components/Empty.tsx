import "@/styles/empty.css";
import { useSelector } from "react-redux";
import { userProfileState } from "../Types/type";
import { useEffect, useRef } from "react";

const Empty = () => {
  const emptyRef = useRef<HTMLDivElement>(null);
  return (
    <div className="empty" ref={emptyRef}>
      <img className="w-[400px] h-[300px]" src="https://media.tenor.com/RxbXY3mB_KIAAAAi/winnie-the.gif"/>
    </div>
  );
};

export default Empty;
