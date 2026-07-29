import { bcryptAdapter } from "../../config/bycrypt.adapter";
import { JwtAdapter } from "../../config/jwt.adapter";
import { prisma } from "../../data/postgres";
import { RegisterUserDto } from "../../domain/dtos/create-user.dto";
import { LoginUserDto } from "../../domain/dtos/login-user.dto";
import { UpdateUserDto } from "../../domain/dtos/update-user.dto";
import { UserEntity } from "../../domain/entities/user.entity";
import { CustomError } from "../../domain/errors/custom.error";
import { EmailService } from "./mailer.service";
import { envs } from "../../config/envs";
import { CloudinaryService } from "./cloudinary.service";
import { UploadedFile } from "express-fileupload";
import { verifyEmailTemplate } from "../emails/verify-email.template";
import { resetPasswordTemplate } from "../emails/reset-password.template";

export class UserService {

    constructor(
        private mailService: EmailService,
        private cloudinaryService: CloudinaryService
    ) {}

    public async getUser( userId: number ) {
        const userExists = await prisma.user.findFirst({
            where: { id: userId }
        });
        if( !userExists ) throw CustomError.badRequest('User with provided ID does not exist');

        return UserEntity.fromObject( userExists );
    }

    public async createUser( registerUserDto: RegisterUserDto ) {
        const emailExists = await prisma.user.findFirst({
            where: { email: registerUserDto.email }
        });
        if( emailExists ) throw CustomError.badRequest('Email already exists');

        const newUser = await prisma.user.create({
            data: {
                email: registerUserDto.email,
                password: bcryptAdapter.hash(registerUserDto.password),
                name: registerUserDto.name,
            }
        });

        await this.sendVerificationEmail( newUser.email, newUser.id );

        return UserEntity.fromObject( newUser );
    }

    public async loginUser( loginUserDto: LoginUserDto) {
        const user = await prisma.user.findFirst({
            where: { email: loginUserDto.email }
        });
        if( !user ) throw CustomError.badRequest('Invalid email');

        const isCorrectPassword = bcryptAdapter.compare(loginUserDto.password, user.password);
        if( !isCorrectPassword ) throw CustomError.badRequest('Invalid credentials');

        const token = await JwtAdapter.generateToken({id: user.id}, '365d');

        return { token };
    }

    public async updateUser(updateUserDto: UpdateUserDto) {
        const { file, ...userDto } = updateUserDto.values;
        let fileUrl = null;
        const user = await prisma.user.findFirst({
            where: { id: userDto.id }
        });
        if( !user ) throw CustomError.badRequest(`User with id: ${userDto.id} does not exist`);

        if( file ) {
            const secure_url = await this.cloudinaryService.uploadImage((file as UploadedFile).tempFilePath);
            fileUrl = secure_url;
        }

        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: {
                ...userDto,
                ...(userDto.password) && { password: bcryptAdapter.hash(userDto.password) },
                ...(fileUrl) && { photoUrl: fileUrl }
            }
        });

        return UserEntity.fromObject(updatedUser);
    }

    public async sendResetPassword( userEmail: string ) {
        const user = await prisma.user.findFirst({
            where: { email: userEmail }
        });
        if( !user ) throw CustomError.badRequest(`User with email: ${userEmail} does not exist`);

        const token = await JwtAdapter.generateToken({id: user.id}, '1h');
        const link = `${ envs.FRONT_URL }/auth/reset-password?token=${ token }`;

        const isSent = await this.mailService.sendEmail({
            to: user.email,
            subject: 'Restablecer contraseña | Pachito',
            htmlBody: resetPasswordTemplate(link),
        });
        if ( !isSent ) throw CustomError.internalServer('Error sending email');

        return { sent: isSent };
    }

    public async verifyEmail( token: string ) {
        const payload = await JwtAdapter.validateToken(token);
        if( !payload ) throw CustomError.badRequest('Invalid or expired token');

        const { id } = payload as { id: number };

        const user = await prisma.user.findFirst({ where: { id } });
        if( !user ) throw CustomError.badRequest('User not found');
        if( user.emailVerified ) throw CustomError.badRequest('Email already verified');

        await prisma.user.update({
            where: { id },
            data: { emailVerified: true }
        });

        return { verified: true };
    }

    public async resendVerificationEmail( userEmail: string ) {
        const user = await prisma.user.findFirst({
            where: { email: userEmail }
        });
        if( !user ) throw CustomError.badRequest(`User with email: ${userEmail} does not exist`);
        if( user.emailVerified ) throw CustomError.badRequest('Email already verified');

        await this.sendVerificationEmail( user.email, user.id );

        return { sent: true };
    }

    private async sendVerificationEmail( email: string, userId: number ) {
        const token = await JwtAdapter.generateToken({ id: userId }, '24h');
        const link = `${ envs.FRONT_URL }/auth/verify-email?token=${ token }`;

        const isSent = await this.mailService.sendEmail({
            to: email,
            subject: 'Verifica tu correo | Pachito',
            htmlBody: verifyEmailTemplate(link),
        });
        if ( !isSent ) throw CustomError.internalServer('Error sending verification email');
    }
}
