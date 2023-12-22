const jwt = require("jsonwebtoken");
import { Iuser } from "../interfaces/Iuser";


export const generateToken = (user : Iuser) => {
    const token = jwt.sign(user,process.env.ACCESS_TOKEN_SECRET,{expiresIn : "30s"});
    return token;
}