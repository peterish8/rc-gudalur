# How to Add Images for Events in Admin Panel

## 🎯 Overview

When creating/editing events in your admin panel, you need to handle the `image_url` field. There are two approaches:

1. **Upload images to Supabase Storage** (Recommended - Better control)
2. **Enter image URLs directly** (Simpler - Use external images)

---

## 📤 Option 1: Upload Images to Supabase Storage (Recommended)

### **Step 1: Set Up Supabase Storage Bucket**

1. **Go to Supabase Dashboard**

   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Create Storage Bucket**

   - Click **"Storage"** in left sidebar
   - Click **"New bucket"**
   - Name: `event-images` (or `gallery-images` for gallery)
   - **Public bucket**: ✅ Check this (so images are accessible)
   - Click **"Create bucket"**

3. **Set Up RLS Policies for Storage**
   - Go to **Storage** → **Policies**
   - Click on your bucket name
   - Add these policies:

```sql
-- Allow public to read images
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING (bucket_id = 'event-images');

-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-images');

-- Allow authenticated users to update
CREATE POLICY "Authenticated users can update"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'event-images');

-- Allow authenticated users to delete
CREATE POLICY "Authenticated users can delete"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'event-images');
```

### **Step 2: Install Required Package**

In your admin website project:

```bash
npm install @supabase/supabase-js
# Already installed if you're using Supabase
```

### **Step 3: Create Image Upload Component**

Create a file: `components/ImageUpload.tsx`

```typescript
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ImageUploadProps {
  currentImageUrl?: string;
  onImageUploaded: (url: string) => void;
  bucketName: string;
}

export default function ImageUpload({
  currentImageUrl,
  onImageUploaded,
  bucketName,
}: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState(currentImageUrl || "");

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);

      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];
      const fileExt = file.name.split(".").pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload file to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      // Get public URL
      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      const publicUrl = data.publicUrl;
      setPreview(publicUrl);
      onImageUploaded(publicUrl);
    } catch (error: any) {
      alert(`Error uploading image: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current/Preview Image */}
      {preview && (
        <div className="relative w-full h-64 border rounded-lg overflow-hidden">
          <img
            src={preview}
            alt="Preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Upload Button */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {preview ? "Change Image" : "Upload Image"}
        </label>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          disabled={uploading}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-full file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100
            disabled:opacity-50"
        />
        {uploading && (
          <p className="mt-2 text-sm text-gray-600">Uploading...</p>
        )}
      </div>
    </div>
  );
}
```

### **Step 4: Use in Event Form**

In your event create/edit form:

```typescript
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUpload from "@/components/ImageUpload";

export default function EventForm({ eventId }: { eventId?: string }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    image_url: "",
  });

  const handleImageUploaded = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (eventId) {
      // Update existing event
      const { error } = await supabase
        .from("events")
        .update(formData)
        .eq("id", eventId);
    } else {
      // Create new event
      const { error } = await supabase.from("events").insert([formData]);
    }

    // Handle success/error
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium">Title</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          className="mt-1 block w-full px-3 py-2 border rounded-md"
          rows={4}
        />
      </div>

      {/* Event Date */}
      <div>
        <label className="block text-sm font-medium">Event Date</label>
        <input
          type="date"
          value={formData.event_date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, event_date: e.target.value }))
          }
          required
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Image Upload */}
      <div>
        <label className="block text-sm font-medium mb-2">Event Image</label>
        <ImageUpload
          currentImageUrl={formData.image_url}
          onImageUploaded={handleImageUploaded}
          bucketName="event-images"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
      >
        {eventId ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
}
```

---

## 🔗 Option 2: Enter Image URL Directly (Simpler)

If you prefer to use external image URLs (from other websites or CDNs):

### **Simple URL Input Form**

```typescript
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function EventForm({ eventId }: { eventId?: string }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    image_url: "",
  });

  const [imagePreview, setImagePreview] = useState("");

  const handleImageUrlChange = (url: string) => {
    setFormData((prev) => ({ ...prev, image_url: url }));
    setImagePreview(url); // Show preview
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ... other fields ... */}

      {/* Image URL Input */}
      <div>
        <label className="block text-sm font-medium mb-2">
          Event Image URL
        </label>
        <input
          type="url"
          value={formData.image_url}
          onChange={(e) => handleImageUrlChange(e.target.value)}
          placeholder="https://example.com/image.jpg"
          className="mt-1 block w-full px-3 py-2 border rounded-md"
        />

        {/* Image Preview */}
        {imagePreview && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">Preview:</p>
            <div className="relative w-full h-64 border rounded-lg overflow-hidden">
              <img
                src={imagePreview}
                alt="Preview"
                className="w-full h-full object-cover"
                onError={() => setImagePreview("")} // Hide if image fails to load
              />
            </div>
          </div>
        )}
      </div>

      <button type="submit">Save Event</button>
    </form>
  );
}
```

---

## 🎨 Enhanced Image Upload with Drag & Drop

For a better user experience, you can add drag & drop:

```typescript
"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ImageUpload({ onImageUploaded, bucketName }: any) {
  const [uploading, setUploading] = useState(false);
  const [preview, setPreview] = useState("");
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

      setPreview(data.publicUrl);
      onImageUploaded(data.publicUrl);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${uploading ? "opacity-50" : ""}`}
    >
      {preview ? (
        <div className="space-y-4">
          <img
            src={preview}
            alt="Preview"
            className="max-h-64 mx-auto rounded"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="text-blue-600 hover:text-blue-700"
          >
            Change Image
          </button>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-4">
            Drag & drop an image here, or click to select
          </p>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            disabled={uploading}
          >
            {uploading ? "Uploading..." : "Select Image"}
          </button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
```

---

## 📋 Quick Setup Checklist

### **For Supabase Storage Upload:**

- [ ] Create storage bucket in Supabase Dashboard
- [ ] Set bucket to public
- [ ] Add RLS policies for storage
- [ ] Create ImageUpload component
- [ ] Add to event form
- [ ] Test upload functionality

### **For URL Input:**

- [ ] Add URL input field to form
- [ ] Add image preview
- [ ] Validate URL format
- [ ] Test with external image URLs

---

## 🎯 Recommendation

**Use Supabase Storage (Option 1)** because:

- ✅ Images stored in your own storage
- ✅ Better performance
- ✅ Full control over images
- ✅ Can delete/update images easily
- ✅ Free tier available (1GB storage)

**Use URL Input (Option 2)** if:

- You're using external image hosting (Imgur, Cloudinary, etc.)
- You want simpler implementation
- You don't need to manage image storage

---

## 🚀 Next Steps

1. Choose your approach (Storage or URL)
2. Set up Supabase Storage bucket (if using Option 1)
3. Add image upload/input to your event form
4. Test creating an event with an image
5. Verify image appears on main website

**That's it!** Your admin can now add images to events! 🎉
