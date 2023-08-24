/*
  Warnings:

  - You are about to drop the `youtube_channels` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `youtube_channels`;

-- CreateTable
CREATE TABLE `twitter_accounts2` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `username` VARCHAR(255) NOT NULL,
    `bio` VARCHAR(191) NULL,
    `link` VARCHAR(191) NULL,

    UNIQUE INDEX `twitter_accounts2_username_key`(`username`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
