import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { MoodRoutes } from './mood-entries/routes';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    router.use('/api/users', UserRoutes.routes );
    router.use('/api/moods', MoodRoutes.routes );

    return router;
  }


}

