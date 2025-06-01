/*
  Warnings:

  - You are about to drop the column `solution` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `exercises` table. All the data in the column will be lost.
  - You are about to drop the column `choices` on the `quiz_questions` table. All the data in the column will be lost.
  - You are about to drop the column `correct` on the `quiz_questions` table. All the data in the column will be lost.
  - You are about to drop the column `explanation` on the `quiz_questions` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `quiz_questions` table. All the data in the column will be lost.
  - The `type` column on the `roadmap_nodes` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `role` column on the `users` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `correctAnswer` to the `exercises` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `difficulty` on the `exercises` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `exercise_id` to the `quiz_questions` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- CreateEnum
CREATE TYPE "NodeType" AS ENUM ('progressNode');

-- CreateEnum
CREATE TYPE "ExerciseDifficulty" AS ENUM ('EASY', 'MEDIUM', 'HARD');

-- AlterTable
ALTER TABLE "exercises" DROP COLUMN "solution",
DROP COLUMN "type",
ADD COLUMN     "choices" TEXT[],
ADD COLUMN     "correctAnswer" TEXT NOT NULL,
ADD COLUMN     "explanation" TEXT,
DROP COLUMN "difficulty",
ADD COLUMN     "difficulty" "ExerciseDifficulty" NOT NULL;

-- AlterTable
ALTER TABLE "quiz_questions" DROP COLUMN "choices",
DROP COLUMN "correct",
DROP COLUMN "explanation",
DROP COLUMN "question",
ADD COLUMN     "exercise_id" TEXT NOT NULL,
ADD COLUMN     "orderIndex" INTEGER;

-- AlterTable
ALTER TABLE "roadmap_nodes" DROP COLUMN "type",
ADD COLUMN     "type" "NodeType" NOT NULL DEFAULT 'progressNode';

-- AlterTable
ALTER TABLE "users" DROP COLUMN "role",
ADD COLUMN     "role" "Role" DEFAULT 'USER';

-- CreateIndex
CREATE INDEX "node_exercises_node_id_idx" ON "node_exercises"("node_id");

-- CreateIndex
CREATE INDEX "node_exercises_exercise_id_idx" ON "node_exercises"("exercise_id");

-- CreateIndex
CREATE INDEX "quiz_questions_quiz_id_idx" ON "quiz_questions"("quiz_id");

-- CreateIndex
CREATE INDEX "quiz_questions_exercise_id_idx" ON "quiz_questions"("exercise_id");

-- CreateIndex
CREATE INDEX "roadmap_edges_roadmap_id_idx" ON "roadmap_edges"("roadmap_id");

-- CreateIndex
CREATE INDEX "roadmap_nodes_roadmap_id_idx" ON "roadmap_nodes"("roadmap_id");

-- CreateIndex
CREATE INDEX "user_exercise_progress_user_id_idx" ON "user_exercise_progress"("user_id");

-- CreateIndex
CREATE INDEX "user_exercise_progress_exercise_id_idx" ON "user_exercise_progress"("exercise_id");

-- CreateIndex
CREATE INDEX "user_quiz_results_user_id_idx" ON "user_quiz_results"("user_id");

-- CreateIndex
CREATE INDEX "user_quiz_results_quiz_id_idx" ON "user_quiz_results"("quiz_id");

-- AddForeignKey
ALTER TABLE "quiz_questions" ADD CONSTRAINT "quiz_questions_exercise_id_fkey" FOREIGN KEY ("exercise_id") REFERENCES "exercises"("id") ON DELETE CASCADE ON UPDATE CASCADE;
