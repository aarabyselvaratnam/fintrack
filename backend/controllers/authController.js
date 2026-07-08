import User from '../models/User.js';
import generateToken from '../utils/generateToken.js';

// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email, and password' });
    }

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(409).json({ success: false, message: 'An account with this email already exists' });
    }

    // Password gets hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, email, password });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide email and password' });
    }

    // password has select:false in the schema, so we explicitly request it here
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        user: { id: user._id, name: user.name, email: user.email },
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    // req.user was set by the protect middleware
    res.status(200).json({ success: true, data: req.user });
  } catch (error) {
    next(error);
  }
};