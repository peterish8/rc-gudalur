# Prompt for AI: Admin Board Members Management with Section Control

## 🎯 Project Requirements

Build an admin interface to manage board members with **section control**. Each board member can be assigned to one of these sections:

1. **Fixed Section** - First 3 members displayed at top (non-scrolling)
2. **Scrolling Layer 1** - First scrolling row
3. **Scrolling Layer 2** - Second scrolling row
4. **Scrolling Layer 3** - Third scrolling row

---

## 📊 Database Structure

### **Table: `public.board_members`**

```sql
Columns:
- id (uuid, PRIMARY KEY, auto-generated)
- name (text, NOT NULL)
- designation (text, NOT NULL)
- section (text, NULLABLE) ← IMPORTANT: Controls which section member appears in
  - Possible values: "fixed", "layer1", "layer2", "layer3", "scrolling"
  - Default: "scrolling" (for backward compatibility)
- created_at (timestamp, default: now())
```

### **SQL to Add Section Field (if not exists):**

```sql
ALTER TABLE public.board_members 
ADD COLUMN IF NOT EXISTS section text DEFAULT 'scrolling';

UPDATE public.board_members 
SET section = 'scrolling' 
WHERE section IS NULL;
```

---

## 🔐 Authentication & RLS

- **RLS Policies**: Already applied
- **Public SELECT**: Anyone can read/view
- **Authenticated CRUD**: Only logged-in admins can create/update/delete
- **Authentication**: Use Supabase Auth (email/password)

---

## 📱 Required Admin Pages

### **Page: Manage Board Members (`/board-members`)**

**Features Needed:**

1. **List View** - Show all members grouped by section:
   - Fixed Section (max 3 shown)
   - Scrolling Layer 1
   - Scrolling Layer 2
   - Scrolling Layer 3
   - Unassigned (members without section)

2. **Create/Edit Form**:
   - Name (text input, required)
   - Designation (text input, required)
   - **Section (dropdown, required)**:
     - Options:
       - "Fixed Section (Top 3 - Non-scrolling)"
       - "Scrolling Layer 1 (First scrolling row)"
       - "Scrolling Layer 2 (Second scrolling row)"
       - "Scrolling Layer 3 (Third scrolling row)"
   - Save button
   - Cancel button

3. **Actions**:
   - Edit button (opens form with current values)
   - Delete button (with confirmation)
   - Move between sections (quick action)

4. **Visual Organization**:
   - Group members by section
   - Show count for each section
   - Highlight fixed section (max 3 limit)

---

## 💻 Code Structure

### **Supabase Connection:**

```typescript
// Use same Supabase project as main website
NEXT_PUBLIC_SUPABASE_URL=https://itpfmhdijkroccvcguro.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **TypeScript Types:**

```typescript
type BoardMember = {
  id: string // UUID
  name: string
  designation: string
  section?: string // "fixed", "layer1", "layer2", "layer3"
  created_at: string
}
```

### **CRUD Operations:**

```typescript
// Create
await supabase.from("board_members").insert({
  name: "Member Name",
  designation: "Position",
  section: "fixed" // or "layer1", "layer2", "layer3"
})

// Read (grouped by section)
const { data } = await supabase
  .from("board_members")
  .select("*")
  .order("created_at", { ascending: true })

// Update (including section change)
await supabase
  .from("board_members")
  .update({ section: "layer1" })
  .eq("id", memberId)

// Delete
await supabase
  .from("board_members")
  .delete()
  .eq("id", memberId)
```

---

## 🎨 UI Requirements

### **List View:**
- Cards or table showing members
- Grouped by section with clear headers
- Show section badge/indicator
- Edit and Delete buttons for each member

### **Form:**
- Clean, simple form
- Section dropdown with clear labels
- Validation (name and designation required)
- Success/error messages

### **Section Indicators:**
- Fixed: Show "Fixed (Top 3)" badge
- Layer 1: Show "Layer 1" badge
- Layer 2: Show "Layer 2" badge
- Layer 3: Show "Layer 3" badge

---

## ✅ Key Features

1. **Section Assignment**: Admin can assign any member to any section
2. **Section Change**: Easy to move members between sections
3. **Fixed Limit**: Warn if more than 3 members in fixed section
4. **Visual Grouping**: Members organized by section in admin
5. **Real-time Updates**: Changes reflect immediately on main website

---

## 📋 Implementation Checklist

- [ ] Add `section` field to database (run SQL)
- [ ] Create admin page route (`/board-members`)
- [ ] Build list view with section grouping
- [ ] Build create/edit form with section dropdown
- [ ] Add delete functionality
- [ ] Add section change functionality
- [ ] Test: Create member in each section
- [ ] Test: Move member between sections
- [ ] Verify changes appear on main website

---

## 🎯 Expected Behavior

### **When Admin Creates Member:**
1. Selects section (fixed, layer1, layer2, layer3)
2. Member is saved with that section
3. Member appears in correct section on main website

### **When Admin Changes Section:**
1. Edits member
2. Changes section dropdown
3. Saves
4. Member moves to new section on main website

### **Fixed Section:**
- Only first 3 members with `section = "fixed"` will show
- If more than 3, only first 3 are displayed
- Admin should be warned if trying to add 4th fixed member

---

## 🚀 Quick Start

1. Run SQL to add `section` field
2. Build admin interface with section dropdown
3. Group members by section in list view
4. Allow section changes on edit
5. Test and verify on main website

**The main website component is already updated to use the section field!**

---

**Full implementation guide available in: `ADMIN_BOARD_MEMBERS_SECTION_CONTROL.md`**

