// Auth Middleware 
// Reads session ID
// Loads from Redis
// Attaches req.user
// Role enforcement

import { NextFunction, Request, Response } from "express";
import { Role } from "../generated/prisma";
import { redis } from "../config/redis";

interface SessionPayload {
    userId: string;
    role: Role;
}

export function authMiddleware(...allowedRoles: Role[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const sessionId = req.headers["x-session-id"];
    if (!sessionId || typeof sessionId !== "string") {
      return res.status(401).json({ error: "Unauthorized" });
    }
    const session = await redis.get(`session:${sessionId}`);
    if (!session) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const payload: SessionPayload = JSON.parse(session)
    
    if (allowedRoles.length > 0 && !allowedRoles.includes(payload.role)) {
       return res.status(403).json({ error: "Forbidden" });
    }

    req.user = {
        id: payload.userId,
        role: payload.role,
    }
   
    next();
  };
}