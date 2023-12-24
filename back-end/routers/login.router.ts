import { NextFunction, Request, Response, Router } from 'express';
import { Iuser } from '../interfaces/Iuser';
import { Ierror } from '../interfaces/Ierror';
import { pool } from '../index';
import { generateToken } from '../middlewares/auth.middleware';
import { HashGenerator } from '../utils/hashGenerator';

const express = require("express");
const router = express.Router();

router.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {

        const user: Iuser = req.body;
        const hashGenerator = new HashGenerator(user.password);

        // Hash işlemi tamamlandığında devam etmek için then bloğu
        await hashGenerator.hashPassword(req, res, next).then(() => {
            pool.query(
                'SELECT password FROM customers WHERE email=$1',
                [user.email],
                async (err, result): Promise<void> => {
                    const compared = hashGenerator.comparePassword(result.rows[0])
                    if (!compared) {

                        const errObject = {
                            statusCode: 401,
                            message: 'Email or password unauthorized',
                        };

                        next(errObject);
                    } else {
                        const token = generateToken(user);
                        res.cookie('user', token, { maxAge: 90000, httpOnly: true });
                        res.status(200).json({ login: true });
                    }
                }
            );
        });
    } catch (error) {
        const errObject: Ierror = {
            message: 'Internal server error',
            statusCode: 500,
        };
        next(errObject);
    }
});

module.exports = router;
