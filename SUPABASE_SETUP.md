# Supabase Database Setup Guide

## Step 1: Access Your Supabase Dashboard

1. Go to https://supabase.com/dashboard
2. Sign in to your account
3. Select your project (or create a new one)

## Step 2: Create Database Tables

1. In your Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Copy and paste the contents of `scripts/01-create-tables.sql` into the editor
4. Click **Run** to execute the SQL

This will create the following tables:
- `events` - For storing club events
- `board_members` - For storing board member information
- `gallery` - For storing gallery images
- `about` - For storing about section content
- `contact_form_submissions` - For storing contact form submissions

## Step 3: Set Up Row Level Security (RLS) Policies

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `scripts/03-rls-policies.sql` into the editor
3. Click **Run** to execute the SQL

This will set up security policies to allow public read access to events, gallery, and board_members, while allowing insert access to contact_form_submissions.

## Step 4: (Optional) Seed Initial Data

1. In the SQL Editor, create a new query
2. Copy and paste the contents of `scripts/02-seed-data.sql` into the editor
3. Click **Run** to execute the SQL

This will add some sample data to get you started.

## Step 5: Verify Your Environment Variables

Make sure your `.env.local` file contains:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

You can find these values in your Supabase dashboard under **Settings** > **API**.

## Troubleshooting

### "Failed to fetch" Error

This usually means:
1. **Tables don't exist** - Run the SQL scripts in Step 2
2. **RLS policies are blocking access** - Run the RLS policies script in Step 3
3. **Incorrect Supabase URL or Key** - Verify your `.env.local` file

### "relation does not exist" Error

This means the tables haven't been created yet. Follow Step 2 to create them.

### Network Errors

- Check your internet connection
- Verify your Supabase project is active (not paused)
- Check that your Supabase URL is correct

## Testing the Connection

After setting up the tables, restart your Next.js dev server:

```bash
npm run dev
```

The application should now be able to fetch data from Supabase. If tables are empty, the app will show fallback data until you add content through your admin interface.


