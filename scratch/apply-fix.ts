import { Client } from 'pg';
import * as dotenv from 'dotenv';
import * as path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

const sql = `
-- CreateEnum
DO $$ BEGIN
    CREATE TYPE "public"."VerificationType" AS ENUM ('TRANSACTION', 'WITHDRAWAL', 'TRANSFER', 'AUTH');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- CreateTable
CREATE TABLE IF NOT EXISTS "public"."verification_tokens" (
    "id" TEXT NOT NULL,
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "type" "public"."VerificationType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "verification_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
DO $$ BEGIN
    CREATE UNIQUE INDEX "verification_tokens_identifier_token_key" ON "public"."verification_tokens"("identifier", "token");
EXCEPTION
    WHEN duplicate_table THEN null;
END $$;
`;

async function main() {
  const client = new Client({
    connectionString: process.env.DIRECT_URL || process.env.DATABASE_URL,
    ssl: {
      rejectUnauthorized: false
    }
  });

  try {
    await client.connect();
    console.log('Connected to database');
    await client.query(sql);
    console.log('SQL applied successfully');
  } catch (err) {
    console.error('Error applying SQL:', err);
  } finally {
    await client.end();
  }
}

main();
