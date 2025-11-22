# Authentication System Guide for Admin Pages

## How Authentication Works with Supabase RLS

### Overview
Supabase uses **JWT (JSON Web Tokens)** for authentication. When a user logs in, Supabase returns a JWT token that contains user information. This token is automatically sent with every database request, and RLS policies check if the user is authenticated.

### Authentication Flow

```
1. Admin logs in → Supabase Auth
2. Supabase returns JWT token → Stored in browser
3. Admin makes CRUD request → Token sent automatically
4. Supabase checks RLS policy → "Is user authenticated?"
5. If YES → Allow operation
6. If NO → Block operation
```

## RLS Policy Logic

### Public Read Access (Everyone can view)
```sql
CREATE POLICY "Allow public read access on events" 
ON public.events 
FOR SELECT 
USING (true);  -- Always true = anyone can read
```

### Admin-Only Write Access (Only authenticated users)
```sql
CREATE POLICY "Allow authenticated insert on events" 
ON public.events 
FOR INSERT 
TO authenticated  -- Only users with valid JWT token
WITH CHECK (true);
```

The key difference:
- **Public policies**: `USING (true)` - No authentication required
- **Authenticated policies**: `TO authenticated` - Requires valid JWT token

## How to Implement in Your Admin Page

### Step 1: Install Supabase Auth Helpers (if needed)
```bash
npm install @supabase/auth-helpers-nextjs
```

### Step 2: Create Login Page (`/app/admin/login/page.tsx`)

```typescript
"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      // Redirect to admin dashboard after successful login
      router.push("/admin/dashboard")
      router.refresh()
    } catch (error: any) {
      setError(error.message || "Failed to login")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-2xl font-bold text-center">Admin Login</h2>
        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-3 py-2 border rounded-md"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  )
}
```

### Step 3: Create Protected Admin Dashboard (`/app/admin/dashboard/page.tsx`)

```typescript
"use client"

import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { useRouter } from "next/navigation"

export default function AdminDashboard() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      router.push("/admin/login")
      return
    }
    
    setUser(user)
    setLoading(false)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push("/admin/login")
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 text-white px-4 py-2 rounded"
          >
            Logout
          </button>
        </div>
        
        <p>Welcome, {user?.email}</p>
        
        {/* Your CRUD operations here */}
        {/* When you make requests, Supabase automatically includes the JWT token */}
      </div>
    </div>
  )
}
```

### Step 4: Create Middleware to Protect Admin Routes (`/middleware.ts`)

```typescript
import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  const supabase = createMiddlewareClient({ req, res })

  // Check if route is admin route
  if (req.nextUrl.pathname.startsWith('/admin')) {
    const {
      data: { session },
    } = await supabase.auth.getSession()

    // If no session, redirect to login
    if (!session) {
      return NextResponse.redirect(new URL('/admin/login', req.url))
    }
  }

  return res
}

export const config = {
  matcher: '/admin/:path*',
}
```

## How It Works in Practice

### Scenario 1: Public User Views Events
```
1. User visits homepage → No JWT token
2. Frontend calls: supabase.from("events").select("*")
3. Supabase checks RLS: "Allow public read access on events" → ✅ ALLOWED
4. Data returned to user
```

### Scenario 2: Admin Creates Event
```
1. Admin logs in → Gets JWT token stored in browser
2. Admin fills form and clicks "Create Event"
3. Frontend calls: supabase.from("events").insert({...})
4. Supabase automatically includes JWT token in request
5. Supabase checks RLS: "Allow authenticated insert on events" → ✅ ALLOWED
6. Event created successfully
```

### Scenario 3: Unauthenticated User Tries to Create Event
```
1. User (not logged in) tries to create event
2. Frontend calls: supabase.from("events").insert({...})
3. No JWT token sent (or invalid token)
4. Supabase checks RLS: "Allow authenticated insert on events" → ❌ DENIED
5. Error returned: "new row violates row-level security policy"
```

## Creating Admin Users in Supabase

### Method 1: Via Supabase Dashboard
1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create new user**
3. Enter email and password
4. User can now login to your admin page

### Method 2: Via SQL (for testing)
```sql
-- This creates a user, but they need to set password via email
-- Better to use the dashboard method
```

## Security Best Practices

1. **Always use RLS policies** - Never disable RLS
2. **Use strong passwords** - Enforce password requirements
3. **Limit admin access** - Only give admin credentials to trusted users
4. **Use HTTPS** - Always use HTTPS in production
5. **Monitor access** - Check Supabase logs for suspicious activity

## Testing Authentication

### Test Public Access (Should Work)
```typescript
// This should work without login
const { data } = await supabase.from("events").select("*")
```

### Test Admin Access (Requires Login)
```typescript
// This only works after login
const { data, error } = await supabase
  .from("events")
  .insert({ title: "Test Event", event_date: "2024-01-01" })

if (error) {
  console.error("Not authenticated or RLS policy violation")
}
```

## Summary

- **Public users**: Can only READ (SELECT) data
- **Authenticated admins**: Can CREATE, READ, UPDATE, DELETE
- **Authentication**: Handled by Supabase Auth with JWT tokens
- **RLS Policies**: Automatically check if user is authenticated
- **Admin page**: Must login first, then all CRUD operations work automatically

The beauty of this system is that once a user is logged in, all their requests automatically include the JWT token, and RLS policies handle the security automatically!

