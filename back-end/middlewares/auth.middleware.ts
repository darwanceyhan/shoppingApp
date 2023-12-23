import { Response, Request, NextFunction } from "express";
import { Iuser } from "../interfaces/Iuser";
const jwt = require("jsonwebtoken");

export const generateToken = (user: Iuser) => {
    const token = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1m" });
    return token;
}

export const verifyToken = (req: Request, res: Response, next: NextFunction) => {

    let token: string;

    const authorizationHeader = req.headers['authorization'];

    if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
        token = authorizationHeader.split(' ')[1];
    } else {
        return next({
            message: "Access denied. No token provided.",
            statusCode: 401,
        });
    }

    console.log(token);

    if (!token) {
        return next({
            message: "Invalid token format.",
            statusCode: 401,
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
        console.log(decoded);
        next();
    } catch (error) {
        next({
            message: "Invalid token.",
            statusCode: 401,
        });
    }
};
