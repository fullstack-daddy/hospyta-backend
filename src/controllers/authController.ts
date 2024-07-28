import { Request, Response } from 'express';
import User from '../models/User';
import { AuthRequest } from '../middlewares/auth';
import cloudinary from '../config/cloudinary';
import bcrypt from 'bcryptjs';
import jwt from "jsonwebtoken";

export const register = async (req: Request, res: Response) => {
  const { username, email, password } = req.body;

  try {
    let profilePictureUrl = '';

    if (req.file) {
      const result = await new Promise<any>((resolve, reject) => {
        const stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });

        if (req.file) {
          stream.end(req.file.buffer);
        }
      });

      profilePictureUrl = result.secure_url;
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      profilePicture: profilePictureUrl,
    });

    const savedUser = await newUser.save();

    const token = jwt.sign({ id: savedUser._id }, process.env.JWT_SECRET!, {
      expiresIn: '1h',
    });

    res.status(201).json({
      success: true,
      token,
      data: savedUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: (error as Error).message,
    });
  }
};

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Please provide email and password' });
  }

  try {
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const token = user.getSignedJwtToken();

    res.json({ success: true, token });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export const getMe = async (req: AuthRequest, res: Response) => {
  try {
    const user = await User.findById(req.user?.id);
    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
