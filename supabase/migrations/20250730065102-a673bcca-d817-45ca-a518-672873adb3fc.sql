-- Update the SELECT policy to allow viewing all neologisms
DROP POLICY "Anyone can view ready neologisms" ON public.neologisms;

CREATE POLICY "Anyone can view all neologisms" 
ON public.neologisms 
FOR SELECT 
USING (true);