export class UpdateUserDto {

  private constructor(
    public id: number,
    public email?: string,
    public name?: string,
    public photoUrl?: string,
    public password?: string,
  ) {}

  get values() {
    const returnObj: {[key: string]: any} = {};

    if( this.email ) returnObj.email = this.email;
    if( this.name ) returnObj.name = this.name;
    if( this.photoUrl ) returnObj.photoUrl = this.photoUrl;
    if( this.password ) returnObj.password = this.password;

    return returnObj;
  }

  static create( object: { [key:string]:any } ): [string?, UpdateUserDto?] {
    const { id, email, name, photoUrl, password } = object;

    if ( !id || isNaN( Number(id)) ) {
      return ['id must be a valid number'];
    }

    return [undefined, new UpdateUserDto(id, email, name, photoUrl, password)];
  }


}