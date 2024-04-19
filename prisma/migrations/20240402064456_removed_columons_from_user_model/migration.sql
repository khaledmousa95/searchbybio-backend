/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `registrationTokens` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `LoginAttempt` DROP FOREIGN KEY `LoginAttempt_userId_fkey`;

-- DropIndex
DROP INDEX `User_email_key` ON `User`;

-- DropIndex
DROP INDEX `User_username_key` ON `User`;

-- AlterTable
ALTER TABLE `User` DROP COLUMN `refreshToken`,
    DROP COLUMN `registrationTokens`;

-- AddForeignKey
ALTER TABLE `LoginAttempt` ADD CONSTRAINT `LoginAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
