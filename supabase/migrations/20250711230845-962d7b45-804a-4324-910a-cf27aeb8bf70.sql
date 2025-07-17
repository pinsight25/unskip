
-- First, let's check what RLS policies currently exist on the users table
SELECT * FROM pg_policies WHERE tablename = 'users';

-- Create a policy to allow authenticated users to read their own data
CREATE POLICY "Users can read own data" ON users
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create a temporary policy to allow authenticated users to read all user data (for debugging)
-- This can be removed later once we confirm the auth flow is working
CREATE POLICY "Users can read all users" ON users
FOR SELECT 
TO authenticated
USING (true);

-- Also ensure users can insert their own profile during signup
CREATE POLICY "Users can insert own profile" ON users
FOR INSERT 
TO authenticated
WITH CHECK (auth.uid() = id);

-- Allow users to update their own profile
CREATE POLICY "Users can update own profile" ON users
FOR UPDATE 
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Create saved_cars table for user wishlists
CREATE TABLE IF NOT EXISTS public.saved_cars (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, car_id)
);

-- Enable RLS
ALTER TABLE public.saved_cars ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Users can only see their own saved cars
CREATE POLICY "Users can view own saved cars" ON public.saved_cars
  FOR SELECT USING (auth.uid() = user_id);
-- Users can save cars
CREATE POLICY "Users can save cars" ON public.saved_cars
  FOR INSERT WITH CHECK (auth.uid() = user_id);
-- Users can remove saved cars
CREATE POLICY "Users can delete own saved cars" ON public.saved_cars
  FOR DELETE USING (auth.uid() = user_id);
