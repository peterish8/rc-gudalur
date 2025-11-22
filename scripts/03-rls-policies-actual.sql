-- ============================================
-- RLS POLICIES FOR SECURE ADMIN ACCESS
-- ============================================
-- This enables Row Level Security so that:
-- 1. Public users can READ (SELECT) data to display on website
-- 2. Only authenticated admin users can CREATE, UPDATE, DELETE data
-- ============================================

-- Enable Row Level Security on all tables
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- ============================================
-- GALLERY TABLE POLICIES
-- ============================================

-- Allow public read access (anyone can view gallery images)
CREATE POLICY "Allow public read access on gallery" 
ON public.gallery 
FOR SELECT 
USING (true);

-- Only authenticated users (admins) can insert new gallery images
CREATE POLICY "Allow authenticated insert on gallery" 
ON public.gallery 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can update gallery images
CREATE POLICY "Allow authenticated update on gallery" 
ON public.gallery 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users (admins) can delete gallery images
CREATE POLICY "Allow authenticated delete on gallery" 
ON public.gallery 
FOR DELETE 
TO authenticated
USING (true);

-- ============================================
-- EVENTS TABLE POLICIES
-- ============================================

-- Allow public read access (anyone can view events)
CREATE POLICY "Allow public read access on events" 
ON public.events 
FOR SELECT 
USING (true);

-- Only authenticated users (admins) can insert new events
CREATE POLICY "Allow authenticated insert on events" 
ON public.events 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can update events
CREATE POLICY "Allow authenticated update on events" 
ON public.events 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users (admins) can delete events
CREATE POLICY "Allow authenticated delete on events" 
ON public.events 
FOR DELETE 
TO authenticated
USING (true);

-- ============================================
-- BOARD MEMBERS TABLE POLICIES
-- ============================================

-- Allow public read access (anyone can view board members)
CREATE POLICY "Allow public read access on board_members" 
ON public.board_members 
FOR SELECT 
USING (true);

-- Only authenticated users (admins) can insert new board members
CREATE POLICY "Allow authenticated insert on board_members" 
ON public.board_members 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Only authenticated users (admins) can update board members
CREATE POLICY "Allow authenticated update on board_members" 
ON public.board_members 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Only authenticated users (admins) can delete board members
CREATE POLICY "Allow authenticated delete on board_members" 
ON public.board_members 
FOR DELETE 
TO authenticated
USING (true);

-- ============================================
-- CONTACT FORM SUBMISSIONS (if you have this table)
-- ============================================
-- Uncomment if you have a contact_form_submissions table:

/*
ALTER TABLE public.contact_form_submissions ENABLE ROW LEVEL SECURITY;

-- Allow public to submit contact forms
CREATE POLICY "Allow public insert on contact_form_submissions" 
ON public.contact_form_submissions 
FOR INSERT 
WITH CHECK (true);

-- Only authenticated users (admins) can read contact submissions
CREATE POLICY "Allow authenticated read on contact_form_submissions" 
ON public.contact_form_submissions 
FOR SELECT 
TO authenticated
USING (true);

-- Only authenticated users (admins) can delete contact submissions
CREATE POLICY "Allow authenticated delete on contact_form_submissions" 
ON public.contact_form_submissions 
FOR DELETE 
TO authenticated
USING (true);
*/

-- ============================================
-- NOTES:
-- ============================================
-- 1. After running this, your website will be able to READ data (display events, gallery, etc.)
-- 2. Only users authenticated through Supabase Auth can CREATE, UPDATE, DELETE
-- 3. In your admin page, you'll need to:
--    - Set up Supabase Auth (sign in with email/password)
--    - Use the authenticated Supabase client for CRUD operations
-- 4. Unauthenticated users trying to INSERT/UPDATE/DELETE will get permission denied errors
-- ============================================
