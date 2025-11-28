I have a Turborepo monorepo with the following structure:
- apps/web: Next.js frontend
- packages/auth: Better Auth configuration
- packages/database: Prisma + PostgreSQL setup

CURRENT PROBLEM:
1. GitHub and Google OAuth login works perfectly
2. Email/password signup does NOT store user data in database
3. Email/password signin does NOT validate credentials - any random email/password grants dashboard access
4. Sessions are being created without proper authentication verification

TECHNICAL DETAILS:
- Better Auth is configured in packages/auth
- Database schema is in packages/database with Prisma ORM
- Next.js app imports both packages for authentication
- Auth routes are likely in app/api/auth/[...all]/route.ts

REQUIRED FIXES:

1. Email/Password Signup Flow:
   - Verify the Better Auth email provider is properly configured with database adapter
   - Ensure the auth instance uses the correct Prisma client from packages/database
   - Check if password hashing is enabled
   - Verify the user table schema includes password field
   - Ensure database write operations are awaited and error-handled

2. Email/Password Signin Validation:
   - Implement proper credential verification before session creation
   - Add password comparison logic using Better Auth's built-in methods
   - Return authentication errors for invalid credentials
   - Prevent session creation for failed login attempts

3. Session Management:
   - Ensure sessions are only created after successful authentication
   - Implement proper middleware in Next.js to verify sessions before dashboard access
   - Add session validation that checks database for valid user
   - Configure session storage correctly (cookies with secure flags)

4. Database Integration:
   - Verify Prisma schema has all required Better Auth tables (user, session, account, verification)
   - Ensure migrations are applied: npx prisma migrate dev
   - Check that the auth package properly imports and uses the database client
   - Verify connection string is correct in .env

5. Code Structure:
   - Share the auth instance properly between packages
   - Ensure packages/auth exports the configured Better Auth instance
   - Verify apps/web correctly imports and initializes auth
   - Check that API routes properly use the auth instance

EXPECTED BEHAVIOR AFTER FIX:
- Email/password signup creates user record in database with hashed password
- Email/password signin validates credentials against database
- Invalid credentials return error and deny access
- Valid credentials create session and grant dashboard access
- Sessions persist correctly across page reloads
- Middleware protects dashboard route from unauthenticated access

Please analyze my codebase and:
1. Identify the exact files causing the issues
2. Show me the corrected code for each file
3. Explain what was wrong and why the fixes work
4. Provide step-by-step testing instructions

Focus on packages/auth/src/index.ts, apps/web/app/api/auth/[...all]/route.ts, and any middleware files.
