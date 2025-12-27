import jwt from "jsonwebtoken";
import { env } from "../config/env";

type TokenPayload = {
  userId: string;
  role: "CREATOR" | "CLIPPER";
};

export const generateToken = (payload: TokenPayload) => {
  return jwt.sign(payload, env.jwtSecret, {
    expiresIn: env.jwtExpiresIn,
  });
};

export const verifyToken = (token: string) => {
  return jwt.verify(token, env.jwtSecret) as TokenPayload;
};
