-- Add progress_step column to application_drafts table
-- Bug-272: Fix progress calculation in progress bar

ALTER TABLE public.application_drafts 
ADD COLUMN progress_step INTEGER DEFAULT 1;

-- Add comment to explain the column
COMMENT ON COLUMN public.application_drafts.progress_step IS 'Progress step based on last edited field (1-6)';

-- Update existing drafts to have a default progress_step based on their last_step
UPDATE public.application_drafts 
SET progress_step = CASE 
  WHEN last_step = 0 THEN 1
  WHEN last_step = 1 THEN 2
  WHEN last_step = 2 THEN 3
  WHEN last_step = 3 THEN 4
  WHEN last_step = 4 THEN 5
  WHEN last_step >= 5 THEN 6
  ELSE 1
END
WHERE progress_step IS NULL;
