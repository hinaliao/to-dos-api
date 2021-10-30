const mongoose = require("mongoose");

const url = 'mongodb://localhost:27017/todos-api';

mongoose
  .connect(url)
  .then(() => console.log("Successfully Connected"))
  .catch((error) => console.log("Couldn,t connect with the server", error));
