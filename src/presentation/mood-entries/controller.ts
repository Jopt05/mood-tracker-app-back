import { Request, Response } from "express";
import { MoodService } from "../services/mood.service";
import { ResponseMapper } from "../../domain/responses/success";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateMoodDto } from "../../domain/dtos/create-mood.dto";
import { UpdateMoodDto } from "../../domain/dtos/update-mood.dto";

export class MoodController {

    constructor(
        private moodService: MoodService
    ){ }

    getMoods = (req: Request, res: Response) => {
        try {
            const { user } = req.body;
            if( !user ) throw CustomError.notFound('Token not sent');

            this.moodService.getMyMood(user.id)
                .then((user) => ResponseMapper.success(res, 'Moods obtained', 200, user))
                .catch((error) => ResponseMapper.fail(error, res))
        } catch (error) {
            ResponseMapper.fail(error,res);
        }
    }

    createMood = (req: Request, res: Response) => {
        try {
            const { user } = req.body;
            if( !user ) throw CustomError.badRequest('Token not provided');

            const [error, createMoodDto] = CreateMoodDto.create({...req.body, authorId: user.id});
            if( error ) throw CustomError.badRequest(error);

            this.moodService.createMoodEntry(createMoodDto!)
                .then((mood) => ResponseMapper.success(res, 'Mood created', 200, mood))
                .catch((error) => ResponseMapper.fail(error, res))
        } catch (error) {
            ResponseMapper.fail(error,res);
        }
    }

    updateMood = (req: Request, res: Response) => {
        try {
            const { user } = req.body;
            if( !user ) throw CustomError.badRequest('Token not provided');

            const id = +req.params.id;
            const [error, updateMoodDto] = UpdateMoodDto.create({...req.body, id});
            if( error ) throw CustomError.badRequest(error);

            this.moodService.updateMoodEntry(updateMoodDto!)
                .then((mood) => ResponseMapper.success(res, 'Mood updated', 200, mood))
                .catch((error) => ResponseMapper.fail(error, res))
        } catch (error) {
            ResponseMapper.fail(error,res);
        }
    }

}