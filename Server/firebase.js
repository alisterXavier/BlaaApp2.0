var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://blaaapp2-default-rtdb.firebaseio.com",
});

const db = admin.firestore();

module.exports = { admin: admin, db: db };
