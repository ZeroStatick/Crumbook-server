require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();
const authRouter = require("./routes/auth.route.js");
const userRouter = require("./routes/user.route.js");

app.use(cors());
app.use(express.json());

app.use(authRouter);
app.use(userRouter);

app.listen(process.env.PORT, () => {
  console.log("listening to port 3000");
});

mongoose.connect(process.env.MONGO_URI);
