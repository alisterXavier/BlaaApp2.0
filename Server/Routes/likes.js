const express = require("express");
const app = express();
const { db } = require("../firebase");
const { FieldValue } = require("firebase-admin/firestore");

app.post("/like", async (req, res) => {
  const { uid, pid } = req.body;

  const postRef = db.collection("posts").doc(pid);
  const postData = await postRef.get();

  const isLiked = postData.data().likes.includes(uid);
  if (isLiked)
    postRef.update({
      likes: FieldValue.arrayRemove(uid),
    });
  else
    postRef.update({
      likes: FieldValue.arrayUnion(uid),
    });

  res.json(200);
});
module.exports = app;
