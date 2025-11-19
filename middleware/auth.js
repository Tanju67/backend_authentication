import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

import { UnauthenticatedError } from "../errors/index.js";

export const checkAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new UnauthenticatedError(
      "Please provide a valid username and password"
    );
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userData = {
      userId: decoded.userId,
      fullName: decoded.fullName,
    };
    next();
  } catch (error) {
    throw new UnauthenticatedError(
      "Please provide a valid username and password"
    );
  }
};
