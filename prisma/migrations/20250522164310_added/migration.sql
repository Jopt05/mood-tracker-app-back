-- CreateEnum
CREATE TYPE "Mood" AS ENUM ('VERY_SAD', 'SAD', 'NEUTRAL', 'HAPPY', 'VERY_HAPPY');

-- CreateEnum
CREATE TYPE "Sleep" AS ENUM ('ZER0_TWO', 'THREE_FOUR', 'FIVE_SIX', 'SEVEN_EIGHT', 'NINE');

-- CreateTable
CREATE TABLE "mood_entries" (
    "id" SERIAL NOT NULL,
    "mood" "Mood" NOT NULL DEFAULT 'NEUTRAL',
    "sleep" "Sleep" NOT NULL DEFAULT 'ZER0_TWO',
    "reflection" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "authorId" INTEGER NOT NULL,

    CONSTRAINT "mood_entries_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "mood_entries" ADD CONSTRAINT "mood_entries_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "user"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
