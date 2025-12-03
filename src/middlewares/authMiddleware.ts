import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response, NextFunction } from "express";

dotenv.config();
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
      };
    }
  }
}

function auth(req: Request, res: Response, next: NextFunction) {
  if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET not set");
  const authHeader = req.headers.authorization || "";
  console.log(req.headers);
  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return res
      .status(401)
      .json({ message: "Missing token or invalid Authorization header" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as jwt.JwtPayload;
    req.user = { id: decoded.id, email: decoded.email };
    console.log("authentication successful");
    next();
  } catch (err: unknown) {
    /* Token expired */
    if (err instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" });
    }

    /* Bad signature / invalid token */
    if (err instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }

    return res.status(500).json({ message: "Authentication failed" });
  }
}

export default auth;
