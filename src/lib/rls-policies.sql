
-- Row Level Security (RLS) Policies for CarsX Database
-- This file contains all RLS policies to secure data access

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealers ENABLE ROW LEVEL SECURITY;
ALTER TABLE dealer_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE cars ENABLE ROW LEVEL SECURITY;
ALTER TABLE car_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessories ENABLE ROW LEVEL SECURITY;
ALTER TABLE accessory_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE chats ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE offers ENABLE ROW LEVEL SECURITY;
ALTER TABLE test_drive_bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE quick_replies ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_listings_count ENABLE ROW LEVEL SECURITY;

-- 1. USERS TABLE POLICIES
-- Users can read their own profile
CREATE POLICY "users_select_own" ON users
  FOR SELECT 
  USING (auth.uid() = id);

-- Users can update their own profile
CREATE POLICY "users_update_own" ON users
  FOR UPDATE 
  USING (auth.uid() = id);

-- Users can insert their own profile (signup)
CREATE POLICY "users_insert_own" ON users
  FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Anyone can check if phone exists (for signup validation)
CREATE POLICY "users_check_phone" ON users
  FOR SELECT 
  USING (true);

-- 2. DEALERS TABLE POLICIES
-- Anyone can view verified and pending dealers
CREATE POLICY "dealers_select_verified" ON dealers
  FOR SELECT 
  USING (verification_status IN ('verified', 'pending'));

-- Dealer owners can view their own profile (including pending)
CREATE POLICY "dealers_select_own" ON dealers
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Dealer owners can update their own profile
CREATE POLICY "dealers_update_own" ON dealers
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Dealer owners can insert their own profile
CREATE POLICY "dealers_insert_own" ON dealers
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- 3. DEALER DOCUMENTS POLICIES
-- Only dealer owners can view their documents
CREATE POLICY "dealer_documents_select_own" ON dealer_documents
  FOR SELECT 
  USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Only dealer owners can insert their documents
CREATE POLICY "dealer_documents_insert_own" ON dealer_documents
  FOR INSERT 
  WITH CHECK (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Only dealer owners can update their documents
CREATE POLICY "dealer_documents_update_own" ON dealer_documents
  FOR UPDATE 
  USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- Only dealer owners can delete their documents
CREATE POLICY "dealer_documents_delete_own" ON dealer_documents
  FOR DELETE 
  USING (auth.uid() IN (SELECT user_id FROM dealers WHERE id = dealer_id));

-- 4. CARS TABLE POLICIES
-- Anyone can view active car listings
CREATE POLICY "cars_select_active" ON cars
  FOR SELECT 
  USING (status = 'active');

-- Sellers can view all their own listings
CREATE POLICY "cars_select_own" ON cars
  FOR SELECT 
  USING (auth.uid() = seller_id);

-- Only sellers can insert their own listings
CREATE POLICY "cars_insert_own" ON cars
  FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);

-- Only sellers can update their own listings
CREATE POLICY "cars_update_own" ON cars
  FOR UPDATE 
  USING (auth.uid() = seller_id);

-- Only sellers can delete their own listings
CREATE POLICY "cars_delete_own" ON cars
  FOR DELETE 
  USING (auth.uid() = seller_id);

-- 5. CAR IMAGES POLICIES
-- Anyone can view images of active cars
CREATE POLICY "car_images_select_active" ON car_images
  FOR SELECT 
  USING (car_id IN (SELECT id FROM cars WHERE status = 'active'));

-- Car owners can view all their car images
CREATE POLICY "car_images_select_own" ON car_images
  FOR SELECT 
  USING (car_id IN (SELECT id FROM cars WHERE seller_id = auth.uid()));

-- Only car owners can insert images
CREATE POLICY "car_images_insert_own" ON car_images
  FOR INSERT 
  WITH CHECK (car_id IN (SELECT id FROM cars WHERE seller_id = auth.uid()));

-- Only car owners can update images
CREATE POLICY "car_images_update_own" ON car_images
  FOR UPDATE 
  USING (car_id IN (SELECT id FROM cars WHERE seller_id = auth.uid()));

-- Only car owners can delete images
CREATE POLICY "car_images_delete_own" ON car_images
  FOR DELETE 
  USING (car_id IN (SELECT id FROM cars WHERE seller_id = auth.uid()));

-- 6. ACCESSORIES TABLE POLICIES
-- Anyone can view active accessory listings
CREATE POLICY "accessories_select_active" ON accessories
  FOR SELECT 
  USING (status = 'active');

-- Sellers can view all their own listings
CREATE POLICY "accessories_select_own" ON accessories
  FOR SELECT 
  USING (auth.uid() = seller_id);

-- Only sellers can insert their own listings
CREATE POLICY "accessories_insert_own" ON accessories
  FOR INSERT 
  WITH CHECK (auth.uid() = seller_id);

-- Only sellers can update their own listings
CREATE POLICY "accessories_update_own" ON accessories
  FOR UPDATE 
  USING (auth.uid() = seller_id);

-- Only sellers can delete their own listings
CREATE POLICY "accessories_delete_own" ON accessories
  FOR DELETE 
  USING (auth.uid() = seller_id);

-- 7. ACCESSORY IMAGES POLICIES
-- Anyone can view images of active accessories
CREATE POLICY "accessory_images_select_active" ON accessory_images
  FOR SELECT 
  USING (accessory_id IN (SELECT id FROM accessories WHERE status = 'active'));

-- Accessory owners can view all their images
CREATE POLICY "accessory_images_select_own" ON accessory_images
  FOR SELECT 
  USING (accessory_id IN (SELECT id FROM accessories WHERE seller_id = auth.uid()));

-- Only accessory owners can insert images
CREATE POLICY "accessory_images_insert_own" ON accessory_images
  FOR INSERT 
  WITH CHECK (accessory_id IN (SELECT id FROM accessories WHERE seller_id = auth.uid()));

-- Only accessory owners can update images
CREATE POLICY "accessory_images_update_own" ON accessory_images
  FOR UPDATE 
  USING (accessory_id IN (SELECT id FROM accessories WHERE seller_id = auth.uid()));

-- Only accessory owners can delete images
CREATE POLICY "accessory_images_delete_own" ON accessory_images
  FOR DELETE 
  USING (accessory_id IN (SELECT id FROM accessories WHERE seller_id = auth.uid()));

-- 8. CHATS TABLE POLICIES
-- Only participants (buyer or seller) can view their chats
CREATE POLICY "chats_select_participants" ON chats
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Only participants can update chat status
CREATE POLICY "chats_update_participants" ON chats
  FOR UPDATE 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Only buyers can create new chats
CREATE POLICY "chats_insert_buyer" ON chats
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

-- 9. CHAT MESSAGES POLICIES
-- Only participants can view messages
CREATE POLICY "chat_messages_select_participants" ON chat_messages
  FOR SELECT 
  USING (
    chat_id IN (
      SELECT id FROM chats 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

-- Only participants can send messages
CREATE POLICY "chat_messages_insert_participants" ON chat_messages
  FOR INSERT 
  WITH CHECK (
    auth.uid() = sender_id AND
    chat_id IN (
      SELECT id FROM chats 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

-- Only participants can update message status (mark as seen)
CREATE POLICY "chat_messages_update_participants" ON chat_messages
  FOR UPDATE 
  USING (
    chat_id IN (
      SELECT id FROM chats 
      WHERE buyer_id = auth.uid() OR seller_id = auth.uid()
    )
  );

-- 10. OFFERS TABLE POLICIES
-- Only buyer and seller can view offers
CREATE POLICY "offers_select_participants" ON offers
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Only buyers can create offers
CREATE POLICY "offers_insert_buyer" ON offers
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

-- Only sellers can update offer status (accept/reject)
CREATE POLICY "offers_update_seller" ON offers
  FOR UPDATE 
  USING (auth.uid() = seller_id);

-- 11. TEST DRIVE BOOKINGS POLICIES
-- Only participants can view bookings
CREATE POLICY "test_drive_bookings_select_participants" ON test_drive_bookings
  FOR SELECT 
  USING (auth.uid() = buyer_id OR auth.uid() = seller_id);

-- Only buyers can create bookings
CREATE POLICY "test_drive_bookings_insert_buyer" ON test_drive_bookings
  FOR INSERT 
  WITH CHECK (auth.uid() = buyer_id);

-- Only sellers can update booking status
CREATE POLICY "test_drive_bookings_update_seller" ON test_drive_bookings
  FOR UPDATE 
  USING (auth.uid() = seller_id);

-- 12. QUICK REPLIES POLICIES
-- Users can only view their own quick replies
CREATE POLICY "quick_replies_select_own" ON quick_replies
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only insert their own quick replies
CREATE POLICY "quick_replies_insert_own" ON quick_replies
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own quick replies
CREATE POLICY "quick_replies_update_own" ON quick_replies
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- Users can only delete their own quick replies
CREATE POLICY "quick_replies_delete_own" ON quick_replies
  FOR DELETE 
  USING (auth.uid() = user_id);

-- 13. USER LISTINGS COUNT POLICIES
-- Users can only view their own listing counts
CREATE POLICY "user_listings_count_select_own" ON user_listings_count
  FOR SELECT 
  USING (auth.uid() = user_id);

-- Users can only update their own listing counts
CREATE POLICY "user_listings_count_update_own" ON user_listings_count
  FOR UPDATE 
  USING (auth.uid() = user_id);

-- System can insert listing counts for users
CREATE POLICY "user_listings_count_insert_own" ON user_listings_count
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

-- Comments for documentation
COMMENT ON POLICY "users_select_own" ON users IS 'Users can read their own profile';
COMMENT ON POLICY "users_check_phone" ON users IS 'Anyone can check if phone exists for signup';
COMMENT ON POLICY "cars_select_active" ON cars IS 'Anyone can view active car listings';
COMMENT ON POLICY "chats_select_participants" ON chats IS 'Only chat participants can view conversations';
COMMENT ON POLICY "offers_insert_buyer" ON offers IS 'Only buyers can create price offers';

-- Note: These policies assume Supabase Auth is configured with UUID-based user IDs
-- The auth.uid() function returns the authenticated user's UUID
