# How to Create Admin Users in Supabase

## 🔐 Where Admin Users Are Stored

**Answer**: Admin users are stored in **Supabase's Authentication system**, NOT hardcoded in your code!

Supabase has a built-in user management system that securely stores:

- Email addresses
- Hashed passwords (never stored in plain text)
- User metadata
- Authentication tokens

---

## 📍 Where to Create Admin Users

### **Method 1: Via Supabase Dashboard (Recommended)**

1. **Go to Supabase Dashboard**

   - Visit: https://supabase.com/dashboard
   - Sign in to your account
   - Select your project

2. **Navigate to Authentication**

   - Click **"Authentication"** in the left sidebar
   - Click **"Users"** tab

3. **Add New User**

   - Click **"Add User"** button (top right)
   - Select **"Create new user"**

4. **Enter User Details**

   ```
   Email: admin@rotarygudalur.com (or your admin email)
   Password: [Enter a strong password]
   Auto Confirm User: ✅ Check this (so they can login immediately)
   ```

5. **Save**
   - Click **"Create User"**
   - User is now created and can login!

### **Method 2: Via SQL (For Advanced Users)**

You can also create users via SQL, but they'll need to set their password via email:

```sql
-- This creates a user, but they need to set password via email link
INSERT INTO auth.users (
  instance_id,
  id,
  aud,
  role,
  email,
  encrypted_password,
  email_confirmed_at,
  created_at,
  updated_at
) VALUES (
  '00000000-0000-0000-0000-000000000000',
  gen_random_uuid(),
  'authenticated',
  'authenticated',
  'admin@rotarygudalur.com',
  crypt('your-password-here', gen_salt('bf')),
  now(),
  now(),
  now()
);
```

**Note**: Method 1 (Dashboard) is much easier and recommended!

---

## 🔍 How Supabase Validates Credentials

### **Step-by-Step Process:**

```
1. Admin enters email + password in login form
   ↓
2. Your code calls: supabase.auth.signInWithPassword({ email, password })
   ↓
3. Supabase receives the request
   ↓
4. Supabase looks up the email in its auth.users table
   ↓
5. If email exists:
   - Supabase retrieves the hashed password from database
   - Compares the entered password (hashed) with stored hash
   - If match → Returns JWT token
   - If no match → Returns error "Invalid login credentials"
   ↓
6. If email doesn't exist:
   - Returns error "Invalid login credentials"
```

### **Security Features:**

- ✅ **Passwords are hashed** - Never stored in plain text
- ✅ **Uses bcrypt** - Industry-standard password hashing
- ✅ **JWT tokens** - Secure, time-limited authentication tokens
- ✅ **No hardcoding** - All users stored in Supabase database

---

## 📊 Where User Data is Stored

### **Supabase Auth Tables (Internal)**

Supabase uses these internal tables (you don't need to manage them):

1. **`auth.users`** - Stores user accounts

   - Email
   - Hashed password
   - User metadata
   - Created timestamp

2. **`auth.sessions`** - Stores active sessions
   - JWT tokens
   - Expiration times
   - User associations

**Important**: These tables are managed by Supabase automatically. You don't need to create or modify them manually.

---

## 🎯 Complete Setup Process

### **Step 1: Create Admin User in Supabase**

1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter:
   - Email: `admin@rotarygudalur.com`
   - Password: `[Strong password]`
   - Auto Confirm: ✅ Checked
4. Click "Create User"

### **Step 2: Test Login**

In your admin website login page:

```typescript
const handleLogin = async (e: React.FormEvent) => {
  e.preventDefault();

  const { data, error } = await supabase.auth.signInWithPassword({
    email: "admin@rotarygudalur.com", // Email you created in Supabase
    password: "[The password you set]", // Password you set in Supabase
  });

  if (error) {
    console.error("Login failed:", error.message);
    // Show error to user
  } else {
    console.log("Login successful!", data.user);
    // Redirect to dashboard
  }
};
```

### **Step 3: Verify It Works**

1. Try logging in with correct credentials → Should succeed
2. Try logging in with wrong password → Should fail
3. Try logging in with non-existent email → Should fail

---

## 🔒 Security Best Practices

### **1. Strong Passwords**

- Use at least 12 characters
- Mix of uppercase, lowercase, numbers, symbols
- Don't use common words or personal info

### **2. Multiple Admin Users**

- Create separate accounts for each admin
- Don't share passwords
- Each admin can have their own account

### **3. Password Reset**

- Admins can reset passwords via email
- Go to Supabase Dashboard → Authentication → Users
- Click on user → "Send password reset email"

### **4. Remove Users**

- If admin leaves, delete their account
- Go to Supabase Dashboard → Authentication → Users
- Click on user → "Delete User"

---

## ❓ Common Questions

### **Q: Do I hardcode credentials in my code?**

**A**: NO! Never hardcode credentials. Users are created in Supabase Dashboard, and your code just sends the email/password to Supabase for validation.

### **Q: Where are passwords stored?**

**A**: Passwords are stored in Supabase's `auth.users` table, but they're **hashed** (encrypted) - never in plain text.

### **Q: Can I see the passwords?**

**A**: NO! Passwords are hashed and cannot be retrieved. If an admin forgets their password, they need to reset it via email.

### **Q: How many admin users can I create?**

**A**: As many as you need! Create one for each person who needs admin access.

### **Q: What if I forget the admin password?**

**A**:

1. Go to Supabase Dashboard → Authentication → Users
2. Find the admin user
3. Click "Send password reset email"
4. Admin will receive email to reset password

### **Q: Can I change an admin's email?**

**A**: Yes! Go to Supabase Dashboard → Authentication → Users → Click on user → Edit email

---

## 📝 Summary

1. **Admin users are created in Supabase Dashboard** (not hardcoded)
2. **Supabase stores users securely** in its `auth.users` table
3. **Passwords are hashed** - never stored in plain text
4. **Validation happens automatically** - Supabase checks credentials against its database
5. **No code changes needed** - just create users in dashboard and use them in login form

**The flow:**

```
Create User in Supabase Dashboard
         ↓
Admin enters email/password in login form
         ↓
Your code sends to Supabase: signInWithPassword()
         ↓
Supabase checks its auth.users table
         ↓
If valid → Returns JWT token
If invalid → Returns error
```

---

## 🚀 Quick Start Checklist

- [ ] Go to Supabase Dashboard
- [ ] Navigate to Authentication → Users
- [ ] Create first admin user (email + password)
- [ ] Test login in your admin website
- [ ] Create additional admin users as needed
- [ ] Document admin credentials securely (password manager)

**That's it!** No hardcoding, no complex setup - just create users in Supabase and they can login! 🎉
