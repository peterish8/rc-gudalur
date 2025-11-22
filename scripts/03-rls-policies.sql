-- Enable Row Level Security on all tables
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.board_members ENABLE ROW LEVEL SECURITY;

-- Allow public read access to gallery (for displaying images on website)
CREATE POLICY "Allow public read access on gallery" 
ON public.gallery 
FOR SELECT 
USING (true);

-- Allow public read access to events (for displaying events on website)
CREATE POLICY "Allow public read access on events" 
ON public.events 
FOR SELECT 
USING (true);

-- Allow public read access to board_members (for displaying board members on website)
CREATE POLICY "Allow public read access on board_members" 
ON public.board_members 
FOR SELECT 
USING (true);

-- Optional: If you have a contact_form_submissions table, enable RLS and allow public inserts
-- Uncomment the following if you have this table:
/*
ALTER TABLE public.contact_form_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on contact_form_submissions" 
ON public.contact_form_submissions 
FOR INSERT 
WITH CHECK (true);
*/

-- Optional: If you want to allow authenticated users (admins) to insert/update/delete
-- Uncomment and modify these policies as needed:
/*
-- Allow authenticated users to insert events
CREATE POLICY "Allow authenticated insert on events" 
ON public.events 
FOR INSERT 
TO authenticated
WITH CHECK (true);

-- Allow authenticated users to update events
CREATE POLICY "Allow authenticated update on events" 
ON public.events 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

-- Allow authenticated users to delete events
CREATE POLICY "Allow authenticated delete on events" 
ON public.events 
FOR DELETE 
TO authenticated
USING (true);

-- Similar policies for gallery
CREATE POLICY "Allow authenticated insert on gallery" 
ON public.gallery 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on gallery" 
ON public.gallery 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on gallery" 
ON public.gallery 
FOR DELETE 
TO authenticated
USING (true);

-- Similar policies for board_members
CREATE POLICY "Allow authenticated insert on board_members" 
ON public.board_members 
FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated update on board_members" 
ON public.board_members 
FOR UPDATE 
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Allow authenticated delete on board_members" 
ON public.board_members 
FOR DELETE 
TO authenticated
USING (true);
*/
