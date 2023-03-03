const express = require("express");
const { db } = require("../firebase");
const { FieldValue } = require("firebase-admin/firestore");
const app = express();


app.post("/send-reply", async (req, res) => {
  const { content, images, date, username, userprofile, uid, pid } = req.body;
  const replyRef = db.collection("posts").doc();

  const data = {
    type: "reply",
    content: content,
    images: images,
    likes: [],
    replies:[],
    date: date,
    username: username,
    userprofile: userprofile,
    uid: uid,
    pid: pid,
    id: replyRef._path.segments[1],
  };

  await replyRef.set(data);

  await db
    .collection("users")
    .doc(uid)
    .update({
      replies: FieldValue.arrayUnion(replyRef._path.segments[1]),
    });

  await db
    .collection("posts")
    .doc(pid)
    .update({
      replies: FieldValue.arrayUnion(replyRef._path.segments[1]),
    });

  res.json(200);
});

module.exports = app;
