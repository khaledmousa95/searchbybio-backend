/*
  Warnings:

  - You are about to drop the column `updated` on the `users` table. All the data in the column will be lost.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `twitter_accounts` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `twitter_accounts2` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `youtube_channels` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `users` DROP COLUMN `updated`,
    ADD COLUMN `registrationTokens` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- DropTable
DROP TABLE `User`;

-- DropTable
DROP TABLE `twitter_accounts`;

-- DropTable
DROP TABLE `twitter_accounts2`;

-- DropTable
DROP TABLE `youtube_channels`;
