-- DropForeignKey
ALTER TABLE `LoginAttempt` DROP FOREIGN KEY `LoginAttempt_userId_fkey`;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `refreshToken` VARCHAR(191) NULL,
    ADD COLUMN `registrationTokens` INTEGER NOT NULL DEFAULT 10;

-- AddForeignKey
ALTER TABLE `LoginAttempt` ADD CONSTRAINT `LoginAttempt_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
