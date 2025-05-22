export class UserEntity {

  constructor(
    public id: number,
    public email: string,
    public name: string,
    public password: string,
    public createdAt: Date,
    public updatedAt: Date,
  ) {}

  public static fromObject( object: {[key: string]: any} ): UserEntity {
    const { id, email, password, name, createdAt, updatedAt } = object;
    if ( !id ) throw 'Id is required';
    if ( !email ) throw 'Email is required';
    if ( !password ) throw 'Password is required';
    if ( !createdAt ) throw 'createdAt is required';
    if ( !updatedAt ) throw 'updatedAt is required';

    return new UserEntity(id, email, name, password, createdAt, updatedAt);
  }

}


