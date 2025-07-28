-- Fix dealer visibility issue
-- This migration updates the RLS policy to allow viewing both pending and verified dealers

-- Drop the existing policy
DROP POLICY IF EXISTS "dealers_select_verified" ON dealers;

-- Create the updated policy
CREATE POLICY "dealers_select_verified" ON dealers
  FOR SELECT 
  USING (verification_status IN ('verified', 'pending'));

-- Verify the change
SELECT 
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies 
WHERE tablename = 'dealers' AND policyname = 'dealers_select_verified'; 