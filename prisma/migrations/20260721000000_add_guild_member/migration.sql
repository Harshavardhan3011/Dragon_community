-- CreateTable
CREATE TABLE "GuildMember" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "nickname" TEXT NOT NULL,
    "avatar" TEXT,
    "uid" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'PLAYER',
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "joinedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "favoriteGame" TEXT,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "country" TEXT,
    "about" TEXT,
    "achievements" TEXT,
    "rank" TEXT,
    "level" INTEGER,
    "matchesPlayed" INTEGER,
    "wins" INTEGER,
    "mvpCount" INTEGER,
    "favoriteWeapon" TEXT,
    "favoriteCharacter" TEXT,
    "favoritePet" TEXT,
    "device" TEXT,
    "youtube" TEXT,
    "instagram" TEXT,
    "discord" TEXT,
    "facebook" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "GuildMember_uid_key" ON "GuildMember"("uid");
