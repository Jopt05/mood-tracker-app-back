import { prisma } from "../../data/postgres";
import { DaysRangeDto } from "../../domain/dtos/days-range.dto";
import { Mood, Sleep, Prisma } from "@prisma/client";


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

    /**
     * Obtiene la distribución porcentual de moods y sleep de un usuario
     * durante un período específico de días hacia atrás.
     * 
     * @param userId - ID del usuario
     * @param daysRangeDto - DTO con el rango de días hacia atrás
     * @returns Objeto con distribuciones porcentuales de mood y sleep
     * 
     * @example
     * const distribution = await statService.getDistribution(123, new DaysRangeDto({ daysRange: 30 }));
     * // {
     * //   moodDistribution: { HAPPY: 30, VERY_HAPPY: 40, SAD: 30, ... },
     * //   sleepDistribution: { FIVE_SIX: 25, SEVEN_EIGHT: 50, ... }
     * // }
     */
    public async getDistribution(
        userId: number,
        daysRangeDto: DaysRangeDto
    ): Promise<{
        moodDistribution: Record<Mood, number>;
        sleepDistribution: Record<Sleep, number>;
    }> {
        // Inicializar distribuciones con todos los valores del enum en 0
        const moodDistribution: Record<Mood, number> = {
            VERY_SAD: 0,
            SAD: 0,
            NEUTRAL: 0,
            HAPPY: 0,
            VERY_HAPPY: 0
        };

        const sleepDistribution: Record<Sleep, number> = {
            ZER0_TWO: 0,
            THREE_FOUR: 0,
            FIVE_SIX: 0,
            SEVEN_EIGHT: 0,
            NINE: 0
        };

        // Consultar conteos de mood
        const moodCounts = await prisma.$queryRaw<
            { mood: Mood; count: bigint }[]
        >(
            Prisma.sql`
                SELECT mood, COUNT(*) as count
                FROM mood_entries
                WHERE "authorId" = ${userId}
                AND "createdAt" >= NOW() - INTERVAL '${Prisma.raw(daysRangeDto.daysRange.toString())} days'
                GROUP BY mood
            `
        );

        // Consultar conteos de sleep
        const sleepCounts = await prisma.$queryRaw<
            { sleep: Sleep; count: bigint }[]
        >(
            Prisma.sql`
                SELECT sleep, COUNT(*) as count
                FROM mood_entries
                WHERE "authorId" = ${userId}
                AND "createdAt" >= NOW() - INTERVAL '${Prisma.raw(daysRangeDto.daysRange.toString())} days'
                GROUP BY sleep
            `
        );

        // Calcular total de entradas
        const totalMood = moodCounts.reduce((sum, item) => sum + Number(item.count), 0);
        const totalSleep = sleepCounts.reduce((sum, item) => sum + Number(item.count), 0);

        // Calcular porcentajes de mood
        if (totalMood > 0) {
            moodCounts.forEach(item => {
                const percentage = (Number(item.count) / totalMood) * 100;
                moodDistribution[item.mood] = Math.round(percentage * 100) / 100;
            });
        }

        // Calcular porcentajes de sleep
        if (totalSleep > 0) {
            sleepCounts.forEach(item => {
                const percentage = (Number(item.count) / totalSleep) * 100;
                sleepDistribution[item.sleep] = Math.round(percentage * 100) / 100;
            });
        }

        return {
            moodDistribution,
            sleepDistribution
        };
    }

}