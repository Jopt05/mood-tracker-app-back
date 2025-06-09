import { UploadedFile } from "express-fileupload";

export class UpdateUserDto {

  private constructor(
    public id: number,
    public email?: string,
    public name?: string,
    public photoUrl?: string,
    public password?: string,
    public file?: UploadedFile
  ) {}

  get values() {
    const returnObj: {[key: string]: any} = {};

    if( this.email ) returnObj.email = this.email;
    if( this.name ) returnObj.name = this.name;
    if( this.photoUrl ) returnObj.photoUrl = this.photoUrl;
    if( this.password ) returnObj.password = this.password;
    if( this.id ) returnObj.id = this.id;
    if( this.file ) returnObj.file = this.file;

    return returnObj;
  }

  static create( object: { [key:string]:any } ): [string?, UpdateUserDto?] {
    const { id, email, name, photoUrl, password, file } = object;

    if ( !id || isNaN( Number(id)) ) {
      return ['id must be a valid number'];
    }

    if( file ) {
      const validExtensions: string[] = ['png','gif', 'jpg','jpeg']
      const fileExtension = file.mimetype.split('/').at(1) ?? '';
      if ( !validExtensions.includes(fileExtension) ) {
          return ['Invalid file extension'];
      }
    }

    return [undefined, new UpdateUserDto(id, email, name, photoUrl, password, file)];
  }


}