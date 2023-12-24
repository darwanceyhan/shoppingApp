import { Request, Response, NextFunction } from 'express';
import * as bcrypt from 'bcrypt';
import { Ierror } from '../interfaces/Ierror';

export class HashGenerator {
    userPassword: string;
    errObject!: Ierror;

    constructor(userPassword: string) {
        this.userPassword = userPassword;
    }

    async hashPassword(req: Request, res: Response, next: NextFunction): Promise<void || string > {
        try {
            const hashedPassword = await bcrypt.hash(this.userPassword, 10)
            return hashedPassword
        } catch(error) {

            this.errObject = {
                message: "Can't hash password",
                statusCode: 500
            };
            next();
        }
    }
}
