-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'user';
