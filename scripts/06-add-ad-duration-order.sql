-- Add duration_seconds column (default 10 seconds)
ALTER TABLE community_ads 
ADD COLUMN IF NOT EXISTS duration_seconds INTEGER DEFAULT 10;

-- Add display_order column (default 0, lower numbers display first)
ALTER TABLE community_ads 
ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Update existing rows to have explicit default values
UPDATE community_ads 
SET duration_seconds = 10, display_order = 0 
WHERE duration_seconds IS NULL OR display_order IS NULL;
