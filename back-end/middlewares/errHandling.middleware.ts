import { Response,Request,NextFunction } from "express";
import { Ierror } from "../interfaces/Ierror";

module.exports = (err : Ierror,req : Request,res : Response,next : NextFunction)=>{
    console.log(err)
    res.send(err)
}