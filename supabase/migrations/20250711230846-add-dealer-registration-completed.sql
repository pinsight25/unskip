-- Add dealer_registration_completed column to users table
ALTER TABLE users ADD COLUMN dealer_registration_completed BOOLEAN DEFAULT false;

-- Update existing dealer users to have dealer_registration_completed = true
-- This assumes that existing dealers have already completed registration
UPDATE users 
SET dealer_registration_completed = true 
WHERE user_type = 'dealer' 
AND id IN (SELECT user_id FROM dealers);

-- Create index for better query performance
CREATE INDEX idx_users_dealer_registration_completed ON users(dealer_registration_completed); 