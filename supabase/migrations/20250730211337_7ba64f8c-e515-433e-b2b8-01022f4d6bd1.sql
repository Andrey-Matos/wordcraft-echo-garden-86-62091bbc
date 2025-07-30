-- Drop the existing INSERT policy for categories
DROP POLICY "Authenticated users can create categories" ON public.categories;

-- Create a new policy that allows anyone to insert categories
CREATE POLICY "Anyone can create categories" 
ON public.categories 
FOR INSERT 
WITH CHECK (true);