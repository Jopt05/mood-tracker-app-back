import { Router } from "express";
import { StatService } from "../services/stats.service";
import { StatsController } from "./controller";
import { AuthMiddleware } from "../middlewares/auth.middleware";

export class StatsRoutes {

    static get routes(): Router {
        
        const router = Router();

        const statsService = new StatService();

        const controller = new StatsController(
            statsService
        );

        router.get('/average', [AuthMiddleware.validateJWT], controller.getAverage)

        return router;
    }

}