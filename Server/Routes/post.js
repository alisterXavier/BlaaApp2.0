const express = require("express");
const { db } = require("../firebase.js");
const app = express();
const firebase = require("../firebase.js");
const admin = firebase.admin;

app.post("/new-post", async (req, res) => {
  const { content, uid, images, userprofile, username } = req.body;

  const postDoc = db.collection("posts").doc();
  const postDocuid = postDoc._path.segments[1];
  
  await postDoc.set({
    type: "post",
    content: content,
    uid: uid,
    date: new Date().toISOString(),
    images: images,
    likes: [],
    replies: [],
    username: username,
    userprofile: userprofile,
    id: postDocuid,
  });

  db.collection("users")
    .doc(uid)
    .update({
      posts: admin.firestore.FieldValue.arrayUnion(postDocuid),
    })
    .then(() => {
      res.json(200);
    });
});

module.exports = app;
