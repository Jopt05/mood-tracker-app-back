import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UsersController } from './controller';
import { AuthMiddleware } from '../middlewares/auth.middleware';

export class UserRoutes {


  static get routes(): Router {

    const router = Router();

    const userService = new UserService();

    const controller = new UsersController(userService);
    
    // Definir las rutas
    router.get('/:id', controller.getUser );
    router.post('/', controller.registerUser );
    router.post('/login', controller.loginUser );
    router.put('/:id', [ AuthMiddleware.validateJWT ], controller.updateUser );

    return router;
  }


}

