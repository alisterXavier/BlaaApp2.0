require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const PORT = process.env.PORT || 5000;
const path = require("path");
const __dirname1 = path.resolve();

app.use(express.static(path.join(__dirname1 + "/Client/dist")));
app.get("*", (req, res) => {
  res.sendFile(
    path.resolve(__dirname1, "Client", "dist", "index.html"),
    (err) => err && res.status(500).send(err)
  );
});

app.use(express.json());
app.use(
  cors({
    origin: "*",
  })
);

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});

app.use("/api/post", require("./Routes/post.js"));
app.use("/api/replies", require("./Routes/replies.js"));
app.use("/api/user", require("./Routes/user.js"));
app.use("/api/chats", require("./Routes/chats.js"));
app.use("/api/likes", require("./Routes/likes.js"));
