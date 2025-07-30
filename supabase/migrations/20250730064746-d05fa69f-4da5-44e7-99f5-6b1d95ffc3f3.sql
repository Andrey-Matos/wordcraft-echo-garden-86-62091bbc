-- Make user_id nullable since we don't require authentication
ALTER TABLE public.neologisms ALTER COLUMN user_id DROP NOT NULL;

-- Drop existing restrictive RLS policies
DROP POLICY "Users can create their own neologisms" ON public.neologisms;
DROP POLICY "Users can update their own neologisms" ON public.neologisms;
DROP POLICY "Users can delete their own neologisms" ON public.neologisms;

-- Create new public policies that allow anyone to create, update, and delete
CREATE POLICY "Anyone can create neologisms" 
ON public.neologisms 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Anyone can update neologisms" 
ON public.neologisms 
FOR UPDATE 
USING (true);

CREATE POLICY "Anyone can delete neologisms" 
ON public.neologisms 
FOR DELETE 
USING (true);