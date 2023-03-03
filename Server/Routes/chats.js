const express = require("express");
const { FieldValue } = require("firebase-admin/firestore");
const { db } = require("../firebase");
const app = express();

app.post("/text", (req, res) => {
  var { uid, conversation } = req.body;

  const uploadMsg = (image = undefined) => {
    db.collection("chats")
      .doc(uid)
      .update(
        image
          ? {
              conversation: FieldValue.arrayUnion({
                ...conversation,
                images: image,
              }),
            }
          : {
              conversation: FieldValue.arrayUnion({
                ...conversation,
              }),
            }
      );
  };
  conversation.images.length > 0
    ? conversation.images.map((image) => {
        uploadMsg(image);
      })
    : uploadMsg();

  res.sendStatus(200);
});

app.post("/delete-conversation", async (req, res) => {
  const { uid, chatId } = req.body;

  await db.collection("chats").doc(chatId).delete();
  const user = db.collection("users").doc(uid);
  user.update({
    chatIds: FieldValue.arrayRemove(db.doc(`/chats/${chatId}`)),
  });

  res.json(200);
});

app.post("/exit-conversation", async (req, res) => {
  const { chatId, uid } = req.body;

  const user = db.collection("users").doc(uid);
  user.update({
    chatIds: FieldValue.arrayRemove(db.doc(`/chats/${chatId}`)),
  });

  const chats = db.collection("chats").doc(chatId);
  chats.update({
    userDetails: FieldValue.arrayRemove(uid),
  });

  res.json(200);
});

app.post("/get-users", async (req, res) => {
  const { user } = req.query;
  const users = [];
  await db
    .collection("users")
    .get()
    .then((storeResponse) => {
      storeResponse.forEach((data) => {
        const regex = new RegExp(user, "gi");
        const username = data.data().username;
        if (regex.test(username)) {
          users.push(data.data());
        }
      });
    });

  res.json(users);
});

app.post("/send-message", async (req, res) => {
  const { cuid, uidList, chatId } = req.body;
  var chatDoc, chatDocuid;
  if (chatId) {
    chatDoc = db.collection("chats").doc(chatId);
  } else {
    chatDoc = db.collection("chats").doc();
    chatDocuid = chatDoc._path.segments[1];
    await chatDoc.set({
      chatId: chatDocuid,
      chatName: "",
      userDetails: [cuid, ...uidList],
      conversation: [],
    });
  }
  await db
    .collection("users")
    .doc(cuid)
    .update({
      chatIds: FieldValue.arrayUnion(db.doc(chatDoc.path)),
    });

  await uidList.map(async (uid) => {
    await db
      .collection("users")
      .doc(uid)
      .update({
        chatIds: FieldValue.arrayUnion(db.doc(chatDoc.path)),
      });
  });
  res.json(200);
});

module.exports = app;
