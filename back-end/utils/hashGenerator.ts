import { Request, Response, NextFunction } from "express";
import * as bcrypt from "bcrypt";
import { Ierror } from "../interfaces/Ierror";

export class HashGenerator {
    private userPassword: string;
    private hashedPassword?: string;
    private errObject?: Ierror;

    constructor(userPassword: string) {
        this.userPassword = userPassword;
    }

    async hashPassword(
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> {
        try {
            this.hashedPassword = await bcrypt.hash(this.userPassword, 10);
        } catch (error) {
            this.errObject = {
                message: "Can't hash password",
                statusCode: 500,
            };
            next(this.errObject);
        }
    }
    //compare to both hashed password
    async comparePassword(enteredPassword: string): Promise<boolean> {
        if (!this.hashedPassword) {
            throw new Error("Password is not hashed yet");
        }

        try {
            return await bcrypt.compare(enteredPassword, this.hashedPassword);
        } catch (error) {
            return false;
        }
    }

    getHashedPassword(): string | undefined {
        return this.hashedPassword;
    }
}
