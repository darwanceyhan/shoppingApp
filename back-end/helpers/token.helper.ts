import { Response, Request, NextFunction } from "express";
import { Iuser } from "../interfaces/Iuser";
const jwt = require("jsonwebtoken");

export class TokenHelper {
    public generateToken(user: Iuser): string {
        const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: "1m",
        });
        return token;
    }
    public verifyToken(req: Request, res: Response, next: NextFunction): void {
        const authorizationHeader = req.headers["authorization"];

        if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
            return next({
                message: "Access denied. No valid token provided.",
                statusCode: 401,
            });
        }

        const token = authorizationHeader.split(" ")[1];

        if (!token) {
            return next({
                message: "Invalid token format.",
                statusCode: 401,
            });
        }

        try {
            const decoded = jwt.verify(req.cookies["user"], process.env.ACCESS_TOKEN_SECRET);
            console.log(decoded)
            next();
        } catch (error) {
            next({
                message: "Invalid token.",
                statusCode: 401,
            });
        }
    }
}
