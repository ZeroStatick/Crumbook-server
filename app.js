require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
const app = express();
const authRouter = require("./routes/auth.route.js");
const userRouter = require("./routes/user.route.js");
const recipeRouter = require("./routes/recipe.route.js");
const ingredientRouter = require("./routes/ingredient.route.js");
const reportRouter = require("./routes/report.route.js");
const connectDB = require("./config/connectDB.js");
const { errorHandler } = require("./middleware/errorHandler.js");

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/users", userRouter);
app.use("/api/recipes", recipeRouter);
app.use("/api/ingredients", ingredientRouter);
app.use("/api/reports", reportRouter);

//404 on routes
app.use((_req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

app.use(errorHandler); // Global error handler, i remember they talked about it, i dont exactly remember the implentation but i do remember they said its easier

const PORT = process.env.PORT || 3000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`); // added a config package to connect to DB
  });
});
