import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UsersController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { EmailService } from '../services/mailer.service';
import { envs } from '../../config/envs';

export class UserRoutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const userService = new UserService(emailService);

    const controller = new UsersController(userService);
    
    // Definir las rutas
    router.get('/', [ AuthMiddleware.validateJWT ], controller.getMe );
    router.get('/auth/reset-password', [ AuthMiddleware.validateJWT ], controller.requestResetPassword );
    router.get('/:id', controller.getUser );
    router.post('/', controller.registerUser );
    router.post('/login', controller.loginUser );
    router.put('/', [ AuthMiddleware.validateJWT ], controller.updateUser );

    return router;
  }


}

