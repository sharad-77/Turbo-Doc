CREATE TABLE "user" (
  "id"                   TEXT PRIMARY KEY,
  "name"                 TEXT NOT NULL,
  "email"                TEXT NOT NULL UNIQUE,
  "emailVerified"        BOOLEAN NOT NULL DEFAULT FALSE,
  "image"                TEXT,
  "phoneNumber"          TEXT,
  "phoneNumberVerified"  BOOLEAN NOT NULL DEFAULT FALSE,
  "createdAt"            TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"            TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Partial unique index allowing multiple null/empty phone numbers while enforcing uniqueness on real values
CREATE UNIQUE INDEX IF NOT EXISTS idx_user_phone_number ON "user"("phoneNumber") WHERE "phoneNumber" IS NOT NULL AND "phoneNumber" <> '';

