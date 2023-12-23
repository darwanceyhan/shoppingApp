import { Request, Response, NextFunction } from "express";
const express = require("express");

const router = express.Router();


router.get("/:category", (req: Request, res: Response, next: NextFunction) => {
    res.send(req.params.category)
})