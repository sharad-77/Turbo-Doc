CREATE TABLE "account" (
  "id"                     TEXT PRIMARY KEY,
  "accountId"              TEXT NOT NULL,
  "providerId"             TEXT NOT NULL,
  "userId"                 TEXT NOT NULL REFERENCES "user"("id") ON DELETE CASCADE,
  "accessToken"            TEXT,
  "refreshToken"           TEXT,
  "idToken"                TEXT,
  "accessTokenExpiresAt"   TIMESTAMPTZ,
  "refreshTokenExpiresAt"  TIMESTAMPTZ,
  "scope"                  TEXT,
  "password"               TEXT,
  "createdAt"              TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  "updatedAt"              TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
