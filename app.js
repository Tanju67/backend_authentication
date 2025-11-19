import "dotenv/config";
import "express-async-errors";

import express from "express";
import cors from "cors";

import connectDB from "./utils/connectDB.js";
import authRoutes from "./routes/auth.route.js";
import notFound from "./middleware/not-found.js";
import errorHandler from "./middleware/error-handler.js";

const app = express();

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cors());

app.use("/api/v1/auth", authRoutes);

app.use(notFound);
app.use(errorHandler);

const port = process.env.PORT || 8000;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    console.log("Connected DB!");
    app.listen(port, () => console.log("Server is listening on port: " + port));
  } catch (error) {
    console.log(error);
  }
};

start();
