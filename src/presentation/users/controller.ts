import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/dtos/create-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { UserService } from '../services/user.service';
import { ResponseMapper } from '../../domain/responses/success';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';

export class UsersController {

  // DI
  constructor(
    public readonly userService: UserService,
  ) {}

  registerUser = (req: Request, res: Response) => {
    try {
        const [ error, registerDto ] = RegisterUserDto.create(req.body);
        if( error ) throw CustomError.badRequest(error);
        
        this.userService.createUser(registerDto!)
            .then((user) => ResponseMapper.success(res, 'User created', 200, user))
            .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error,res);
    }
  }

  loginUser = (req: Request, res: Response) => {
    try {
        const [error, loginUserDto] = LoginUserDto.create(req.body);
        if( error ) throw CustomError.badRequest(error);

        this.userService.loginUser(loginUserDto!)
            .then((user) => ResponseMapper.success(res, 'User logged in', 200, user))
            .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error,res);
    }
  }

  updateUser = (req: Request, res: Response) => {
    try {
        const id = +req.params.id;
        const [error, updateUserDto] = UpdateUserDto.create({...req.body, id});
        if( error ) throw CustomError.badRequest(error);

        if( id !== req.body.user.id ) throw CustomError.forbidden('You cant do this')

        this.userService.updateUser(updateUserDto!)
            .then((user) => ResponseMapper.success(res, 'User updated', 200, user))
            .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error,res);
    }
  }

}