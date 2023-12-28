import { Request, Response, NextFunction } from "express";
import express from "express";
import { pool } from "../index";
import { Ierror } from "../interfaces/Ierror";
import { IcategoryResponse } from "../interfaces/IcategoryResponse";
import { IproductResponse } from "../interfaces/IproductResponse";
import { isValidCategoryName } from "../helpers/validCategoryName.helper";
import { modifiedQuery } from "../query/products.query";
const router = express.Router();

router.get("/", (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.query
    const queryName = name?.toString().toLowerCase()
    console.log(name)
    console.log(modifiedQuery(queryName))
    const query = modifiedQuery(queryName)
    pool.query(query,
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
                const { name } = req.query
                console.log(name)

                if (isValidCategoryName(splittedCategoryNames, categories)) {
                    const queryName = name?.toString().toLowerCase()
                    const inQueryFilterNumbers = splittedCategoryNames.map((_, index) => `$${index + 1}`).join(',');
                    console.log(inQueryFilterNumbers)
                    const query = modifiedQuery(queryName, inQueryFilterNumbers)
                    console.log(query)

                    pool.query(query, splittedCategoryNames, (err: Error, result: { rows: IproductResponse }) => {
                        if (err) {
                            console.log(err)
                            const errObject: Ierror = {
                                message: "Internal Server Error",
                                statusCode: 500,
                            };
                            return next(errObject);
                        } else {
                            console.table(result.rows)
                            res.send(result.rows);
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
