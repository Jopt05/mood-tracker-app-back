import { prisma } from "../../data/postgres";
import { CreateMoodDto } from "../../domain/dtos/create-mood.dto";
import { UpdateMoodDto } from "../../domain/dtos/update-mood.dto";
import { MoodEntity } from "../../domain/entities/mood.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class MoodService {
    constructor() {}

    public async getMyMood( userId: number ) {
        const moodData = await prisma.moodEntry.findMany({
            where: {
                authorId: userId
            },
            take: 10,
            orderBy: {
                createdAt: "desc"
            }
        });

        return moodData.map(entry => MoodEntity.fromObject(entry));
    }

    public async createMoodEntry( createMoodDto: CreateMoodDto ) {
        const userExists = await prisma.user.findFirst({
            where: {
                id: createMoodDto.authorId
            }
        });

        if( !userExists ) throw CustomError.badRequest('User does not exist');

        const todayDate = new Date();
        const yesterdayDate = new Date( todayDate.setDate( todayDate.getDate() - 1 ) );
        
        const existingMoodEntry = await prisma.moodEntry.findFirst({
            where: {
                createdAt: {
                    gt: yesterdayDate
                },
                authorId: createMoodDto.authorId
            }
        });
        
        if ( existingMoodEntry ) throw CustomError.badRequest('You already created a mood entry today');

        const newMoodEntry = await prisma.moodEntry.create({
            data: {
                authorId: createMoodDto.authorId,
                reflection: createMoodDto.reflection,
                sleep: createMoodDto.sleep,
                mood: createMoodDto.mood
            }
        });

        return MoodEntity.fromObject(newMoodEntry);
    }

    public async updateMoodEntry( updateMoodDto: UpdateMoodDto ) {
        const moodEntry = await prisma.moodEntry.findFirst({
            where: {
                id: updateMoodDto.id
            }
        });
        if( !moodEntry ) throw CustomError.badRequest('Entry does not exist');

        const updatedEntry = await prisma.moodEntry.update({
            where: {
                id: moodEntry.id
            },
            data:updateMoodDto.values
        });

        return MoodEntity.fromObject(updatedEntry);
    }
}