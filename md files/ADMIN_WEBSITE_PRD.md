# Product Requirements Document (PRD)
## Admin Website for Rotary Club of Gudalur Garden City

### 📋 Overview
A separate admin website that allows authenticated administrators to manage content (Events, Gallery, Board Members) that displays on the main public website. The admin website connects to the same Supabase database and respects Row Level Security (RLS) policies.

---

## 🎯 Core Requirements

### 1. **Authentication System**
- **Login Page**: Email and password authentication via Supabase Auth
- **Session Management**: Maintain login session across page refreshes
- **Logout Functionality**: Secure logout that clears session
- **Protected Routes**: All admin pages require authentication

### 2. **CRUD Operations**
- **Create**: Add new events, gallery images, board members
- **Read**: View all existing records in tables
- **Update**: Edit existing records
- **Delete**: Remove records with confirmation

### 3. **UI/UX Requirements**
- **Light/Dark Mode**: Toggle between light and dark themes
- **Responsive Design**: Works on desktop and tablet
- **Clean Interface**: Simple, intuitive admin dashboard
- **Form Validation**: Validate inputs before submission

---

## 🗄️ Database Structure

### **Supabase Connection Details**
```
Project URL: https://itpfmhdijkroccvcguro.supabase.co
Database: PostgreSQL (via Supabase)
Authentication: Supabase Auth (Email/Password)
```

### **Table 1: Events**
```sql
Table Name: public.events
Columns:
- id (uuid, PRIMARY KEY, auto-generated)
- title (text, NOT NULL)
- description (text, NULLABLE)
- event_date (date, NOT NULL)
- image_url (text, NULLABLE)
- created_at (timestamp with time zone, default: now())
```

**RLS Policies Applied:**
- ✅ Public SELECT (read) - Anyone can view
- ✅ Authenticated INSERT - Only logged-in admins can create
- ✅ Authenticated UPDATE - Only logged-in admins can update
- ✅ Authenticated DELETE - Only logged-in admins can delete

### **Table 2: Gallery**
```sql
Table Name: public.gallery
Columns:
- id (uuid, PRIMARY KEY, auto-generated)
- title (text, NOT NULL)
- description (text, NULLABLE)
- image_url (text, NOT NULL)
- created_at (timestamp with time zone, default: now())
```

**RLS Policies Applied:**
- ✅ Public SELECT (read) - Anyone can view
- ✅ Authenticated INSERT - Only logged-in admins can create
- ✅ Authenticated UPDATE - Only logged-in admins can update
- ✅ Authenticated DELETE - Only logged-in admins can delete

### **Table 3: Board Members**
```sql
Table Name: public.board_members
Columns:
- id (uuid, PRIMARY KEY, auto-generated)
- name (text, NOT NULL)
- designation (text, NOT NULL)
- created_at (timestamp with time zone, default: now())
```

**RLS Policies Applied:**
- ✅ Public SELECT (read) - Anyone can view
- ✅ Authenticated INSERT - Only logged-in admins can create
- ✅ Authenticated UPDATE - Only logged-in admins can update
- ✅ Authenticated DELETE - Only logged-in admins can delete

---

## 🔐 Authentication Logic

### **How It Works:**
1. Admin logs in with email/password via Supabase Auth
2. Supabase returns a JWT (JSON Web Token)
3. JWT token is stored in browser (localStorage or cookies)
4. Every database request automatically includes the JWT token
5. Supabase RLS policies check if the request has a valid JWT
6. If valid JWT → CRUD operations allowed
7. If no/invalid JWT → Operations denied

### **Authentication Flow:**
```
Login Page → Enter Credentials → Supabase Auth → JWT Token → Stored in Browser
                                                                      ↓
                                                              All API Requests
                                                                      ↓
                                                              Supabase Checks JWT
                                                                      ↓
                                                          ✅ Valid → Allow CRUD
                                                          ❌ Invalid → Deny
```

### **Important Notes:**
- **Same Supabase Project**: Admin website uses the SAME Supabase project as main website
- **Same Database**: Both websites connect to the same database
- **RLS Enforced**: Row Level Security policies are enforced at the database level
- **Token-Based**: Authentication is token-based, not session-based per website
- **Cross-Website**: If admin logs in on admin website, they're authenticated for that Supabase project

---

## 📱 Pages & Features

### **Page 1: Login Page (`/login`)**
**Purpose**: Authenticate admin users

**Features:**
- Email input field
- Password input field
- "Remember me" checkbox (optional)
- Login button
- Error message display
- Loading state during login

**Validation:**
- Email must be valid format
- Password required
- Show error if credentials invalid

**After Success:**
- Redirect to Dashboard
- Store authentication token

---

### **Page 2: Dashboard (`/dashboard`)**
**Purpose**: Overview and navigation

**Features:**
- Welcome message with admin email
- Quick stats (total events, gallery images, board members)
- Navigation cards to:
  - Manage Events
  - Manage Gallery
  - Manage Board Members
- Logout button
- Light/Dark mode toggle

**Layout:**
- Header with logo and user info
- Sidebar or top navigation
- Main content area

---

### **Page 3: Manage Events (`/events`)**
**Purpose**: CRUD operations for events

**Features:**

**List View:**
- Table showing all events
- Columns: Title, Event Date, Description (truncated), Image, Actions
- Sort by date (newest first)
- Search/filter functionality
- "Add New Event" button

**Create/Edit Form:**
- Title (text input, required)
- Description (textarea, optional)
- Event Date (date picker, required)
- Image URL (text input, optional)
- Save button
- Cancel button

**Actions:**
- Edit button (opens edit form)
- Delete button (with confirmation modal)
- View button (optional - shows full details)

**Validation:**
- Title: Required, max 200 characters
- Event Date: Required, must be valid date
- Description: Optional, max 1000 characters
- Image URL: Optional, must be valid URL format

---

### **Page 4: Manage Gallery (`/gallery`)**
**Purpose**: CRUD operations for gallery images

**Features:**

**Grid/List View:**
- Image thumbnails with title
- Display: Image, Title, Description (truncated)
- "Add New Image" button

**Create/Edit Form:**
- Title (text input, required)
- Description (textarea, optional)
- Image URL (text input, required)
- Image preview (show image when URL entered)
- Save button
- Cancel button

**Actions:**
- Edit button
- Delete button (with confirmation)
- View full image (modal/lightbox)

**Validation:**
- Title: Required, max 200 characters
- Image URL: Required, must be valid URL
- Description: Optional, max 500 characters

---

### **Page 5: Manage Board Members (`/board-members`)**
**Purpose**: CRUD operations for board members

**Features:**

**List View:**
- Table showing all board members
- Columns: Name, Designation, Created Date, Actions
- "Add New Member" button

**Create/Edit Form:**
- Name (text input, required)
- Designation (text input, required)
- Save button
- Cancel button

**Actions:**
- Edit button
- Delete button (with confirmation)

**Validation:**
- Name: Required, max 100 characters
- Designation: Required, max 100 characters

---

## 🎨 Design Requirements

### **Light Mode:**
- Background: White/Light Gray (#FFFFFF / #F5F5F5)
- Text: Dark Gray/Black (#1F2937 / #000000)
- Primary Color: Emerald/Green (#10B981 / #059669)
- Secondary Color: Gray (#6B7280)
- Borders: Light Gray (#E5E7EB)
- Cards: White with subtle shadow

### **Dark Mode:**
- Background: Dark Gray/Black (#1F2937 / #111827)
- Text: Light Gray/White (#F9FAFB / #FFFFFF)
- Primary Color: Emerald/Green (#10B981)
- Secondary Color: Medium Gray (#9CA3AF)
- Borders: Dark Gray (#374151)
- Cards: Dark Gray with subtle shadow

### **Components:**
- Consistent button styles
- Form inputs with focus states
- Modal dialogs for confirmations
- Toast notifications for success/error
- Loading spinners
- Table with hover effects

---

## 🔧 Technical Specifications

### **Technology Stack (Recommended):**
- **Framework**: Next.js 14+ (App Router) or React with Vite
- **Styling**: Tailwind CSS (for easy light/dark mode)
- **Database**: Supabase Client (@supabase/supabase-js)
- **Authentication**: Supabase Auth
- **State Management**: React Context or Zustand (for auth state)
- **Form Handling**: React Hook Form (optional)
- **Date Picker**: react-datepicker or similar
- **Icons**: Lucide React or Heroicons

### **Environment Variables Required:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://itpfmhdijkroccvcguro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Supabase Client Setup:**
```typescript
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
```

### **Authentication Functions Needed:**
```typescript
// Login
supabase.auth.signInWithPassword({ email, password })

// Get current user
supabase.auth.getUser()

// Logout
supabase.auth.signOut()

// Listen to auth changes
supabase.auth.onAuthStateChange((event, session) => { ... })
```

### **CRUD Operations Examples:**

**Create Event:**
```typescript
const { data, error } = await supabase
  .from('events')
  .insert({
    title: 'Event Title',
    description: 'Event description',
    event_date: '2024-01-15',
    image_url: 'https://example.com/image.jpg'
  })
```

**Read Events:**
```typescript
const { data, error } = await supabase
  .from('events')
  .select('*')
  .order('event_date', { ascending: false })
```

**Update Event:**
```typescript
const { data, error } = await supabase
  .from('events')
  .update({ title: 'Updated Title' })
  .eq('id', eventId)
```

**Delete Event:**
```typescript
const { error } = await supabase
  .from('events')
  .delete()
  .eq('id', eventId)
```

---

## ✅ Success Criteria

### **Functional Requirements:**
- ✅ Admin can log in with email/password
- ✅ Admin can view all events, gallery images, board members
- ✅ Admin can create new records
- ✅ Admin can edit existing records
- ✅ Admin can delete records (with confirmation)
- ✅ Changes reflect immediately on main website
- ✅ Unauthenticated users cannot access admin pages
- ✅ Light/Dark mode toggle works and persists

### **Security Requirements:**
- ✅ All admin routes protected (redirect to login if not authenticated)
- ✅ RLS policies enforced (unauthenticated requests denied)
- ✅ JWT tokens stored securely
- ✅ Logout clears session properly

### **User Experience:**
- ✅ Intuitive navigation
- ✅ Clear error messages
- ✅ Loading states during operations
- ✅ Success notifications after operations
- ✅ Responsive design (works on tablet/desktop)

---

## 📝 Implementation Notes

### **Important:**
1. **Same Supabase Project**: Use the EXACT same Supabase URL and Anon Key as the main website
2. **RLS Policies**: Already applied in database - no need to modify
3. **Authentication**: Must use Supabase Auth (not custom auth)
4. **Token Storage**: Store JWT in localStorage or httpOnly cookies
5. **Error Handling**: Handle RLS policy violations gracefully
6. **Real-time Updates**: Consider using Supabase Realtime (optional) for live updates

### **Testing Checklist:**
- [ ] Login with valid credentials works
- [ ] Login with invalid credentials shows error
- [ ] Can create event (with all fields)
- [ ] Can edit event
- [ ] Can delete event (with confirmation)
- [ ] Can create gallery image
- [ ] Can edit gallery image
- [ ] Can delete gallery image
- [ ] Can create board member
- [ ] Can edit board member
- [ ] Can delete board member
- [ ] Changes appear on main website
- [ ] Logout works and redirects to login
- [ ] Light/Dark mode toggle works
- [ ] Protected routes redirect to login if not authenticated

---

## 🚀 Getting Started

### **Step 1: Create Admin User in Supabase**
1. Go to Supabase Dashboard → Authentication → Users
2. Click "Add User" → "Create new user"
3. Enter admin email and password
4. Save credentials securely

### **Step 2: Set Up Admin Website**
1. Create new Next.js/React project
2. Install dependencies: `@supabase/supabase-js`
3. Set up environment variables (.env.local)
4. Create Supabase client
5. Build login page
6. Build protected routes
7. Implement CRUD operations
8. Add light/dark mode

### **Step 3: Test Connection**
1. Login to admin website
2. Try creating an event
3. Check main website - event should appear
4. Verify RLS is working (try accessing without login)

---

## 📞 Support & Reference

### **Supabase Documentation:**
- Authentication: https://supabase.com/docs/guides/auth
- Database: https://supabase.com/docs/guides/database
- RLS Policies: https://supabase.com/docs/guides/auth/row-level-security

### **Key Points to Remember:**
- Both websites use the SAME Supabase project
- RLS policies are database-level (work for both websites)
- Authentication is token-based (works across websites)
- Admin must be logged in to perform CRUD operations
- Public users can only read data (enforced by RLS)

---

**End of PRD**

