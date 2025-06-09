import { NextFunction, Request, Response } from 'express';

export class FileUploadMiddleware {


  static containFiles(req: Request, res: Response, next: NextFunction ) {

    if( req.files ) {
        if ( !Array.isArray( req.files.file ) ) {
            req.body.files = [ req.files.file ];
            } else {
            req.body.files = req.files.file;
        }
    }

    next();
  }



}