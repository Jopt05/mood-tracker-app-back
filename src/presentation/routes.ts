import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { MoodRoutes } from './mood-entries/routes';
import { AdiceRoutes } from './advices/controller';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    router.use('/api/users', UserRoutes.routes );
    router.use('/api/moods', MoodRoutes.routes );
    router.use('/api/advices', AdiceRoutes.routes );

    return router;
  }


}

