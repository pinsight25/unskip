-- Check dealer statuses in the database
-- Run this in your Supabase SQL editor to see what dealers exist and their verification status

SELECT 
  id,
  slug,
  business_name,
  verification_status,
  created_at,
  updated_at
FROM dealers
ORDER BY created_at DESC;

-- Check if there are any dealers at all
SELECT 
  COUNT(*) as total_dealers,
  COUNT(CASE WHEN verification_status = 'verified' THEN 1 END) as verified_dealers,
  COUNT(CASE WHEN verification_status = 'pending' THEN 1 END) as pending_dealers,
  COUNT(CASE WHEN verification_status = 'rejected' THEN 1 END) as rejected_dealers
FROM dealers;

-- Check specific dealer by slug
SELECT 
  id,
  slug,
  business_name,
  verification_status,
  user_id,
  created_at
FROM dealers 
WHERE slug = 'smart-cars'; 