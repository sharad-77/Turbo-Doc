CREATE TABLE "session" (
  "id"          TEXT PRIMARY KEY,
  "expiresAt"   TIMESTAMPTZ NOT NULL,
  "token"       TEXT NOT NULL UNIQUE,
  "ipAddress"   TEXT,
  "userAgent"   TEXT,
  "userId"      TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "createdAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"   TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
