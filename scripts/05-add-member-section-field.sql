-- Add section field to board_members table to control which section member appears in
-- This allows admin to control: fixed members, scrolling layer 1, 2, or 3

ALTER TABLE public.board_members 
ADD COLUMN IF NOT EXISTS section text DEFAULT 'scrolling';

-- Add comment to explain the field
COMMENT ON COLUMN public.board_members.section IS 
'Controls which section member appears in: "fixed" (first 3 at top), "layer1", "layer2", "layer3" (scrolling layers)';

-- Update existing members to have default section
UPDATE public.board_members 
SET section = 'scrolling' 
WHERE section IS NULL;

-- Optional: Set first 3 members as fixed (if you want)
-- UPDATE public.board_members 
-- SET section = 'fixed' 
-- WHERE id IN (
--   SELECT id FROM public.board_members 
--   ORDER BY created_at ASC 
--   LIMIT 3
-- );

