import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { auth, storage } from "../firebase/firebase";
import axios from "axios";
import { handleNotLogInUserClick } from "./helperFn";

// create a randomized if for images
function makeid(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

// upload the image to storage
export const UploadImageToStorage = async (img, type) => {
  var imgRef;
  if (type === "Proflie picture")
    imgRef = ref(storage, `${type}/${auth.currentUser.uid}`);
  else imgRef = ref(storage, `${type}/${makeid(10)}`);
  if (img) {
    await uploadBytes(imgRef, img);
    var url = await getDownloadURL(imgRef);
    return url;
  }
  return [];
};

//like a post
export const like = (uid, pid) => {
  if (auth.currentUser) {
    axios
      .post(`${import.meta.env.VITE_API}/likes/like`, { uid: uid, pid: pid })
      .then((res) => {});
  } else {
    handleNotLogInUserClick();
  }
};

//reply to a post
export const sendReply = async (data, images) => {
  if (auth.currentUser) {
    if (data.content.length > 0) {
      if (images && images?.length > 0) {
        await Promise.all(
          Object.keys(images)?.map(async (image) => {
            const url = await UploadImageToStorage(
              images[image],
              "Post_Replies_Images"
            );
            url && data.images?.push(url);
          })
        );
      }
      axios.post(`${import.meta.env.VITE_API}/replies/send-reply`, data).then((res) => {});
    }
  } else handleNotLogInUserClick();
};

//create a new post
export const sendPost = async (data, images) => {
  if (auth.currentUser) {
    if (data.content.length > 0) {
      if (images && images?.length > 0) {
        await Promise.all(
          Object.keys(images)?.map(async (image) => {
            const url = await UploadImageToStorage(
              images[image],
              "Post_Replies_Images"
            );
            url && data.images?.push(url);
          })
        );
      }
      axios.post(`${import.meta.env.VITE_API}/post/new-post`, data).then((res) => {});
    }
  } else handleNotLogInUserClick();
};

//DM a user
export const messageUser = async (userList, chatId) => {
  if (auth.currentUser) {
    await axios
      .post(`${import.meta.env.VITE_API}/chats/send-message`, {
        cuid: auth.currentUser?.uid,
        uidList: userList.map((user) => user.uid),
        chatId: chatId,
      })
      .then(() => {});
  } else {
    handleNotLogInUserClick();
  }
};
