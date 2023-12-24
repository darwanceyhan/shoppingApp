import { Request, Response, NextFunction } from "express";
import { pool } from "..";
import { Isignup } from "../interfaces/Isignup";
import { Ierror } from "../interfaces/Ierror";
import * as bcrypt from "bcrypt";
const express = require("express");

const router = express.Router();

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
    try {
        const signupUserData: Isignup = req.body;

        // Parolayı bcrypt ile hash'le (asenkron)
        const hashedPassword = await bcrypt.hash(signupUserData.password, 10);

        // Güncel zamanı al ve PostgreSQL tarih formatına dönüştür
        const currentDate = new Date().toISOString();

        // Kullanıcı var mı kontrol et (asenkron)
        const userExists = await pool.query(
            `SELECT 1 FROM customers
             WHERE email = $1`,
            [signupUserData.email]
        );

        if (userExists.rows.length > 0) {
            // Kullanıcı zaten var, hata döndür
            const errObject: Ierror = {
                message: "User with this email already exists",
                statusCode: 400,
            };
            next(errObject);
        } else {
            // Kullanıcı yok, kaydet
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
