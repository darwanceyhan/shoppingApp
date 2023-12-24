import { Request, Response, NextFunction } from "express";
import { pool } from "..";
import { Isignup } from "../interfaces/Isignup";
import { Ierror } from "../interfaces/Ierror";
import { HashGenerator } from "../utils/hashGenerator";
const express = require("express");

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signupUserData: Isignup = req.body;

        // hash password
        const hashGenerator = new HashGenerator(signupUserData.password);
        await hashGenerator.hashPassword(req, res, next);

        // take current time
        const currentDate = new Date().toISOString();

        // query to user exist
        const userExists = await pool.query(
            `SELECT 1 FROM customers WHERE email = $1`,
            [signupUserData.email]
        );

        if (userExists.rows.length > 0) {
            // if user exists
            const errObject: Ierror = {
                message: "User with this email already exists",
                statusCode: 400,
            };
            next(errObject);
        } else {
            // if user does not exist
            const hashedPassword = hashGenerator.getHashedPassword();
            if (!hashedPassword) {
                const errObject: Ierror = {
                    message: "Hashed password is undefined",
                    statusCode: 500,
                };
                next(errObject);
                return;
            }

            await pool.query(
                `INSERT INTO customers (firstname, lastname, email, registrationdate, password)
                 VALUES ($1, $2, $3, $4, $5)`,
                [
                    signupUserData.name,
                    signupUserData.surname,
                    signupUserData.email,
                    currentDate,
                    hashedPassword,
                ]
            );

            console.log("Row inserted successfully");
            res.status(200).send("User registered successfully");
        }
    } catch (error) {
        const errObject: Ierror = {
            message: "Internal server error",
            statusCode: 500,
        };
        next(errObject);
    }
});

module.exports = router;
