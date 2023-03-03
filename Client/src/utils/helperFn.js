import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { auth, db } from "../firebase/firebase";
import { toastFn } from "./Toast";

export const objectsEqual = (o1, o2) =>
  typeof o1 === "object" && Object.keys(o1).length > 0 && typeof o2 === "object"
    ? Object.keys(o1).length === Object.keys(o2).length &&
      Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
    : o1 === o2;

export const arraysEqual = (a1, a2) =>
  a1.length === a2.length && a1.every((o, idx) => objectsEqual(o, a2[idx]));

// format the date in Object
export const formatDateInObj = (item) => {
  return {
    ...item,
    date: formatDate(item.date),
  };
};

export const formatDate = (date) => {
  return `${new Date(date).toLocaleDateString("en-US")} ${new Date(
    date
  ).toLocaleTimeString("en-US")}`;
};

export const createRippleEffect = (event) => {
  const btn = event.currentTarget;
  const circle = document.createElement("span");
  const diameter = Math.max(btn.clientWidth, btn.clientHeight);
  const radius = diameter / 2;
  circle.style.width = circle.style.height = `${diameter}px`;
  circle.style.left = `${event.clientX - (btn.offsetLeft + radius)}px`;
  circle.style.top = `${event.clientY - (btn.offsetTop + radius)}px`;
  circle.classList.add("ripple");

  const ripple = btn.getElementsByClassName("ripple")[0];

  if (ripple) {
    ripple.remove();
  }
  btn.appendChild(circle);
};

// add emoji to content
export const selectEmoji = (emoji, content) => {
  const hex = " 0x" + emoji.unified;
  return content.concat(String.fromCodePoint(hex));
};

// check if username exists
export const checkUsername = async (setUsernameExists, newUsername) => {
  var ref = collection(db, "users");
  var q = query(ref, where("username", "==", newUsername));
  const item = await getDocs(q);

  setUsernameExists(false);
  item.forEach((i) => {
    if (i.exists()) setUsernameExists(true);
  });
};

// Change username
export const changeUsername = async (username) => {
  if (username.length > 0) {
    if (auth.currentUser) {
      var userRef = doc(db, "users", auth.currentUser?.uid);
      await updateDoc(userRef, {
        username: username,
      })
        .then(() => {
          toastFn("Username set", "200");
        })
        .catch((err) => {
          toastFn("Unsuccessful", "200");
        });
    }
  } else toastFn("Enter a valid username", "error");
};

//handle outside click

export const handleNotLogInUserClick = () => {
  toastFn("Please Log in", "error");
};
