import { Request, Response } from "express";
import { MoodService } from "../services/mood.service";
import { ResponseMapper } from "../../domain/responses/success";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateMoodDto } from "../../domain/dtos/create-mood.dto";
import { UpdateMoodDto } from "../../domain/dtos/update-mood.dto";
import { AdviceService } from "../services/advice.service";

export class AdviceController {

    constructor(
        private adviceService: AdviceService
    ){ }

    getAdvice = (req: Request, res: Response) => {
        try {
            const { user } = req.body;
            if( !user ) throw CustomError.notFound('Token not sent');

            this.adviceService.getAdvice()
                .then((user) => ResponseMapper.success(res, 'Advice obtained', 200, user))
                .catch((error) => ResponseMapper.fail(error, res))
        } catch (error) {
            ResponseMapper.fail(error,res);
        }
    }

}