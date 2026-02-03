import { Request, Response } from "express";
import { ResponseMapper } from "../../domain/responses/success";
import { StatService } from "../services/stats.service";
import { CustomError } from "../../domain/errors/custom.error";
import { DaysRangeDto } from "../../domain/dtos/days-range.dto";


export class StatsController {

    constructor(
        private statsService: StatService
    ) {}

    getAverage = (req: Request, res: Response) => {
        try {
            const { user } = req.body;
            if( !user ) throw CustomError.badRequest('Token not sent');

            const { days = "" } = req.query;

            const [ error, daysRangeDto ] = DaysRangeDto.create({days});
            if( error ) throw CustomError.badRequest(error);

            this.statsService.getAverage(user.id, daysRangeDto!)
                .then((stats) => ResponseMapper.success(res, 'Stats obtained', 200, stats))
                .catch((error) => ResponseMapper.fail(error, res))
        } catch (error) {
            ResponseMapper.fail(error, res);
        }
    }

}