
-- CarsX Database Schema Migration
-- This file contains all tables and relationships for the CarsX application

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create ENUM types first
CREATE TYPE user_type AS ENUM ('regular', 'premium', 'dealer');
CREATE TYPE gender_type AS ENUM ('Male', 'Female', 'Other');
CREATE TYPE verification_status AS ENUM ('pending', 'verified', 'rejected');
CREATE TYPE document_type AS ENUM ('gst_certificate', 'shop_license', 'shop_photo');
CREATE TYPE fuel_type AS ENUM ('Petrol', 'Diesel', 'Electric', 'Hybrid');
CREATE TYPE transmission_type AS ENUM ('Manual', 'Automatic');
CREATE TYPE insurance_type AS ENUM ('Comprehensive', 'Third Party');
CREATE TYPE service_center_type AS ENUM ('Authorized', 'Local Garage');
CREATE TYPE listing_status AS ENUM ('active', 'sold', 'inactive');
CREATE TYPE accessory_category AS ENUM (
  'alloy-wheels', 'seat-covers', 'floor-mats', 'mobile-holders', 
  'dash-cameras', 'led-lights', 'car-perfumes', 'steering-covers', 
  'infotainment', 'parking-sensors'
);
CREATE TYPE availability_status AS ENUM ('in-stock', 'order', 'out-of-stock');
CREATE TYPE chat_status AS ENUM ('active', 'blocked', 'archived');
CREATE TYPE message_type AS ENUM ('text', 'system', 'test_drive');
CREATE TYPE offer_status AS ENUM ('pending', 'accepted', 'rejected');
CREATE TYPE booking_status AS ENUM ('pending', 'approved', 'rejected', 'completed', 'cancelled');
CREATE TYPE reply_category AS ENUM ('general', 'price', 'meeting', 'documents');

-- 1. Users table
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  phone VARCHAR(20) UNIQUE NOT NULL,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(255) UNIQUE,
  city VARCHAR(100),
  gender gender_type,
  avatar TEXT,
  user_type user_type DEFAULT 'regular',
  is_verified BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Dealers table
CREATE TABLE dealers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  slug VARCHAR(100) UNIQUE NOT NULL,
  business_name VARCHAR(200) NOT NULL,
  contact_person VARCHAR(100) NOT NULL,
  business_category VARCHAR(100),
  brands_deal_with TEXT[],
  specialization VARCHAR(200),
  gst_number VARCHAR(15) UNIQUE,
  shop_address TEXT NOT NULL,
  pincode VARCHAR(10),
  establishment_year INTEGER,
  website_url VARCHAR(255),
  google_maps_link TEXT,
  opening_time TIME,
  closing_time TIME,
  is_24x7 BOOLEAN DEFAULT false,
  verification_status verification_status DEFAULT 'pending',
  total_sales INTEGER DEFAULT 0,
  member_since TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Dealer documents table
CREATE TABLE dealer_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  dealer_id UUID NOT NULL REFERENCES dealers(id) ON DELETE CASCADE,
  document_type document_type NOT NULL,
  file_url TEXT NOT NULL,
  file_name VARCHAR(255),
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. Cars table
CREATE TABLE cars (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(200),
  make VARCHAR(50) NOT NULL,
  model VARCHAR(100) NOT NULL,
  variant VARCHAR(100),
  year INTEGER NOT NULL,
  registration_year INTEGER,
  registration_state VARCHAR(50),
  fitness_certificate_valid_till DATE,
  number_of_owners INTEGER NOT NULL,
  seating_capacity INTEGER,
  fuel_type fuel_type NOT NULL,
  transmission transmission_type NOT NULL,
  kilometers_driven INTEGER NOT NULL,
  color VARCHAR(50),
  price DECIMAL(12,2) NOT NULL,
  accept_offers BOOLEAN DEFAULT true,
  offer_percentage INTEGER DEFAULT 70,
  insurance_valid_till DATE,
  insurance_type insurance_type,
  insurance_valid BOOLEAN DEFAULT false,
  last_service_date DATE,
  service_center_type service_center_type,
  service_history BOOLEAN DEFAULT false,
  authorized_service_center BOOLEAN DEFAULT false,
  rto_transfer_support BOOLEAN DEFAULT true,
  no_accident_history BOOLEAN DEFAULT false,
  is_rent_available BOOLEAN DEFAULT false,
  daily_rate DECIMAL(8,2),
  weekly_rate DECIMAL(8,2),
  security_deposit DECIMAL(10,2),
  city VARCHAR(100) NOT NULL,
  area VARCHAR(100),
  landmark VARCHAR(200),
  address TEXT,
  description TEXT,
  status listing_status DEFAULT 'active',
  verified BOOLEAN DEFAULT false,
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Car images table
CREATE TABLE car_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  is_cover BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Accessories table
CREATE TABLE accessories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(200) NOT NULL,
  category accessory_category NOT NULL,
  brand VARCHAR(100) NOT NULL,
  price_min DECIMAL(10,2) NOT NULL,
  price_max DECIMAL(10,2),
  description TEXT NOT NULL,
  condition VARCHAR(50) NOT NULL,
  compatibility TEXT[],
  warranty VARCHAR(100),
  installation_available BOOLEAN DEFAULT false,
  seller_name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  phone_verified BOOLEAN DEFAULT false,
  email VARCHAR(255),
  location VARCHAR(200) NOT NULL,
  additional_info TEXT,
  whatsapp_contact BOOLEAN DEFAULT false,
  verified_seller BOOLEAN DEFAULT false,
  availability availability_status DEFAULT 'in-stock',
  status listing_status DEFAULT 'active',
  featured BOOLEAN DEFAULT false,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 7. Accessory images table
CREATE TABLE accessory_images (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  accessory_id UUID NOT NULL REFERENCES accessories(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  sort_order INTEGER DEFAULT 0,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Chats table
CREATE TABLE chats (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID REFERENCES cars(id) ON DELETE CASCADE,
  accessory_id UUID REFERENCES accessories(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  last_message_id UUID,
  unread_count INTEGER DEFAULT 0,
  status chat_status DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT chats_item_check CHECK (
    (car_id IS NOT NULL AND accessory_id IS NULL) OR 
    (car_id IS NULL AND accessory_id IS NOT NULL)
  )
);

-- 9. Chat messages table
CREATE TABLE chat_messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  message_type message_type DEFAULT 'text',
  seen BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 10. Offers table
CREATE TABLE offers (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  buyer_name VARCHAR(100) NOT NULL,
  buyer_phone VARCHAR(20) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  message TEXT,
  status offer_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 11. Test drive bookings table
CREATE TABLE test_drive_bookings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  car_id UUID NOT NULL REFERENCES cars(id) ON DELETE CASCADE,
  buyer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  seller_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
  scheduled_date DATE NOT NULL,
  time_slot VARCHAR(20) NOT NULL,
  buyer_name VARCHAR(100) NOT NULL,
  buyer_phone VARCHAR(20) NOT NULL,
  alternate_phone VARCHAR(20),
  special_requests TEXT,
  status booking_status DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 12. Quick replies table
CREATE TABLE quick_replies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  text TEXT NOT NULL,
  category reply_category NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 13. User listings count table
CREATE TABLE user_listings_count (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  active_car_listings INTEGER DEFAULT 0,
  active_accessory_listings INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add foreign key constraint for chats.last_message_id (after chat_messages table exists)
ALTER TABLE chats ADD CONSTRAINT fk_chats_last_message 
  FOREIGN KEY (last_message_id) REFERENCES chat_messages(id) ON DELETE SET NULL;

-- Create indexes for performance
CREATE INDEX idx_users_phone ON users(phone);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_dealers_user_id ON dealers(user_id);
CREATE INDEX idx_dealers_slug ON dealers(slug);
CREATE INDEX idx_dealers_verification_status ON dealers(verification_status);
CREATE INDEX idx_cars_seller_id ON cars(seller_id);
CREATE INDEX idx_cars_make_model ON cars(make, model);
CREATE INDEX idx_cars_city ON cars(city);
CREATE INDEX idx_cars_status ON cars(status);
CREATE INDEX idx_cars_price ON cars(price);
CREATE INDEX idx_cars_year ON cars(year);
CREATE INDEX idx_cars_fuel_type ON cars(fuel_type);
CREATE INDEX idx_cars_created_at ON cars(created_at);
CREATE INDEX idx_car_images_car_id ON car_images(car_id);
CREATE INDEX idx_accessories_seller_id ON accessories(seller_id);
CREATE INDEX idx_accessories_category ON accessories(category);
CREATE INDEX idx_accessories_location ON accessories(location);
CREATE INDEX idx_accessories_status ON accessories(status);
CREATE INDEX idx_accessories_created_at ON accessories(created_at);
CREATE INDEX idx_accessory_images_accessory_id ON accessory_images(accessory_id);
CREATE INDEX idx_chats_buyer_id ON chats(buyer_id);
CREATE INDEX idx_chats_seller_id ON chats(seller_id);
CREATE INDEX idx_chats_car_id ON chats(car_id);
CREATE INDEX idx_chats_accessory_id ON chats(accessory_id);
CREATE INDEX idx_chat_messages_chat_id ON chat_messages(chat_id);
CREATE INDEX idx_chat_messages_created_at ON chat_messages(created_at);
CREATE INDEX idx_offers_car_id ON offers(car_id);
CREATE INDEX idx_offers_buyer_id ON offers(buyer_id);
CREATE INDEX idx_offers_seller_id ON offers(seller_id);
CREATE INDEX idx_test_drive_bookings_car_id ON test_drive_bookings(car_id);
CREATE INDEX idx_quick_replies_user_id ON quick_replies(user_id);
CREATE INDEX idx_user_listings_count_user_id ON user_listings_count(user_id);

-- Create functions for updated_at timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_dealers_updated_at BEFORE UPDATE ON dealers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_cars_updated_at BEFORE UPDATE ON cars 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_accessories_updated_at BEFORE UPDATE ON accessories 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chats_updated_at BEFORE UPDATE ON chats 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_offers_updated_at BEFORE UPDATE ON offers 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_listings_count_updated_at BEFORE UPDATE ON user_listings_count 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Insert some default quick replies
INSERT INTO quick_replies (id, user_id, text, category) VALUES
  (uuid_generate_v4(), uuid_generate_v4(), 'Hi! I''m interested in your car. Is it still available?', 'general'),
  (uuid_generate_v4(), uuid_generate_v4(), 'What''s your best price for this?', 'price'),
  (uuid_generate_v4(), uuid_generate_v4(), 'Can we schedule a test drive?', 'meeting'),
  (uuid_generate_v4(), uuid_generate_v4(), 'Are all documents clear?', 'documents');

-- Comments for documentation
COMMENT ON TABLE users IS 'Main users table storing all user types';
COMMENT ON TABLE dealers IS 'Dealer-specific information and verification status';
COMMENT ON TABLE cars IS 'Car listings with comprehensive details';
COMMENT ON TABLE accessories IS 'Accessory listings with seller information';
COMMENT ON TABLE chats IS 'Chat conversations between buyers and sellers';
COMMENT ON TABLE offers IS 'Price offers made by buyers on cars';
COMMENT ON TABLE test_drive_bookings IS 'Test drive appointment bookings';
