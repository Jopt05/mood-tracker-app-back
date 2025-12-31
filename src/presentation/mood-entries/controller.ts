import { Request, Response } from "express";
import { MoodService } from "../services/mood.service";
import { ResponseMapper } from "../../domain/responses/success";
import { CustomError } from "../../domain/errors/custom.error";
import { CreateMoodDto } from "../../domain/dtos/create-mood.dto";
import { UpdateMoodDto } from "../../domain/dtos/update-mood.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";

export class MoodController {

    constructor(
        private moodService: MoodService
    ){ }

    getMoods = (req: Request, res: Response) => {
        try {
            const { user } = req.body;
            if( !user ) throw CustomError.notFound('Token not sent');

            const { page = 1, limit = 10 } = req.query;
            const [ error, paginationDto ] = PaginationDto.create( +page, +limit );
            if( error ) throw CustomError.badRequest(error);

            this.moodService.getMyMood(user.id, paginationDto!)
                .then((user) => ResponseMapper.success(res, 'Moods obtained', 200, user))
                .catch((error) => ResponseMapper.fail(error, res))
        } catch (error) {
            ResponseMapper.fail(error,res);
        }
    }

    getMoodsByMonthAndYear = (req: Request, res: Response) => {
        try {
            const { user } = req.body;
            if( !user ) throw CustomError.badRequest('Token not provided');

            const { month, year } = req.params;
            if( !month || !year ) throw CustomError.badRequest('Month and year are required');

            this.moodService.getMoodsByMonthAndYear(user.id, +month, +year)
                .then((moods) => ResponseMapper.success(res, 'Moods obtained', 200, moods))
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