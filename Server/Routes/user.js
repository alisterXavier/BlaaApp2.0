const express = require("express");
const { db } = require("../firebase.js");
const app = express();
const { FieldValue } = require("firebase-admin/firestore");

app.post("/get-users", async (req, res) => {
  const { usersList } = req.body;
  const { user } = req.query;
  var users = [];
  if (user) {
    const userData = await db.collection("users").doc(user).get();
    users = userData.data();
  } else {
    await Promise.all(
      await usersList.map(async (user) => {
        const userData = await db.collection("users").doc(user).get();
        users.push(userData.data());
      })
    );
  }

  res.json(users);
});

app.post("/follow", async (req, res) => {
  const { uid, cuid } = req.body;

  await db
    .collection("users")
    .doc(cuid)
    .update({
      following: FieldValue.arrayUnion(uid),
    });

  await db
    .collection("users")
    .doc(uid)
    .update({
      followers: FieldValue.arrayUnion(cuid),
    });
  res.json(200);
});

app.post("/unfollow", async (req, res) => {
  const { uid, cuid } = req.body;

  await db
    .collection("users")
    .doc(cuid)
    .update({
      following: FieldValue.arrayRemove(uid),
    });

  await db
    .collection("users")
    .doc(uid)
    .update({
      followers: FieldValue.arrayRemove(cuid),
    });
  res.json(200);
});
module.exports = app;
