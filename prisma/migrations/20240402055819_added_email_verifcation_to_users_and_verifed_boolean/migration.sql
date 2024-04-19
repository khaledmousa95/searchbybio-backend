-- AlterTable
ALTER TABLE `users` ADD COLUMN `emailVerificationToken` INTEGER NOT NULL DEFAULT 10,
    ADD COLUMN `verifed` BOOLEAN NOT NULL DEFAULT false;
