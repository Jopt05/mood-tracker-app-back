import { Request } from "express";
import { bcryptAdapter } from "../../config/bycrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from "../../data/postgres";
import { RegisterUserDto } from "../../domain/dtos/create-user.dto";
import { LoginUserDto } from "../../domain/dtos/login-user.dto";
import { UpdateUserDto } from "../../domain/dtos/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class UserService {
    constructor() {}

    public async getUser( userId: number ) {
        const userExists = await prisma.user.findFirst({
            where: {
                id: userId
            }
        });
        if( !userExists ) throw CustomError.badRequest('User with provided ID does not exist');

        return UserEntity.fromObject( userExists );
    }

    public async createUser( registerUserDto: RegisterUserDto ) {
        const emailExists = await prisma.user.findFirst({
            where: {
                email: registerUserDto.email
            }
        });
        if( emailExists ) throw CustomError.badRequest('Email already exists');

        const newUser = await prisma.user.create({
            data: {
                email: registerUserDto.email,
                password: bcryptAdapter.hash(registerUserDto.password),
                name: registerUserDto.name,
            }
        });

        return UserEntity.fromObject( newUser );
    }

    public async loginUser( loginUserDto: LoginUserDto) {
        const user = await prisma.user.findFirst({
            where: {
                email: loginUserDto.email
            }
        });
        if( !user ) throw CustomError.badRequest('Invalid email');

        const isCorrectPassword = bcryptAdapter.compare(loginUserDto.password, user.password);
        if( !isCorrectPassword ) throw CustomError.badRequest('Invalid credentials');

        const token = await JwtAdapter.generateToken({id: user.id})

        return {
            token
        };
    }

    public async updateUser(updateUserDto: UpdateUserDto ) {
        const user = await prisma.user.findFirst({
            where: {
                id: updateUserDto.id
            }
        });
        if( !user ) throw CustomError.badRequest(`User with id: ${updateUserDto.id} does not exist`)

        const updatedUser = await prisma.user.update({
            where: {
                id: user.id
            },
            data: updateUserDto.values
        });

        return UserEntity.fromObject(updatedUser)
    }
}