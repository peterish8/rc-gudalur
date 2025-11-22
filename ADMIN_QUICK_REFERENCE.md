# Admin Website - Quick Reference for AI Assistant

## 🎯 Project Goal

Build a separate admin website that connects to the same Supabase database to manage content (Events, Gallery, Board Members) that displays on the main public website.

---

## 🔗 Supabase Connection

```env
NEXT_PUBLIC_SUPABASE_URL=https://itpfmhdijkroccvcguro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0cGZtaGRpamtyb2NjdmNndXJvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ4MTY0OTcsImV4cCI6MjA3MDM5MjQ5N30.L-QZ2XnIj_HLIruTofp1yQWhJ8DoSyEbdjan66E1jPc
```

---

## 📊 Database Tables & Columns

### **Table: `public.events`**

| Column        | Type      | Required | Notes                           |
| ------------- | --------- | -------- | ------------------------------- |
| `id`          | uuid      | Auto     | Primary Key, auto-generated     |
| `title`       | text      | ✅ Yes   | Event title                     |
| `description` | text      | ❌ No    | Event description               |
| `event_date`  | date      | ✅ Yes   | Event date (format: YYYY-MM-DD) |
| `image_url`   | text      | ❌ No    | URL to event image              |
| `created_at`  | timestamp | Auto     | Auto-generated on create        |

### **Table: `public.gallery`**

| Column        | Type      | Required | Notes                       |
| ------------- | --------- | -------- | --------------------------- |
| `id`          | uuid      | Auto     | Primary Key, auto-generated |
| `title`       | text      | ✅ Yes   | Image title                 |
| `description` | text      | ❌ No    | Image description           |
| `image_url`   | text      | ✅ Yes   | URL to image                |
| `created_at`  | timestamp | Auto     | Auto-generated on create    |

### **Table: `public.board_members`**

| Column        | Type      | Required | Notes                       |
| ------------- | --------- | -------- | --------------------------- |
| `id`          | uuid      | Auto     | Primary Key, auto-generated |
| `name`        | text      | ✅ Yes   | Member name                 |
| `designation` | text      | ✅ Yes   | Member designation/position |
| `created_at`  | timestamp | Auto     | Auto-generated on create    |

---

## 🔐 Row Level Security (RLS) Policies

**Status**: ✅ Already Applied in Database

### **All Tables Have:**

- ✅ **Public SELECT** - Anyone can read/view data
- ✅ **Authenticated INSERT** - Only logged-in admins can create
- ✅ **Authenticated UPDATE** - Only logged-in admins can update
- ✅ **Authenticated DELETE** - Only logged-in admins can delete

### **How It Works:**

1. Admin logs in → Gets JWT token from Supabase Auth
2. JWT token stored in browser
3. Every database request automatically includes JWT token
4. Supabase checks RLS policy: "Is user authenticated?"
5. If YES → Operation allowed
6. If NO → Operation denied with error

**Important**: RLS is enforced at database level - works for ANY website connecting to this Supabase project.

---

## 🔑 Authentication Requirements

### **Must Use Supabase Auth:**

```typescript
// Login
const { data, error } = await supabase.auth.signInWithPassword({
  email: "admin@example.com",
  password: "password123",
});

// Get current user
const {
  data: { user },
} = await supabase.auth.getUser();

// Logout
await supabase.auth.signOut();
```

### **Protected Routes:**

- All admin pages must check if user is authenticated
- If not authenticated → Redirect to login page
- JWT token must be included in all database requests (automatic)

---

## 📱 Required Pages

1. **Login Page** (`/login`)

   - Email + Password form
   - Redirect to dashboard on success

2. **Dashboard** (`/dashboard`)

   - Overview with navigation
   - Light/Dark mode toggle
   - Logout button

3. **Manage Events** (`/events`)

   - List all events (table view)
   - Create new event form
   - Edit event form
   - Delete event (with confirmation)

4. **Manage Gallery** (`/gallery`)

   - Grid/list of gallery images
   - Create new image form
   - Edit image form
   - Delete image (with confirmation)

5. **Manage Board Members** (`/board-members`)
   - List all board members (table view)
   - Create new member form
   - Edit member form
   - Delete member (with confirmation)

---

## 💻 CRUD Operations Code Examples

### **Create Event:**

```typescript
const { data, error } = await supabase.from("events").insert({
  title: "Event Title",
  description: "Event description",
  event_date: "2024-01-15",
  image_url: "https://example.com/image.jpg",
});
```

### **Read All Events:**

```typescript
const { data, error } = await supabase
  .from("events")
  .select("*")
  .order("event_date", { ascending: false });
```

### **Update Event:**

```typescript
const { data, error } = await supabase
  .from("events")
  .update({
    title: "Updated Title",
    event_date: "2024-02-20",
  })
  .eq("id", eventId);
```

### **Delete Event:**

```typescript
const { error } = await supabase.from("events").delete().eq("id", eventId);
```

**Same pattern for `gallery` and `board_members` tables!**

---

## 🎨 Design Requirements

- **Light/Dark Mode**: Toggle between themes (persist preference)
- **Responsive**: Works on desktop and tablet
- **Clean UI**: Simple, professional admin interface
- **Color Scheme**:
  - Light: White background, dark text
  - Dark: Dark background, light text
  - Primary: Green/Emerald (#10B981)

---

## ✅ Key Points

1. **Same Database**: Admin website uses SAME Supabase project as main website
2. **RLS Already Applied**: No need to modify database policies
3. **Authentication Required**: Must login to perform CRUD operations
4. **Token-Based**: JWT tokens work across different websites
5. **Real-time**: Changes in admin website reflect immediately on main website
6. **Security**: RLS policies prevent unauthorized access automatically

---

## 🚀 Quick Start Checklist

- [ ] Create Next.js/React project
- [ ] Install `@supabase/supabase-js`
- [ ] Set up environment variables
- [ ] Create Supabase client
- [ ] Build login page with Supabase Auth
- [ ] Build protected routes (check authentication)
- [ ] Implement CRUD operations for all 3 tables
- [ ] Add light/dark mode toggle
- [ ] Test: Create event → Check main website shows it
- [ ] Test: Try accessing without login → Should be blocked

---

**Full PRD available in: `ADMIN_WEBSITE_PRD.md`**
