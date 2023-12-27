import { Request, Response, NextFunction } from "express";
import express from "express";
import { pool } from "../index";
import { Ierror } from "../interfaces/Ierror";
import { IproductResponse } from "../interfaces/IproductResponse";

const router = express.Router();

router.get(
    "/:categoryId",
    (req: Request, res: Response, next: NextFunction) => {
        pool.query(
            "select * from categories",
            (
                err: Error,
                result: { rows: { categoryid: number; categoryname: string }[] }
            ) => {
                if (err) {
                    const errObject: Ierror = {
                        message: "Internal Server Error",
                        statusCode: 500,
                    };
                    return next(errObject);
                }

                const categoryIds = result.rows.map((e) => String(e.categoryid));

                if (req.params.categoryId == "all") {
                    pool.query(
                        "SELECT * FROM products",
                        (
                            err: Error,
                            result: { rows: { categoryid: number; categoryname: string } }
                        ) => {
                            if (err) {
                                const errObject: Ierror = {
                                    message: "Internal Server Error",
                                    statusCode: 500,
                                };
                                return next(errObject);
                            } else {
                                res.send(result.rows);
                            }
                        }
                    );
                } else if (categoryIds.includes(req.params.categoryId)) {
                    pool.query(
                        "SELECT productname , price , stockquantity , categoryname FROM products INNER JOIN categories ON products.categoryid = categories.categoryid WHERE products.categoryid = $1",
                        [req.params.categoryId],
                        (err: Error, result: { rows: IproductResponse }) => {
                            if (err) {
                                const errObject: Ierror = {
                                    message: "Internal Server Error",
                                    statusCode: 500,
                                };
                                return next(errObject);
                            } else {
                                res.send(result.rows);
                            }
                        }
                    );
                } else {
                    const errObject: Ierror = {
                        message: "Enter correctly categoryId",
                        statusCode: 500,
                    };
                    next(errObject);
                }
            }
        );
    }
);

module.exports = router;
