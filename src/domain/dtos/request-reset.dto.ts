export class RequestResetDto {

  private constructor(
    public email: string
  ) {}

  static create( object: { [key:string]:any } ): [string?, RequestResetDto?] {
    const { email } = object;

    if ( !email ) return ['Missing email'];

    return [undefined, new RequestResetDto(email)];

  }


}