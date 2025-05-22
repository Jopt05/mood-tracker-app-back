import { Mood, Sleep } from "@prisma/client";

export class CreateMoodDto {

  private constructor(
    public mood: Mood,
    public sleep: Sleep,
    public authorId: number,
    public reflection?: string,
  ) {}

  static create( object: { [key:string]:any } ): [string?, CreateMoodDto?] {
    const { mood, sleep, authorId, reflection } = object;

    if ( !mood ) return ['Mood is required'];
    if( !Object.values(Mood).includes(mood) ) return [`Invalid mood value. Valid ones: ${ Object.values(Mood).join(',') }`]
    if ( !sleep ) return ['Sleep is required'];
    if( !Object.values(Sleep).includes(sleep) ) return [`Invalid sleep value. Valid ones: ${ Object.values(Sleep).join(',') }`]
    if( !authorId ) return ['Author id is required'];

    return [undefined, new CreateMoodDto(mood, sleep, authorId, reflection)];

  }


}