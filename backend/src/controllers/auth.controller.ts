// Reads req.body
// Call auth service
// Translates errors into HTTP status codes

import { Request, Response } from "express";
import * as authService from "../services/auth.service";

export async function register(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) { 
            return res.status(400).json({error: "Email and password are required"})    
        }

        const user = await authService.register(email, password);
        return res.status(201).json(user);

    } catch (err: any) {
        if (err.code === "P2002") {
            return res.status(400).json({ error: "Email already in use" });
        }
        return res.status(500).json({ error: "Internal server error" });
    }
}

export async function login(req: Request, res:Response) {
    try {
        const {email, password} = req.body;

        if (!email || !password) {
            return res.status(400).json({error: "Email and password are required"})
        }
        
        const session = await authService.login(email, password);
        return res.status(200).json(session);
    } catch (err: any) {
        return res.status(401).json({error: "Invalid credentials"});
    }
}