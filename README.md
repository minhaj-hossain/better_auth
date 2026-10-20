# 🛡️ Better Auth Masterclass: From Setup to RBAC

A step-by-step learning ladder for implementing full-stack authentication using **[Better Auth](https://www.better-auth.com)** in Next.js (App Router) and Prisma.

Each step introduces only the necessary packages and code for that feature, showing **what was already written** versus **what new lines are being added and where they go**.

---

## 🪜 The Better Auth Learning Ladder

```mermaid
graph TD
    S1["🪜 Step 1: Install Better Auth & Environment Setup"] --> S2["🪜 Step 2: Database Setup with Prisma Adapter"]
    S2 --> S3["🪜 Step 3: Create Server Auth Instance & Next.js API Handler"]
    S3 --> S4["🪜 Step 4: Create Client Auth Instance & Sign Up / Sign In"]
    S4 --> S5["🪜 Step 5: Sign Out Workflow"]
    S5 --> S6["🪜 Step 6: Password Recovery (Forget & Reset Password)"]
    S6 --> S7["🪜 Step 7: Email Verification Flow"]
    S7 --> S8["🪜 Step 8: Route Protection via Next.js Proxy (proxy.ts)"]
    S8 --> S9["🪜 Step 9: Role-Based Access Control (RBAC with Admin Plugin)"]
```

---

## 🪜 Step 1: Install Better Auth & Environment Setup

Following the official Better Auth documentation, we start by installing only the core authentication package.

### 1. Install Better Auth
```bash
bun add better-auth
# or with npm
npm install better-auth
```

### 2. Configure Environment Variables (`.env`)
Better Auth requires a secret key to sign session tokens and an application URL:

```env
# Secret key used for signing cookies and tokens (min 32 characters)
BETTER_AUTH_SECRET=xhHxG11hz7XydNb5L0YNrB6WJtpMAy5Q

# Base URL of your Next.js application
BETTER_AUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

> [!NOTE]
> In production, generate a cryptographically secure secret using:
> `openssl rand -base64 32`

---

## 🪜 Step 2: Database Setup with Prisma Adapter

Better Auth supports multiple database adapters (Prisma, Drizzle, Kysely, MongoDB). Here we set up the official Prisma adapter.

### 1. Install Prisma Dependencies
Now we install Prisma and its client:

```bash
bun add prisma @prisma/client
# or with npm
npm install prisma @prisma/client
```

### 2. Initialize Prisma Client Singleton (`src/lib/prisma.ts`)
Create `src/lib/prisma.ts` to prevent multiple Prisma client instances during Next.js hot reloads:

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### 3. Add Database Connection to `.env`
Add your database URL to your `.env` file:
```env
DATABASE_URL="mysql://root:password@localhost:3306/full_auth_db"
```

### 4. Create Better Auth Core Models (`prisma/schema.prisma`)
Better Auth requires 4 core tables: `User`, `Session`, `Account`, and `Verification`.

Create or update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "mysql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// 1. User: Holds primary user identity
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]

  @@map("user")
}

// 2. Session: Stores active login sessions and tokens
model Session {
  id        String   @id
  expiresAt DateTime
  token     String   @unique
  createdAt DateTime
  updatedAt DateTime
  ipAddress String?
  userAgent String?
  userId    String
  user      User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("session")
}

// 3. Account: Stores hashed credentials and OAuth accounts
model Account {
  id                    String    @id
  accountId             String
  providerId            String
  userId                String
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  accessToken           String?
  refreshToken          String?
  idToken               String?
  accessTokenExpiresAt  DateTime?
  refreshTokenExpiresAt DateTime?
  scope                 String?
  password              String?   // Hashed password for email/password auth
  createdAt             DateTime
  updatedAt             DateTime

  @@map("account")
}

// 4. Verification: Temporary tokens for email verification, reset password, etc.
model Verification {
  id         String    @id
  identifier String
  value      String
  expiresAt  DateTime
  createdAt  DateTime?
  updatedAt  DateTime?

  @@map("verification")
}
```

Run the migration:
```bash
npx prisma migrate dev --name init_auth
```

---

## 🪜 Step 3: Create Server Auth Instance & Next.js API Handler

### 1. Server Configuration (`src/lib/auth.ts`)
Create `src/lib/auth.ts` to initialize the Better Auth engine with the Prisma adapter and email/password authentication:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
  },
});
```

### 2. Next.js Catch-All Route Handler (`src/app/api/auth/[...all]/route.ts`)
Better Auth serves all endpoints (`/api/auth/sign-in`, `/api/auth/sign-up`, etc.) through a single Next.js catch-all route.

Create `src/app/api/auth/[...all]/route.ts`:
```typescript
import { auth } from "@/lib/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
```

---

## 🪜 Step 4: Create Client Auth Instance & Sign Up / Sign In

### 1. Create the Auth Client (`src/lib/auth-client.ts`)
Create `src/lib/auth-client.ts`:

```typescript
import { createAuthClient } from "better-auth/react";

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
});

export const { signIn, signUp, useSession, signOut } = authClient;
```

### 2. Sign Up a User (Client Action)
In your sign up component, call `authClient.signUp.email()`:

```typescript
import { authClient } from "@/lib/auth-client";

const handleSignUp = async (name: string, email: string, password: string) => {
  const { data, error } = await authClient.signUp.email({
    name,
    email,
    password,
  });

  if (error) {
    console.error("Sign up failed:", error.message);
  } else {
    console.log("User created and signed in:", data);
  }
};
```

### 3. Sign In a User (Client Action)
In your login component, call `authClient.signIn.email()`:

```typescript
import { authClient } from "@/lib/auth-client";

const handleSignIn = async (email: string, password: string) => {
  const { data, error } = await authClient.signIn.email({
    email,
    password,
    callbackURL: "/dashboard", // Where to redirect upon success
  });

  if (error) {
    console.error("Login failed:", error.message);
  } else {
    console.log("Logged in successfully:", data);
  }
};
```

---

## 🪜 Step 5: Sign Out Workflow

Better Auth provides an explicit `signOut()` function on the client that removes the session from the database and clears the session cookie from the browser.

### Creating `<SignOutButton />` (`src/components/SignOutButton.tsx`)
Create `src/components/SignOutButton.tsx`:

```tsx
'use client';

import React, { useState } from 'react';
import { signOut } from '@/lib/auth-client';
import { useRouter } from 'next/navigation';

export function SignOutButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    setLoading(true);
    await signOut({
      fetchOptions: {
        onSuccess: () => {
          router.push('/login');
          router.refresh();
        },
      },
    });
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="rounded-lg bg-rose-600/10 text-rose-400 border border-rose-500/20 px-3 py-1.5 text-xs font-semibold hover:bg-rose-600/20 transition cursor-pointer"
    >
      {loading ? 'Signing out...' : 'Sign out'}
    </button>
  );
}
```

---

## 🪜 Step 6: Password Recovery (Forget & Reset Password)

Now we add the **Forgot Password** and **Reset Password** functionality.  
Watch how we update the existing `src/lib/auth.ts` file without rewriting it from scratch.

### Step 6.1: Update `src/lib/auth.ts` (Evolution from Step 3)
We add the `sendResetPassword` callback inside `emailAndPassword`:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  // --------------------------------------------------------------------------
  // [CODE FROM STEP 3 - Unchanged]
  // --------------------------------------------------------------------------
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,

    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    // [NEW CODE ADDED IN STEP 6 - Password Reset Callback]
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
    async sendResetPassword({ user, url, token }) {
      // Better Auth generates a secure token and provides the target url
      // Example url: http://localhost:3000/reset-password?token=abc123xyz
      console.log(`[AUTH] Send reset email to: ${user.email}`);
      console.log(`[AUTH] Reset Link: ${url}`);
      console.log(`[AUTH] Token: ${token}`);
      // In production: send email using Resend / Nodemailer
    },
    // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  },
});
```

### Step 6.2: Forgot Password Client Call (`/forgot-password`)
Call `authClient.forgetPassword({ email, redirectTo })`:

```typescript
import { authClient } from "@/lib/auth-client";

const requestPasswordReset = async (email: string) => {
  const { data, error } = await authClient.forgetPassword({
    email,
    redirectTo: "/reset-password", // Page the user lands on from email
  });

  if (error) {
    console.error("Reset request failed:", error.message);
  } else {
    console.log("Reset email dispatched:", data);
  }
};
```

### Step 6.3: Reset Password Client Call (`/reset-password`)
Read `token` from URL search parameters (`?token=...`) and call `authClient.resetPassword()`:

```typescript
import { authClient } from "@/lib/auth-client";

const completePasswordReset = async (newPassword: string, token: string) => {
  const { data, error } = await authClient.resetPassword({
    newPassword,
    token,
  });

  if (error) {
    console.error("Password reset failed:", error.message);
  } else {
    console.log("Password updated successfully. You can now log in.");
  }
};
```

---

## 🪜 Step 7: Email Verification Flow

### Step 7.1: Update `src/lib/auth.ts` (Evolution from Step 6)
We now add the `emailVerification` option to `src/lib/auth.ts`:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  // --------------------------------------------------------------------------
  // [CODE FROM STEP 3 & STEP 6 - Unchanged]
  // --------------------------------------------------------------------------
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url, token }) {
      console.log(`Reset Link: ${url}`);
    },
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // [NEW CODE ADDED IN STEP 7 - Email Verification]
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  emailVerification: {
    enabled: true,
    autoSignInAfterVerification: true,
    async sendVerificationEmail({ user, url, token }) {
      // Better Auth generates verification token and verification URL
      console.log(`[AUTH] Verification Email for ${user.email}: ${url}`);
      console.log(`[AUTH] Token: ${token}`);
    },
  },
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
});
```

### Step 7.2: Verify Email on Client
When user clicks the link or submits their token:

```typescript
import { authClient } from "@/lib/auth-client";

const verifyUserEmail = async (token: string) => {
  const { data, error } = await authClient.verifyEmail({
    query: {
      token,
    },
  });

  if (error) {
    console.error("Verification failed:", error.message);
  } else {
    console.log("Email verified successfully:", data);
  }
};
```

---

## 🪜 Step 8: Route Protection via Next.js Proxy (`proxy.ts`)

In Next.js 16, route protection and edge request filtering are handled using `proxy.ts` (which replaces the legacy `middleware.ts` convention). Better Auth sets a session cookie named `better-auth.session_token` (or `__Secure-better-auth.session_token` on HTTPS). We can guard private and auth routes instantly using Next.js `proxy.ts`.

Create `src/proxy.ts`:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/dashboard', '/settings', '/profile', '/admin'];
const authRoutes = ['/login', '/signup', '/forgot-password', '/reset-password'];

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Better Auth session cookie check (supporting both development and production HTTPS)
  const sessionToken =
    request.cookies.get('better-auth.session_token')?.value ||
    request.cookies.get('__Secure-better-auth.session_token')?.value;

  const isAuthenticated = Boolean(sessionToken);

  // 1. Guard private routes against unauthenticated access
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  if (isProtected && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Prevent authenticated users from accessing login/signup forms again
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));
  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## 🪜 Step 9: Role-Based Access Control (RBAC with Admin Plugin)

Better Auth provides a first-party **Admin Plugin** (`better-auth/plugins`) designed specifically for Roles and Permissions.

### Step 9.1: Update `prisma/schema.prisma` for Admin Plugin
The Better Auth Admin plugin requires 4 additional fields on the `User` model: `role`, `banned`, `banReason`, and `banExpires`:

```prisma
model User {
  id            String    @id
  name          String
  email         String    @unique
  emailVerified Boolean
  image         String?
  createdAt     DateTime
  updatedAt     DateTime
  sessions      Session[]
  accounts      Account[]

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // [NEW FIELDS ADDED IN STEP 9 FOR BETTER AUTH ADMIN / RBAC]
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  role          String?   // "user", "admin", "moderator"
  banned        Boolean?
  banReason     String?
  banExpires    DateTime?
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

  @@map("user")
}
```

Run migration:
```bash
npx prisma migrate dev --name add_admin_plugin_fields
```

### Step 9.2: Update `src/lib/auth.ts` (Evolution from Step 7)
Import the `admin` plugin and add it to `plugins`:

```typescript
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// [NEW IMPORT IN STEP 9]
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { admin } from "better-auth/plugins";
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql",
  }),
  emailAndPassword: {
    enabled: true,
    async sendResetPassword({ user, url, token }) {
      console.log(`Reset link: ${url}`);
    },
  },
  emailVerification: {
    enabled: true,
    async sendVerificationEmail({ user, url, token }) {
      console.log(`Verification link: ${url}`);
    },
  },

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // [NEW CODE ADDED IN STEP 9 - Better Auth Admin / RBAC Plugin]
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  plugins: [
    admin({
      defaultRole: "user",
      adminRoles: ["admin"],
    }),
  ],
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
});
```

### Step 9.3: Update `src/lib/auth-client.ts` (Evolution from Step 4)
Enable the `adminClient` plugin on the client:

```typescript
import { createAuthClient } from "better-auth/react";

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// [NEW IMPORT IN STEP 9]
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
import { adminClient } from "better-auth/client/plugins";
// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

export const authClient = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",

  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  // [NEW CLIENT PLUGIN ADDED IN STEP 9]
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
  plugins: [adminClient()],
  // ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
});

export const { signIn, signUp, useSession, signOut } = authClient;
```

### Step 9.4: Check Roles on the Server (Server Actions & Route Handlers)
To protect sensitive server operations, get the session and verify `role`:

```typescript
// src/app/actions/admin.ts
'use server';

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function deleteSensitiveData() {
  // 1. Get current session
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("Unauthorized");
  }

  // 2. Enforce admin role
  if (session.user.role !== "admin") {
    throw new Error("Forbidden: Admin access required");
  }

  // 3. Perform sensitive operation safely
  console.log(`Admin ${session.user.email} executed action.`);
  return { success: true };
}
```

### Step 9.5: Check Roles on the Client
Use the `useSession` hook to conditionally render UI:

```tsx
'use client';

import { useSession } from "@/lib/auth-client";

export function AdminPanelButton() {
  const { data: session } = useSession();

  // Hide button if user is not an admin
  if (session?.user?.role !== "admin") {
    return null;
  }

  return (
    <button className="bg-amber-600 text-white px-3 py-1.5 rounded-lg text-xs font-semibold">
      Open Admin Settings
    </button>
  );
}
```

---

## 🚀 Summary of Commands & Workflows

| Step | Action | Command / Function |
| :--- | :--- | :--- |
| **Install** | Core Better Auth | `bun add better-auth` |
| **Database** | Prisma Adapter | `bun add prisma @prisma/client` |
| **Migrate** | Update Schema | `npx prisma migrate dev` |
| **Sign Up** | Create User | `authClient.signUp.email({ email, password, name })` |
| **Sign In** | Authenticate User | `authClient.signIn.email({ email, password })` |
| **Sign Out** | Invalidate Session | `authClient.signOut()` |
| **Forgot Pwd** | Send Reset Email | `authClient.forgetPassword({ email, redirectTo })` |
| **Reset Pwd** | Update Credentials | `authClient.resetPassword({ newPassword, token })` |
| **Verify Email** | Email Token | `authClient.verifyEmail({ query: { token } })` |
| **RBAC** | Admin Plugin | `import { admin } from "better-auth/plugins"` |
