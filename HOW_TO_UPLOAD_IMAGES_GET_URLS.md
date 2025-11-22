# How to Upload Your Own Images and Get URLs

## 🎯 What You Want

You want to:

1. Upload your own images (from your computer)
2. Get a URL for that image
3. Use that URL in the admin panel

## ✅ Solution: Use Supabase Storage

When you upload an image to Supabase Storage, it **automatically gives you a URL** that you can use anywhere!

---

## 📤 Method 1: Upload via Admin Panel (Recommended)

### **How It Works:**

```
1. You select image from your computer
   ↓
2. Admin panel uploads to Supabase Storage
   ↓
3. Supabase gives you a URL automatically
   ↓
4. URL is saved to database
   ↓
5. Image appears on your website!
```

### **Step 1: Set Up Supabase Storage**

1. **Go to Supabase Dashboard**

   - Visit: https://supabase.com/dashboard
   - Select your project

2. **Create Storage Bucket**

   - Click **"Storage"** in left sidebar
   - Click **"New bucket"** button
   - **Name**: `event-images`
   - **Public bucket**: ✅ **Check this** (Important! Makes images accessible)
   - Click **"Create bucket"**

3. **Set Up Storage Policies** (Allow uploads)

Go to **Storage** → **Policies** → Click on `event-images` bucket

Run this SQL in Supabase SQL Editor:

```sql
-- Allow public to view images
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

### **Step 2: Add Upload Component to Admin Panel**

Create this component in your admin website:

**File: `components/ImageUploader.tsx`**

```typescript
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

interface ImageUploaderProps {
  onImageUploaded: (url: string) => void;
  currentImageUrl?: string;
}

export default function ImageUploader({
  onImageUploaded,
  currentImageUrl,
}: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImageUrl || "");
  const [uploadProgress, setUploadProgress] = useState("");

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      // Check if file is selected
      if (!e.target.files || e.target.files.length === 0) {
        return;
      }

      const file = e.target.files[0];

      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file (jpg, png, etc.)");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setUploading(true);
      setUploadProgress("Uploading image...");

      // Create unique filename
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from("event-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (uploadError) {
        throw uploadError;
      }

      setUploadProgress("Getting image URL...");

      // Get public URL (this is what you need!)
      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      const publicUrl = data.publicUrl;

      setImageUrl(publicUrl);
      onImageUploaded(publicUrl); // This saves the URL to your form
      setUploadProgress("✅ Image uploaded successfully!");

      // Clear progress message after 2 seconds
      setTimeout(() => setUploadProgress(""), 2000);
    } catch (error: any) {
      console.error("Error uploading image:", error);
      alert(`Failed to upload image: ${error.message}`);
      setUploadProgress("");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Current Image Preview */}
      {imageUrl && (
        <div className="border rounded-lg p-4">
          <p className="text-sm font-medium mb-2">Current Image:</p>
          <div className="relative w-full h-64 border rounded-lg overflow-hidden bg-gray-100">
            <img
              src={imageUrl}
              alt="Event image"
              className="w-full h-full object-cover"
              onError={() => {
                setImageUrl("");
                alert("Failed to load image. Please try uploading again.");
              }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-2 break-all">
            URL: {imageUrl}
          </p>
        </div>
      )}

      {/* Upload Button */}
      <div>
        <label className="block text-sm font-medium mb-2">
          {imageUrl ? "Change Image" : "Upload Event Image"}
        </label>
        <div className="flex items-center space-x-4">
          <label className="cursor-pointer">
            <span className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed">
              {uploading
                ? "Uploading..."
                : imageUrl
                ? "Change Image"
                : "Select Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploading}
              className="hidden"
            />
          </label>
          {uploadProgress && (
            <span className="text-sm text-gray-600">{uploadProgress}</span>
          )}
        </div>
        <p className="text-xs text-gray-500 mt-2">
          Supported: JPG, PNG, GIF, WebP (Max 5MB)
        </p>
      </div>
    </div>
  );
}
```

### **Step 3: Use in Your Event Form**

```typescript
"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import ImageUploader from "@/components/ImageUploader";

export default function EventForm({ eventId }: { eventId?: string }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    event_date: "",
    image_url: "", // This will store the URL
  });

  const handleImageUploaded = (url: string) => {
    // This function is called when image is uploaded
    // The URL is automatically saved to formData
    setFormData((prev) => ({ ...prev, image_url: url }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (eventId) {
        // Update event
        const { error } = await supabase
          .from("events")
          .update(formData)
          .eq("id", eventId);

        if (error) throw error;
        alert("Event updated successfully!");
      } else {
        // Create new event
        const { error } = await supabase.from("events").insert([formData]);

        if (error) throw error;
        alert("Event created successfully!");
      }
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
      {/* Title */}
      <div>
        <label className="block text-sm font-medium mb-2">Event Title *</label>
        <input
          type="text"
          value={formData.title}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, title: e.target.value }))
          }
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium mb-2">Description</label>
        <textarea
          value={formData.description}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, description: e.target.value }))
          }
          rows={4}
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Event Date */}
      <div>
        <label className="block text-sm font-medium mb-2">Event Date *</label>
        <input
          type="date"
          value={formData.event_date}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, event_date: e.target.value }))
          }
          required
          className="w-full px-3 py-2 border rounded-md"
        />
      </div>

      {/* Image Upload */}
      <div>
        <ImageUploader
          onImageUploaded={handleImageUploaded}
          currentImageUrl={formData.image_url}
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="bg-green-600 text-white px-6 py-2 rounded-md hover:bg-green-700"
      >
        {eventId ? "Update Event" : "Create Event"}
      </button>
    </form>
  );
}
```

---

## 🎯 How It Works - Step by Step

### **When Admin Uploads Image:**

1. **Admin clicks "Select Image"**

   - File picker opens
   - Admin selects image from computer

2. **Image Uploads to Supabase**

   - Image is uploaded to `event-images` bucket
   - Stored securely in your Supabase project

3. **Supabase Returns URL**

   - URL looks like: `https://itpfmhdijkroccvcguro.supabase.co/storage/v1/object/public/event-images/events/1234567890-abc123.jpg`
   - This URL is **publicly accessible**

4. **URL Saved to Database**

   - URL is saved in `events.image_url` field
   - When main website loads events, it uses this URL to display image

5. **Image Appears on Website**
   - Main website fetches events from database
   - Gets the `image_url`
   - Displays image using that URL

---

## 🔄 Alternative: Manual Upload (If You Want to Upload Outside Admin Panel)

### **Option A: Upload via Supabase Dashboard**

1. Go to **Supabase Dashboard** → **Storage** → **event-images**
2. Click **"Upload file"**
3. Select your image
4. After upload, click on the file
5. Copy the **Public URL**
6. Paste that URL in your admin panel's image URL field

### **Option B: Use Image Hosting Services**

If you want to use external services:

1. **Imgur** (Free)

   - Go to https://imgur.com
   - Upload your image
   - Copy the direct image URL
   - Paste in admin panel

2. **Cloudinary** (Free tier available)

   - Upload image
   - Get URL
   - Use in admin panel

3. **Google Drive** (If you have images there)
   - Upload to Google Drive
   - Get shareable link
   - Convert to direct image URL (requires conversion tool)

---

## 📋 Complete Setup Checklist

- [ ] Create `event-images` bucket in Supabase Storage
- [ ] Make bucket public
- [ ] Add storage RLS policies (SQL provided above)
- [ ] Create `ImageUploader` component in admin website
- [ ] Add to event form
- [ ] Test: Upload image → Check URL is saved → Verify on main website

---

## 🎨 Enhanced Version with Drag & Drop

If you want a better user experience:

```typescript
"use client";

import { useState, useRef } from "react";
import { supabase } from "@/lib/supabase";

export default function ImageUploader({
  onImageUploaded,
  currentImageUrl,
}: any) {
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    try {
      setUploading(true);
      const fileExt = file.name.split(".").pop();
      const fileName = `${Date.now()}-${Math.random()
        .toString(36)
        .substring(7)}.${fileExt}`;
      const filePath = `events/${fileName}`;

      const { error } = await supabase.storage
        .from("event-images")
        .upload(filePath, file);

      if (error) throw error;

      const { data } = supabase.storage
        .from("event-images")
        .getPublicUrl(filePath);

      onImageUploaded(data.publicUrl);
    } catch (error: any) {
      alert(`Error: ${error.message}`);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div
      onDrop={(e) => {
        e.preventDefault();
        setDragging(false);
        if (e.dataTransfer.files[0]) uploadFile(e.dataTransfer.files[0]);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setDragging(true);
      }}
      onDragLeave={() => setDragging(false)}
      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors
        ${dragging ? "border-blue-500 bg-blue-50" : "border-gray-300"}
        ${uploading ? "opacity-50" : "cursor-pointer"}`}
      onClick={() => fileInputRef.current?.click()}
    >
      {currentImageUrl ? (
        <div className="space-y-4">
          <img
            src={currentImageUrl}
            alt="Preview"
            className="max-h-64 mx-auto rounded"
          />
          <p className="text-sm text-gray-600">
            Click or drag new image to change
          </p>
        </div>
      ) : (
        <div>
          <p className="text-gray-600 mb-2">📷 Drag & drop your image here</p>
          <p className="text-sm text-gray-500">or click to browse</p>
          {uploading && <p className="mt-2 text-blue-600">Uploading...</p>}
        </div>
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={(e) => e.target.files?.[0] && uploadFile(e.target.files[0])}
        className="hidden"
      />
    </div>
  );
}
```

---

## ✅ Summary

**What happens when you upload:**

1. You select image from computer
2. Image uploads to Supabase Storage
3. **Supabase automatically gives you a URL**
4. URL is saved to database
5. Image appears on your website using that URL

**You don't need to manually create URLs** - Supabase does it automatically when you upload!

The URL format will be:

```
https://[your-project].supabase.co/storage/v1/object/public/event-images/events/[filename].jpg
```

This URL is permanent and can be used anywhere! 🎉
