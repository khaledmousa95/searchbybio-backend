-- AlterTable
ALTER TABLE `users` ADD COLUMN `refreshToken` VARCHAR(255) NULL,
    MODIFY `registrationTokens` INTEGER NOT NULL DEFAULT 10;
