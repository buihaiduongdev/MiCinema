import jwt from 'jsonwebtoken';
import { env } from 'src/config/env.js';

export type TokenPayLoad = {
  userId: string;
  email: string;
  role: string;
};

export const signToken = (payload: TokenPayLoad): string => {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN as jwt.SignOptions['expiresIn'],
  });
};

export const verifyToken = (token: string): TokenPayLoad => {
  return jwt.verify(token, env.JWT_SECRET) as TokenPayLoad;
};
