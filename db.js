const mongoose = require("mongoose");

// MONGO_DB_ONLINE_URL
// MONGO_DB_LOCAL_URL
const db = mongoose
  .connect(process.env.MONGO_DB_ONLINE_URL, {
      //  useNewUrlParser: true, useUnifiedTopology: true
  })
  .then(() => {
    console.log("Database is connected ");
  })
  .catch((error) => {
    console.log("error",error);
  });

module.exports = db;

// 

