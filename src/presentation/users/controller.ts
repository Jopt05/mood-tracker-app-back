import { Request, Response } from 'express';
import { RegisterUserDto } from '../../domain/dtos/create-user.dto';
import { CustomError } from '../../domain/errors/custom.error';
import { UserService } from '../services/user.service';
import { ResponseMapper } from '../../domain/responses/success';
import { LoginUserDto } from '../../domain/dtos/login-user.dto';
import { UpdateUserDto } from '../../domain/dtos/update-user.dto';
import { RequestResetDto } from '../../domain/dtos/request-reset.dto';

export class UsersController {

  constructor(
    public readonly userService: UserService,
  ) {}

  ping = (req: Request, res: Response) => {
    try {
      ResponseMapper.success(res, 'pong', 200, { message: 'pong' });
    } catch (error) {
      ResponseMapper.fail(error,res);
    }
  }

  getMe = (req: Request, res: Response) => {
    try {
      if( !req?.body?.user ) throw CustomError.badRequest('Token not provided');
      const { user } = req.body;
      
      this.userService.getUser(user.id)
        .then((user) => ResponseMapper.success(res, 'User obtained', 200, user))
        .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error,res);
    }
  }

  getUser = (req: Request, res: Response) => {
    try {
      const id = +req.params.id;
      if( !id ) throw CustomError.badRequest('Id is mising');
      
      this.userService.getUser(id)
        .then((user) => ResponseMapper.success(res, 'User obtained', 200, user))
        .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error,res);
    }
  }

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
        if( !req?.body?.user ) throw CustomError.badRequest('Token not provided');
        const { user } = req.body;

        const [error, updateUserDto] = UpdateUserDto.create({...req.body, id: user.id, ...req.params, file: req.body?.files?.at(0)});
        if( error ) throw CustomError.badRequest(error);

        this.userService.updateUser(updateUserDto!)
            .then((user) => ResponseMapper.success(res, 'User updated', 200, user))
            .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error,res);
    }
  }

  requestResetPassword = (req: Request, res: Response) => {
    try {
        const [error, resetPassDto] = RequestResetDto.create(req.body);
        if( error ) throw CustomError.badRequest(error);

        this.userService.sendResetPassword(resetPassDto?.email!)
            .then((result) => ResponseMapper.success(res, 'Email sent', 200, result))
            .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error, res);
    }
  }

  verifyEmail = (req: Request, res: Response) => {
    try {
        const { token } = req.body;
        if( !token ) throw CustomError.badRequest('Token is required');

        this.userService.verifyEmail(token)
            .then((result) => ResponseMapper.success(res, 'Email verified', 200, result))
            .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error, res);
    }
  }

  resendVerificationEmail = (req: Request, res: Response) => {
    try {
        const [error, resetPassDto] = RequestResetDto.create(req.body);
        if( error ) throw CustomError.badRequest(error);

        this.userService.resendVerificationEmail(resetPassDto?.email!)
            .then((result) => ResponseMapper.success(res, 'Verification email sent', 200, result))
            .catch((error) => ResponseMapper.fail(error, res))
    } catch (error) {
        ResponseMapper.fail(error, res);
    }
  }

}
