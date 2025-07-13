-- Check car's badge status
SELECT id, title, featured, verified, status
FROM cars 
WHERE id = '484941a6-c49a-41d5-ad65-5bcadd04be78';

-- Check all cars with their badge status
SELECT id, title, featured, verified, status, created_at
FROM cars 
ORDER BY created_at DESC
LIMIT 10;

-- Update specific car to be featured and verified
UPDATE cars 
SET featured = true, verified = true 
WHERE id = '484941a6-c49a-41d5-ad65-5bcadd04be78';

-- Update all active cars to be verified (for testing)
UPDATE cars 
SET verified = true 
WHERE status = 'active';

-- Update some cars to be featured (for testing)
UPDATE cars 
SET featured = true 
WHERE id IN (
  SELECT id FROM cars 
  WHERE status = 'active' 
  ORDER BY created_at DESC 
  LIMIT 5
);

-- Check users table for verification status
SELECT id, name, is_verified, created_at
FROM users
ORDER BY created_at DESC
LIMIT 10;

-- Update users to be verified (for testing)
UPDATE users 
SET is_verified = true 
WHERE is_verified IS NULL OR is_verified = false; 