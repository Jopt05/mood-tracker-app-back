import { Router } from 'express';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { AdviceService } from '../services/advice.service';
import { AdviceController } from './routes';

export class AdiceRoutes {


  static get routes(): Router {

    const router = Router();

    const adviceService = new AdviceService();

    const controller = new AdviceController(adviceService);

    router.get('/', [AuthMiddleware.validateJWT], controller.getAdvice)

    return router;
  }

}

