import { Response } from "express";
import { CustomError } from "../errors/custom.error";

export class ResponseMapper {

    static success(res: Response, message = 'Ok', statusCode = 200, payload: any) {
        return res.status(statusCode).json({
            message,
            statusCode,
            payload
        });
    }

    static fail(error: unknown, res: Response) {
        if ( error instanceof CustomError ) {
            return res.status(error.statusCode).json({ error: error.message });
        }

        console.log(`Hubo un error: ${ error }`);
        return res.status(500).json({ error: 'Internal server error' })
    }

}