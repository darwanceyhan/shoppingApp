import { Request, Response, NextFunction } from 'express';
import { Pool } from "pg";
import { tokenHelper } from './middlewares/auth.middleware';
const cookieParser = require("cookie-parser")
const express = require("express")
const loginRouter = require("./routers/login.router");
const errorHandling = require("./middlewares/errHandling.middleware");
const categoryRouter = require("./routers/category.router")
const signupRouter = require("./routers/signup.router")
const dotenv = require("dotenv");
const bodyParser = require("body-parser")

const server = express();
dotenv.config();
server.use(bodyParser())
server.use(cookieParser())
server.use(express.json())
server.use("/login", loginRouter);
server.use("/category", categoryRouter);
server.use("/signup", signupRouter);


export const pool = new Pool({
    user: "postgres",
    host: "localhost", // Update to the correct host
    database: "shop_database",
    password: "280015",
    port: 5432,
    connectionTimeoutMillis: 5000, // Example: Set a higher timeout value (5 seconds)
});

server.get('/', tokenHelper.verifyToken, (req: Request, res: Response, next: NextFunction) => {
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