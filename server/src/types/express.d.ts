import { Request } from 'express';

declare global {
  namespace Express {
    interface Request {
      user?: {
        userId: string;
        role: "CREATOR" | "CLIPPER";
      };
    }
  }
}

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: "CREATOR" | "CLIPPER";
  };
}
