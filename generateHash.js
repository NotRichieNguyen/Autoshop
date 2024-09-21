// generateHash.js
const bcrypt = require("bcryptjs");

const password = "pw"; // Replace with your actual password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, (err, hash) => {
  if (err) throw err;
  console.log("Hash:", hash);
});
