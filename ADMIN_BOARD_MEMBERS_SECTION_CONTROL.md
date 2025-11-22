# Admin Control for Board Members Sections

## 🎯 Overview

This feature allows admins to control which section each board member appears in:

- **Fixed Section**: First 3 members displayed at the top (non-scrolling)
- **Scrolling Layer 1**: First scrolling row
- **Scrolling Layer 2**: Second scrolling row
- **Scrolling Layer 3**: Third scrolling row

---

## 📊 Database Structure Update

### **Step 1: Add Section Field to Database**

Run this SQL in Supabase SQL Editor:

```sql
-- Add section field to board_members table
ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS section text DEFAULT 'scrolling';

-- Update existing members to have default section
UPDATE public.board_members
SET section = 'scrolling'
WHERE section IS NULL;
```

### **Updated Table Structure:**

```sql
Table: public.board_members
Columns:
- id (uuid, PRIMARY KEY)
- name (text, NOT NULL)
- designation (text, NOT NULL)
- section (text, NULLABLE) ← NEW FIELD
  - Values: "fixed", "layer1", "layer2", "layer3"
  - Default: "scrolling" (for backward compatibility)
- created_at (timestamp, default: now())
```

---

## 💻 Admin Interface Code

### **Updated Board Members Form with Section Selection**

**File: `app/admin/board-members/page.tsx`** (or your admin route)

```typescript
"use client";

import { useState, useEffect } from "react";
import { supabase, type BoardMember } from "@/lib/supabase";

export default function ManageBoardMembers() {
  const [members, setMembers] = useState<BoardMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingMember, setEditingMember] = useState<BoardMember | null>(null);
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const { data, error } = await supabase
        .from("board_members")
        .select("*")
        .order("created_at", { ascending: true });

      if (error) throw error;
      setMembers(data || []);
    } catch (error) {
      console.error("Error fetching members:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    const memberData = {
      name: formData.get("name") as string,
      designation: formData.get("designation") as string,
      section: (formData.get("section") as string) || "scrolling",
    };

    try {
      if (editingMember) {
        // Update existing member
        const { error } = await supabase
          .from("board_members")
          .update(memberData)
          .eq("id", editingMember.id);

        if (error) throw error;
      } else {
        // Create new member
        const { error } = await supabase
          .from("board_members")
          .insert([memberData]);

        if (error) throw error;
      }

      await fetchMembers();
      setShowForm(false);
      setEditingMember(null);
      // Reset form
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this member?")) return;

    try {
      const { error } = await supabase
        .from("board_members")
        .delete()
        .eq("id", id);

      if (error) throw error;
      await fetchMembers();
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  const handleEdit = (member: BoardMember) => {
    setEditingMember(member);
    setShowForm(true);
  };

  // Group members by section for better display
  const fixedMembers = members.filter((m) => m.section === "fixed");
  const layer1Members = members.filter((m) => m.section === "layer1");
  const layer2Members = members.filter((m) => m.section === "layer2");
  const layer3Members = members.filter((m) => m.section === "layer3");
  const otherMembers = members.filter(
    (m) =>
      !m.section ||
      !["fixed", "layer1", "layer2", "layer3"].includes(m.section || "")
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Manage Board Members</h1>
          <button
            onClick={() => {
              setEditingMember(null);
              setShowForm(true);
            }}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Add New Member
          </button>
        </div>

        {/* Create/Edit Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <h2 className="text-xl font-bold mb-4">
              {editingMember ? "Edit Member" : "Add New Member"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name *</label>
                <input
                  type="text"
                  name="name"
                  defaultValue={editingMember?.name || ""}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Designation *
                </label>
                <input
                  type="text"
                  name="designation"
                  defaultValue={editingMember?.designation || ""}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Section *
                </label>
                <select
                  name="section"
                  defaultValue={editingMember?.section || "scrolling"}
                  required
                  className="w-full px-3 py-2 border rounded-md"
                >
                  <option value="fixed">
                    Fixed Section (Top 3 - Non-scrolling)
                  </option>
                  <option value="layer1">
                    Scrolling Layer 1 (First scrolling row)
                  </option>
                  <option value="layer2">
                    Scrolling Layer 2 (Second scrolling row)
                  </option>
                  <option value="layer3">
                    Scrolling Layer 3 (Third scrolling row)
                  </option>
                  <option value="scrolling">
                    Auto-assign (Legacy - will be distributed)
                  </option>
                </select>
                <p className="text-xs text-gray-500 mt-1">
                  Fixed section shows first 3 members at top. Each layer scrolls
                  independently.
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700"
                >
                  {editingMember ? "Update Member" : "Create Member"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowForm(false);
                    setEditingMember(null);
                  }}
                  className="bg-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Members List Grouped by Section */}
        {loading ? (
          <p>Loading members...</p>
        ) : (
          <div className="space-y-8">
            {/* Fixed Members */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Fixed Section ({fixedMembers.length}/3 max)
              </h2>
              {fixedMembers.length === 0 ? (
                <p className="text-gray-500">No members in fixed section</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {fixedMembers.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.designation}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Layer 1 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Scrolling Layer 1 ({layer1Members.length} members)
              </h2>
              {layer1Members.length === 0 ? (
                <p className="text-gray-500">No members in layer 1</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {layer1Members.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.designation}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Layer 2 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Scrolling Layer 2 ({layer2Members.length} members)
              </h2>
              {layer2Members.length === 0 ? (
                <p className="text-gray-500">No members in layer 2</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {layer2Members.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.designation}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Layer 3 */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">
                Scrolling Layer 3 ({layer3Members.length} members)
              </h2>
              {layer3Members.length === 0 ? (
                <p className="text-gray-500">No members in layer 3</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {layer3Members.map((member) => (
                    <div key={member.id} className="border rounded-lg p-4">
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.designation}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Other Members (no section assigned) */}
            {otherMembers.length > 0 && (
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold mb-4">
                  Unassigned Members ({otherMembers.length})
                </h2>
                <p className="text-sm text-yellow-800 mb-4">
                  These members don't have a section assigned. Edit them to
                  assign a section.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {otherMembers.map((member) => (
                    <div
                      key={member.id}
                      className="border rounded-lg p-4 bg-white"
                    >
                      <h3 className="font-bold">{member.name}</h3>
                      <p className="text-sm text-gray-600">
                        {member.designation}
                      </p>
                      <div className="mt-2 flex gap-2">
                        <button
                          onClick={() => handleEdit(member)}
                          className="text-blue-600 hover:text-blue-700 text-sm"
                        >
                          Edit & Assign Section
                        </button>
                        <button
                          onClick={() => handleDelete(member.id)}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
```

---

## 🔄 Updated Component Code

The main website component has been updated to use the `section` field. Here's what changed:

### **Key Changes:**

1. **Organizes by section field** instead of index
2. **Fixed members**: Shows members with `section = "fixed"` (max 3)
3. **Layer 1**: Shows members with `section = "layer1"`
4. **Layer 2**: Shows members with `section = "layer2"`
5. **Layer 3**: Shows members with `section = "layer3"`
6. **Fallback**: If no section field, uses old logic (backward compatible)

---

## 📋 Setup Instructions

### **Step 1: Update Database**

Run this SQL in Supabase SQL Editor:

```sql
ALTER TABLE public.board_members
ADD COLUMN IF NOT EXISTS section text DEFAULT 'scrolling';

UPDATE public.board_members
SET section = 'scrolling'
WHERE section IS NULL;
```

### **Step 2: Update Type Definition**

The `BoardMember` type in `lib/supabase.ts` has been updated to include `section?: string`

### **Step 3: Component Already Updated**

The `components/board-members.tsx` component has been updated to use the section field.

### **Step 4: Add Admin Interface**

Add the admin interface code provided above to your admin website.

---

## 🎯 How It Works

### **For Admin:**

1. **Create/Edit Member**

   - Select section: Fixed, Layer 1, Layer 2, or Layer 3
   - Fixed section: Only first 3 will show (others ignored)
   - Each layer: Shows all members assigned to that layer

2. **View Members by Section**
   - Members are grouped by section in admin panel
   - Easy to see which members are in which section
   - Can edit section for any member

### **For Website:**

1. **Fetches all members** from Supabase
2. **Filters by section**:
   - `section = "fixed"` → Fixed section (top)
   - `section = "layer1"` → First scrolling row
   - `section = "layer2"` → Second scrolling row
   - `section = "layer3"` → Third scrolling row
3. **Displays accordingly**

---

## ✅ Benefits

- ✅ **Full Control**: Admin decides which member goes where
- ✅ **Flexible**: Can move members between sections easily
- ✅ **Visual Organization**: Members grouped by section in admin
- ✅ **Backward Compatible**: Works with existing members
- ✅ **No Limits**: Can have as many members as needed in each layer

---

## 🚀 Quick Start

1. Run the SQL to add `section` field
2. Add the admin interface code to your admin website
3. Start assigning members to sections!
4. Changes reflect immediately on main website

**That's it!** You now have full control over board member sections! 🎉
