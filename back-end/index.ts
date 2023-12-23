import { Request, Response, NextFunction } from 'express';
import { Pool } from "pg";
import { verifyToken } from './middlewares/auth.middleware';
const cookieParser = require("cookie-parser")
const express = require("express")
const loginRouter = require("./routers/login.router");
const errorHandling = require("./middlewares/errHandling.middleware");
const dotenv = require("dotenv");

dotenv.config()
const server = express();
server.use(cookieParser())
server.use(express.json())
server.use("/login", loginRouter);


export const pool = new Pool({
    user: "postgres",
    host: "localhost", // Update to the correct host
    database: "users",
    password: "280015",
    port: 5432,
    connectionTimeoutMillis: 5000, // Example: Set a higher timeout value (5 seconds)
});

server.get('/', verifyToken, (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send('Hello World');

    } catch (error) {
        next(error)
    }
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});

server.use(errorHandling);