import { NextFunction, Request, Response } from "express";
import { Iuser } from "../interfaces/Iuser";
import { Ierror } from "../interfaces/Ierror";
import { pool } from "../index"
import { generateToken } from "../middlewares/auth.middleware";
const express = require("express");

const router = express.Router()

router.get("/", (req: Request, res: Response) => {
    res.send("hello from login")
})

router.post("/", (req: Request, res: Response, next: NextFunction) => {
    try {

        const user: Iuser = {
            username: req.body.username,
            password: req.body.password
        }
        pool.query(
            "SELECT * FROM user_table WHERE username=$1 AND password=$2",
            [user.username, user.password],
            (err, result) => {
                if (err) {

                    const errObject: Ierror = {
                        statusCode: 500,
                        message: "could'nt connect postgres or query problem",
                    };

                    next(errObject);
                } else {
                    const token = generateToken(user);
                    res.cookie("user", token, { maxAge: 90000, httpOnly: true });
                    res.status(200).json(result.rows);
                }
            }
        );
    }
    catch (error) {
        const errObject: Ierror = {
            message: "Internal server error",
            statusCode: 500
        }
        next(errObject)
    }
})

module.exports = router;