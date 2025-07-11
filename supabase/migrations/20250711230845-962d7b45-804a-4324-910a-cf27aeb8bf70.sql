
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
