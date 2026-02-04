import { JwtPayload } from "jsonwebtoken";

interface UserJwtPayload {
  id: number;
  email: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: UserJwtPayload;
    }
  }
}

export {};
