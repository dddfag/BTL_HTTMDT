const mongoose = require("mongoose");

const connectDb = (url) => {
  return mongoose.connect(url, { 
    useNewUrlParser: true, 
    useUnifiedTopology: true,
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS: 45000,
  });
};

module.exports = connectDb;
