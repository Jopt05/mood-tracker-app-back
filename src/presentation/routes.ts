import { Router } from 'express';
import { UserRoutes } from './users/routes';
import { MoodRoutes } from './mood-entries/routes';
import { AdiceRoutes } from './advices/controller';
import { StatsRoutes } from './stats/routes';

export class AppRoutes {


  static get routes(): Router {

    const router = Router();

    router.use('/api/users', UserRoutes.routes );
    router.use('/api/moods', MoodRoutes.routes );
    router.use('/api/advices', AdiceRoutes.routes );
    router.use('/api/stats', StatsRoutes.routes )

    return router;
  }


}

