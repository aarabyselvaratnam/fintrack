import jwt from 'jsonwebtoken';

// Signs a JWT containing the user's id, expires per JWT_EXPIRES_IN in .env
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export default generateToken;