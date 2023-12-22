import { Request, Response ,NextFunction} from 'express';
const express = require("express")
const loginRouter = require("./routers/login.router");
const dotenv = require("dotenv");

dotenv.config()
const server = express();
server.use("/login",loginRouter);


server.get('/', (req : Request, res : Response , next : NextFunction) => {
    res.send('Hello World');
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
