import { JwtAdapter } from '../../config/jwt.adapter';
import { UserEntity } from '../../domain/entities/user.entity';
import { prisma } from '../../data/postgres';
import { NextFunction } from 'express';


export class AuthMiddleware {


  static async validateJWT( req: any, res: any, next: NextFunction ) {

    const authorization = req.header('Authorization');
    if( !authorization ) return res.status(401).json({ error: 'No token provided' });
    if ( !authorization.startsWith('Bearer ') ) return res.status(401).json({ error: 'Invalid Bearer token' });

    const token = authorization.split(' ').at(1) || '';

    try {

      const payload = await JwtAdapter.validateToken<{ id: number }>(token);
      if ( !payload ) return res.status(401).json({ error: 'Invalid token' })
      
      const user = await prisma.user.findFirst({
        where: {
            id: payload.id
        }
      });
      if ( !user ) return res.status(401).json({ error: 'Invalid token - user' });

      req.body.user = UserEntity.fromObject(user);

      next();

    } catch (error) {
      
      console.log(error);
      res.status(500).json({ error: 'Internal server error' });

    }
    
  }

}


