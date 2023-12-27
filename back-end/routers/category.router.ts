import { Request, Response, NextFunction } from "express";
import express from "express";
import { pool } from "../index";
import { Ierror } from "../interfaces/Ierror";
import { IcategoryResponse } from "../interfaces/IcategoryResponse";
import { IproductResponse } from "../interfaces/IproductResponse";
import { tokenHelper } from "../middlewares/auth.middleware";
import { isValidCategoryId } from "../helpers/validCategoryId.helper";
const router = express.Router();

router.get("/", tokenHelper.verifyToken, (req: Request, res: Response, next: NextFunction) => {
    pool.query(" SELECT productname, price, stockquantity, categoryname FROM products INNER JOIN categories ON products.categoryid = categories.categoryid",
        (err: Error, result: { rows: IproductResponse }) => {
            if (err) {
                const errObject: Ierror = {
                    message: "Internal Server Error",
                    statusCode: 500,
                };
                return next(errObject);
            }
            else {
                res.send(result.rows)
            }
        })
})

router.get(
    "/:categoryId",
    tokenHelper.verifyToken,
    (req: Request, res: Response, next: NextFunction) => {
        pool.query(
            "SELECT * FROM categories",
            (err: Error, result: { rows: IcategoryResponse[] }) => {
                if (err) {
                    const errObject: Ierror = {
                        message: "Internal Server Error",
                        statusCode: 500,
                    };
                    return next(errObject);
                }

                const categories: IcategoryResponse[] = result.rows;
                const categoryId = req.params.categoryId;

                // Check category id to prevent SQL injection
                if (isValidCategoryId(categoryId, categories)) {
                    let query = `
                        SELECT productname, price, stockquantity, categoryname
                        FROM products
                        INNER JOIN categories ON products.categoryid = categories.categoryid WHERE products.categoryid = $1
                    `;

                    pool.query(query, [categoryId], (err: Error, result: { rows: IproductResponse }) => {
                        if (err) {
                            const errObject: Ierror = {
                                message: "Internal Server Error",
                                statusCode: 500,
                            };
                            return next(errObject);
                        } else {
                            res.json(result.rows);
                        }
                    });
                } else {
                    const errObject: Ierror = {
                        message: "Enter a valid categoryId",
                        statusCode: 400,
                    };
                    next(errObject);
                }
            }
        );
    }
);

module.exports = router;
