import User from "../models/User.js";
import { StatusCodes } from "http-status-codes";
import { BadRequest, UnauthenticatedError } from "../errors/index.js";
import cloudinary from "../utils/cloudinary.js";

export const register = async (req, res) => {
  const { fullName, email, password } = req.body;

  const user = await User.create({ fullName, email, password });

   const { password: pass, ...info } = user._doc;

  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({
    data: info,
    token,
    message: "User created successfully",
  });
};
export const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new BadRequest("Please provide email and password");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new UnauthenticatedError("Invalid Email");
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Password");
  }

  const { password: pass, ...info } = user._doc;

  const token = user.createJWT();
  res
    .status(StatusCodes.OK)
    .json({ data: info, token, message: "User logged in successfully" });
};
export const getCurrentUser = async (req, res) => {
  const user = await User.findOne({ _id: req.userData.userId });

  const { password, ...info } = user._doc;

  res.status(StatusCodes.OK).json({ info });
};

export const updateProfile = async (req, res) => {
  const {image} = req.body;
  const userId = req.userData.userId;

  if (!image) {
    throw new BadRequest("Please provide profile picture");
  }

  const uploadResponse = await cloudinary.uploader.upload(image);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { image: uploadResponse.secure_url },
      { new: true }
    );

  res.status(StatusCodes.OK).json({ data: updatedUser });
};