const express = require("express");
const { db } = require("../firebase");
const app = express();
const firebase = require("../firebase.js");
const admin = firebase.admin;


app.post("/send-reply", async (req, res) => {
  const { content, images, date, username, userprofile, uid, pid } = req.body;

  const replyRef = db.collection("posts").doc();
  const replyDocuid = replyRef._path.segments[1];

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
    id: replyDocuid,
  };

  await replyRef.set(data);

  await db
    .collection("users")
    .doc(uid)
    .update({
      replies: admin.firestore.FieldValue.arrayUnion(replyRef._path.segments[1]),
    });

  await db
    .collection("posts")
    .doc(pid)
    .update({
      replies: admin.firestore.FieldValue.arrayUnion(replyRef._path.segments[1]),
    });

  res.json(200);
});

module.exports = app;
