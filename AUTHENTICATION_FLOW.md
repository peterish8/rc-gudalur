# Authentication Flow - Simple Explanation

## 🔐 How Authentication Works (Step by Step)

### **Step 1: Admin Logs In**
```
Admin visits: /admin/login
Enters: email + password
Clicks: "Login" button
```

### **Step 2: Supabase Validates Credentials**
```
Your Code: supabase.auth.signInWithPassword({ email, password })
           ↓
Supabase: Checks if email/password is correct
           ↓
           How? Supabase looks in its auth.users table
           (Users are created in Supabase Dashboard → Authentication → Users)
           ↓
If correct: Returns JWT Token (like a special key)
If wrong: Returns error "Invalid login credentials"
```

**Important**: Admin users are NOT hardcoded! They are created in:
- **Supabase Dashboard** → **Authentication** → **Users** → **Add User**
- Supabase stores them securely in its `auth.users` table
- Passwords are hashed (never stored in plain text)

### **Step 3: JWT Token is Stored**
```
JWT Token is automatically stored in browser
This token proves: "This user is authenticated"
```

### **Step 4: Admin Makes CRUD Operation**
```
Admin clicks: "Create Event" button
Your Code: supabase.from("events").insert({ title: "New Event" })
           ↓
Supabase automatically includes JWT token in the request
           ↓
Database receives request WITH token
```

### **Step 5: RLS Policy Checks**
```
Database sees: "Someone wants to INSERT into events table"
           ↓
Checks RLS Policy: "Allow authenticated insert on events"
           ↓
Policy asks: "Is this user authenticated?" (Does request have valid JWT?)
           ↓
If YES (has valid JWT): ✅ ALLOW → Event created
If NO (no JWT or invalid): ❌ DENY → Error returned
```

## 📊 Visual Flow Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                    PUBLIC USER (No Login)                    │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ Makes request
                              ↓
                    ┌─────────────────────┐
                    │  Supabase Database   │
                    └─────────────────────┘
                              │
                              │ Checks RLS Policy
                              ↓
                    ┌─────────────────────┐
                    │  SELECT (READ)      │
                    │  ✅ ALLOWED         │
                    │  (Public can read)  │
                    └─────────────────────┘
                              │
                              │
                    ┌─────────────────────┐
                    │  INSERT/UPDATE/     │
                    │  DELETE (WRITE)     │
                    │  ❌ DENIED          │
                    │  (No JWT token)    │
                    └─────────────────────┘


┌─────────────────────────────────────────────────────────────┐
│              ADMIN USER (Logged In with JWT)                 │
└─────────────────────────────────────────────────────────────┘
                              │
                              │ 1. Logs in → Gets JWT Token
                              ↓
                    ┌─────────────────────┐
                    │  JWT Token Stored   │
                    │  in Browser         │
                    └─────────────────────┘
                              │
                              │ 2. Makes CRUD request
                              │    (Token sent automatically)
                              ↓
                    ┌─────────────────────┐
                    │  Supabase Database   │
                    │  (Receives JWT)     │
                    └─────────────────────┘
                              │
                              │ Checks RLS Policy
                              ↓
                    ┌─────────────────────┐
                    │  SELECT (READ)     │
                    │  ✅ ALLOWED        │
                    │  (Has valid JWT)   │
                    └─────────────────────┘
                              │
                    ┌─────────────────────┐
                    │  INSERT/UPDATE/     │
                    │  DELETE (WRITE)     │
                    │  ✅ ALLOWED         │
                    │  (Has valid JWT)    │
                    └─────────────────────┘
```

## 🔑 Key Concepts

### **1. JWT Token = Proof of Authentication**
- Like a "VIP pass" that proves you're logged in
- Automatically included in every request after login
- Expires after some time (for security)

### **2. RLS Policies = Security Rules**
- **Public Policy**: `USING (true)` = Anyone can do this
- **Authenticated Policy**: `TO authenticated` = Only logged-in users can do this

### **3. Automatic Security**
- You don't need to manually check "is user logged in?" in every function
- Supabase + RLS handles it automatically
- If no JWT token → Request is automatically blocked

## 💻 Code Example

### **Without Authentication (Public User)**
```typescript
// This will FAIL if RLS policy requires authentication
const { error } = await supabase
  .from("events")
  .insert({ title: "New Event" })
// Error: "new row violates row-level security policy"
```

### **With Authentication (Admin User)**
```typescript
// 1. First, login
await supabase.auth.signInWithPassword({
  email: "admin@example.com",
  password: "password123"
})

// 2. Now this will SUCCEED (JWT token is automatically included)
const { data, error } = await supabase
  .from("events")
  .insert({ title: "New Event" })
// Success! Event created
```

## 🎯 Summary

1. **Public users** → Can only READ (view data)
2. **Admin users** → Can READ + CREATE + UPDATE + DELETE
3. **Authentication** → Handled by Supabase Auth (login system)
4. **Security** → Enforced by RLS policies automatically
5. **JWT Token** → Proves user is authenticated (sent automatically)

**The beauty**: Once admin logs in, all their CRUD operations work automatically. No need to manually check authentication in every function!

