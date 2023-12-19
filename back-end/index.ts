import { Request, Response } from 'express';

const express = require("express")

const server = express();

server.get('/', (req : Request, res : Response) => {
    res.send('Hello World');
});

server.listen(3000, () => {
    console.log('Listening on port 3000');
});
