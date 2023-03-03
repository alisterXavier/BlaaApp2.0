import { useEffect, useState } from "react";
import {
  changeUsername,
  checkUsername,
  createRippleEffect,
} from "../utils/helperFn";
import { FaAngleDown, FaAngleRight } from "react-icons/fa";

const UsernameComp = () => {
  const [newUsername, setNewUsername] = useState<string>("");
  const [usernameExists, setUsernameExists] = useState<boolean>(false);
  const [wildCards, setWildCards] = useState<boolean>(false);
  const wild = /^(?![\d._])(?!.*[\d._]$)(?!.*\d_)(?!.*_\d)[\w]{1,9}$/;

  useEffect(() => {
    if (!wild.test(newUsername)) setWildCards(true);
    else {
      setWildCards(false);
      checkUsername(setUsernameExists, newUsername);
    }
  }, [newUsername]);

  return (
    <div className="newusername-wrapper flex flex-col justify-start items-start mt-3">
      <div className="relative flex justify-start items-center">
        <input
          type="text"
          className=""
          onChange={(e) => {
            setNewUsername(e.currentTarget.value);
          }}
        ></input>
        <span className={`ml-2 ${newUsername.length > 9 && "text-red-500"}`}>
          {newUsername.length}
        </span>
      </div>
      <div
        className={`requirements text-xs ${wildCards && "active"} text-start`}
      >
        <p className=" flex" onClick={() => setWildCards(!wildCards)}>
          {wildCards ? <FaAngleDown /> : <FaAngleRight />} Requirements
        </p>
        <ul className="pl-5">
          <li className="list-disc">upto 9 characters</li>
          <li className="list-disc">no special characters and spaces except underscore</li>
          <li className="list-disc">starts and ends with a letter</li>
        </ul>
      </div>
      <button
        className="ripple-effect btn reset-btn mt-2"
        onClick={(e) => {
          changeUsername(newUsername);
          createRippleEffect(e);
        }}
        style={{
          color: `${usernameExists ? "red" : "white"}`,
        }}
        disabled={usernameExists || wildCards}
      >
        {usernameExists ? "Username not available" : "Set Username"}
      </button>
    </div>
  );
};

export default UsernameComp;
