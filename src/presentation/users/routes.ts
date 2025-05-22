import { envs } from '../../config/envs';
import { Router } from 'express';
import { UserService } from '../services/user.service';
import { UsersController } from './controller';

export class UserRoutes {


  static get routes(): Router {

    const router = Router();

    const userService = new UserService();

    const controller = new UsersController(userService);
    
    // Definir las rutas
    router.post('/', controller.registerUser );
    router.post('/login', controller.loginUser );
    router.put('/:id', controller.updateUser );

    return router;
  }


}

