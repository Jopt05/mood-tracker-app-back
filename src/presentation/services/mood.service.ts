import { prisma } from "../../data/postgres";
import { CreateMoodDto } from "../../domain/dtos/create-mood.dto";
import { PaginationDto } from "../../domain/dtos/shared/pagination.dto";
import { UpdateMoodDto } from "../../domain/dtos/update-mood.dto";
import { MoodEntity } from "../../domain/entities/mood.entity";
import { CustomError } from "../../domain/errors/custom.error";

export class MoodService {
    constructor() {}

    public async getMyMood( userId: number, paginationDto: PaginationDto ) {

        const { page, limit } = paginationDto;

        const moodData = await prisma.moodEntry.findMany({
            where: {
                authorId: userId
            },
            skip: (page - 1) * limit,
            take: limit,
            orderBy: {
                createdAt: "asc"
            }
        });

        const totalCount = await prisma.moodEntry.count({
            where: {
                authorId: userId
            }
        });

        return {
            page: page,
            limit: limit,
            total: totalCount,
            next: `/api/mood?page=${page + 1}&limit=${limit}`,
            previous: (page - 1 > 0) ? `/api/mood?page=${page - 1}&limit=${limit}` : null,
            mood: moodData.map(entry => MoodEntity.fromObject(entry))
        };
    }

    public async createMoodEntry( createMoodDto: CreateMoodDto ) {
        const userExists = await prisma.user.findFirst({
            where: {
                id: createMoodDto.authorId
            }
        });

        if( !userExists ) throw CustomError.badRequest('User does not exist');

        const todayDate = new Date();
        
        const existingMoodEntry = await prisma.moodEntry.findFirst({
            where: {
                createdAt: {
                    gte: todayDate
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