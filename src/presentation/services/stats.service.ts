import { prisma } from "../../data/postgres";
import { DaysRangeDto } from "../../domain/dtos/days-range.dto";


export class StatService {

    constructor(){}

    public async getAverage(
        userId: number, 
        daysRangeDto: DaysRangeDto
    ) {

        const stats = await prisma.$queryRaw<
            { avg_mood: number; avg_sleep: number }[]
        >`
            SELECT
                AVG(
                CASE mood
                    WHEN 'VERY_SAD' THEN 1
                    WHEN 'SAD' THEN 2
                    WHEN 'NEUTRAL' THEN 3
                    WHEN 'HAPPY' THEN 4
                    WHEN 'VERY_HAPPY' THEN 5
                END
                ) AS avg_mood,
                AVG(
                CASE sleep
                    WHEN 'ZER0_TWO' THEN 1
                    WHEN 'THREE_FOUR' THEN 2
                    WHEN 'FIVE_SIX' THEN 3
                    WHEN 'SEVEN_EIGHT' THEN 4
                    WHEN 'NINE' THEN 5
                END
                ) AS avg_sleep
            FROM mood_entries
            WHERE "authorId" = ${userId} 
            AND "createdAt" >= NOW() - INTERVAL '${daysRangeDto.daysRange} days';
        `
        return stats?.[0];
    }

}