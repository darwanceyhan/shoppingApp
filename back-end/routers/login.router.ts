import { NextFunction, Request, Response } from "express"

const express = require("express");

const router = express.Router()

router.get("/",(req : Request,res : Response)=>{
    res.send("hello from login")
})

router.post("/",(res : Response, req : Request , next : NextFunction) =>{
    try {
        
    } catch (error) {
        
    }
})

module.exports = router;