import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UsersController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';
import { EmailService } from '../services/mailer.service';
import { envs } from '../../config/envs';
import { FileUploadMiddleware } from '../middlewares/fileupload.middleware';
import { CloudinaryService } from '../services/cloudinary.service';

export class UserRoutes {


  static get routes(): Router {

    const router = Router();

    const emailService = new EmailService(
      envs.MAILER_SERVICE,
      envs.MAILER_EMAIL,
      envs.MAILER_SECRET_KEY,
      envs.SEND_EMAIL
    );

    const cloudinaryService = new CloudinaryService();

    const userService = new UserService(emailService, cloudinaryService);

    const controller = new UsersController(userService);
    
    // Definir las rutas
    router.get('/', [ AuthMiddleware.validateJWT ], controller.getMe );
    router.post('/auth/reset-password', controller.requestResetPassword );
    router.get('/:id', controller.getUser );
    router.get('/auth/ping', controller.ping );
    router.post('/', controller.registerUser );
    router.post('/login', controller.loginUser );
    router.put('/', [ AuthMiddleware.validateJWT, FileUploadMiddleware.containFiles ], controller.updateUser );

    return router;
  }


}

