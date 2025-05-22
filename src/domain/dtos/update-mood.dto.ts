import { Mood, Sleep } from "@prisma/client";

export class UpdateMoodDto {

  private constructor(
    public id: number,
    public mood?: Mood,
    public sleep?: Sleep,
    public reflection?: string,
  ) {}

  get values() {
    const returnObj: {[key: string]: any} = {};

    if( this.mood ) returnObj.mood = this.mood;
    if( this.sleep ) returnObj.sleep = this.sleep;
    if( this.reflection ) returnObj.reflection = this.reflection;

    return returnObj;
  }

  static create( object: { [key:string]:any } ): [string?, UpdateMoodDto?] {
    const { id, mood, sleep, reflection } = object;

    if ( !id || isNaN( Number(id)) ) {
      return ['id must be a valid number'];
    }

    if( mood && !Object.values(Mood).includes(mood) ) return [`Invalid mood value. Valid ones: ${ Object.values(Mood).join(',') }`]
    if( sleep && !Object.values(Sleep).includes(sleep) ) return [`Invalid sleep value. Valid ones: ${ Object.values(Sleep).join(',') }`]

    return [undefined, new UpdateMoodDto(id, mood, sleep, reflection)];
  }


}