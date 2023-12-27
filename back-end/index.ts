import { Request, Response, NextFunction } from "express";
const express = require("express");
const { Pool } = require("pg");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const dotenv = require("dotenv");
const loginRouter = require("./routers/login.router");
const categoryRouter = require("./routers/category.router");
const signupRouter = require("./routers/signup.router");
const errorHandling = require("./middlewares/errHandling.middleware");
const { tokenHelper } = require('./middlewares/auth.middleware');
const corsOptions = require("./helpers/cors.helper")

const server = express();

//.env
dotenv.config();

// CORS
server.use(cors(corsOptions));

// Other middlewares
server.use(cookieParser());
server.use(express.json());

// Routers
server.use("/login", loginRouter);
server.use("/category", categoryRouter);
server.use("/signup", signupRouter);

// Error middleware
server.use(errorHandling);

//Connect PostgreSQL
export const pool = new Pool({
    user: "postgres",
    host: "localhost",
    database: "shop_database",
    password: "280015",
    port: 5432,
    connectionTimeoutMillis: 5000,
});

server.get('/', tokenHelper.verifyToken, (req: Request, res: Response, next: NextFunction) => {
    try {
        res.send('Hello World');

    } catch (error) {
        next(error)
    }
});

server.listen(process.env.PORT, () => {
    console.log(`Server running on localhost:${process.env.PORT}`);
});

server.use(errorHandling);