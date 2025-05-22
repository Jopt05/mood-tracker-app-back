import { Mood, Sleep } from "@prisma/client";

export class MoodEntity {

  constructor(
    public id: number,
    public mood: Mood,
    public sleep: Sleep,
    public createdAt: Date,
    public updatedAt: Date,
    public authorId: number,
    public reflection?: string,
  ) {}

  public static fromObject( object: {[key: string]: any} ): MoodEntity {
    const { id, mood, sleep, createdAt, updatedAt, authorId, reflection } = object;
    if ( !id ) throw 'Id is required';
    if ( !mood ) throw 'Mood is required';
    if ( !sleep ) throw 'Sleep is required';
    if ( !createdAt ) throw 'CreatedAt is required';
    if ( !updatedAt ) throw 'UpdatedAt is required';
    if ( !authorId ) throw 'AuthorId is required';

    return new MoodEntity(id, mood, sleep, createdAt, updatedAt, authorId, reflection);
  }

}


