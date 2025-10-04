-- AlterTable
ALTER TABLE "Empresa" ADD COLUMN     "contato" TEXT[],
ADD COLUMN     "endereco" JSONB;

-- AlterTable
ALTER TABLE "Usuario" ADD COLUMN     "avatarUrl" TEXT,
ADD COLUMN     "contato" TEXT[],
ADD COLUMN     "endereco" JSONB;
