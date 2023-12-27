import { Request, Response, NextFunction } from "express";
import express from "express";
import { pool } from "../index";
import { Ierror } from "../interfaces/Ierror";
import { IcategoryResponse } from "../interfaces/IcategoryResponse";
import { IproductResponse } from "../interfaces/IproductResponse";
import { tokenHelper } from "../middlewares/auth.middleware";
import { isValidCategoryName } from "../helpers/validCategoryName.helper";
import { productsQuery } from "../query/products.query";
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    pool.query(productsQuery,
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
    "/:categoriesParam",
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

                const splittedCategoryNames = req.params.categoriesParam.split("&")
                console.log(splittedCategoryNames)

                if (isValidCategoryName(splittedCategoryNames, categories)) {

                    const inQueryFilterNumbers = splittedCategoryNames.map((_, index) => `$${index + 1}`).join(", ");
                    const modifiedQuery = productsQuery + ` WHERE categories.categoryname IN (${inQueryFilterNumbers})`;

                    pool.query(modifiedQuery, splittedCategoryNames, (err: Error, result: { rows: IproductResponse }) => {
                        if (err) {
                            const errObject: Ierror = {
                                message: "Internal Server Error",
                                statusCode: 500,
                            };
                            return next(errObject);
                        } else {
                            console.table(result.rows)
                            res.json(result.rows);
                        }
                    });
                } else {
                    const errObject: Ierror = {
                        message: "Enter a valid categoryName",
                        statusCode: 400,
                    };
                    next(errObject);
                }
            }
        );
    }
);

module.exports = router;
