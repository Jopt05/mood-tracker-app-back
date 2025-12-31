import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { MoodService } from '../services/mood.service';
import { MoodController } from './controller';

export class MoodRoutes {


  static get routes(): Router {

    const router = Router();

    const moodService = new MoodService();

    const controller = new MoodController(moodService);

    router.get('/', [AuthMiddleware.validateJWT], controller.getMoods)
    router.get('/month/:month/:year', [AuthMiddleware.validateJWT], controller.getMoodsByMonthAndYear)
    router.post('/', [AuthMiddleware.validateJWT], controller.createMood)
    router.put('/:id', [AuthMiddleware.validateJWT], controller.updateMood)

    return router;
  }

}

