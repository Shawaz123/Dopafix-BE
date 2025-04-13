const admin = require('firebase-admin');
const serviceAccount = require('../Config/firebase.json'); // download from Firebase Console

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

module.exports = admin;
