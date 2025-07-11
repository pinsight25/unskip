
-- Create car_makes table
CREATE TABLE public.car_makes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create car_models table
CREATE TABLE public.car_models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  make_id UUID NOT NULL REFERENCES car_makes(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(make_id, name)
);

-- Create cities table
CREATE TABLE public.cities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL UNIQUE,
  state VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on reference tables (read-only for all users)
ALTER TABLE public.car_makes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.car_models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cities ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Anyone can view active car makes" 
  ON public.car_makes 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anyone can view active car models" 
  ON public.car_models 
  FOR SELECT 
  USING (is_active = true);

CREATE POLICY "Anyone can view active cities" 
  ON public.cities 
  FOR SELECT 
  USING (is_active = true);

-- Insert car makes data
INSERT INTO public.car_makes (name, sort_order) VALUES
('Maruti Suzuki', 1),
('Hyundai', 2),
('Tata', 3),
('Mahindra', 4),
('Honda', 5),
('Toyota', 6),
('Kia', 7),
('Ford', 8),
('Volkswagen', 9),
('Renault', 10),
('Nissan', 11),
('Chevrolet', 12),
('Skoda', 13),
('MG', 14),
('Jeep', 15);

-- Insert Maruti Suzuki models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Swift', 1), 
  ('Baleno', 2),
  ('Dzire', 3),
  ('Vitara Brezza', 4),
  ('Ertiga', 5),
  ('Wagon R', 6),
  ('Alto', 7),
  ('Celerio', 8),
  ('Ciaz', 9),
  ('S-Cross', 10),
  ('XL6', 11),
  ('Ignis', 12),
  ('Alto K10', 13),
  ('S-Presso', 14),
  ('Eeco', 15)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Maruti Suzuki';

-- Insert Hyundai models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('i20', 1),
  ('Creta', 2),
  ('Verna', 3),
  ('Venue', 4),
  ('Grand i10 NIOS', 5),
  ('Santro', 6),
  ('Elantra', 7),
  ('Tucson', 8),
  ('Kona Electric', 9),
  ('Alcazar', 10),
  ('i10', 11)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Hyundai';

-- Insert Tata models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Nexon', 1),
  ('Harrier', 2),
  ('Safari', 3),
  ('Altroz', 4),
  ('Tiago', 5),
  ('Tigor', 6),
  ('Punch', 7),
  ('Hexa', 8),
  ('Zest', 9),
  ('Bolt', 10),
  ('Nano', 11)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Tata';

-- Insert Mahindra models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('XUV700', 1),
  ('XUV300', 2),
  ('Scorpio', 3),
  ('Thar', 4),
  ('Bolero', 5),
  ('KUV100', 6),
  ('Marazzo', 7),
  ('XUV500', 8),
  ('Scorpio-N', 9),
  ('XUV400', 10)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Mahindra';

-- Insert Honda models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('City', 1),
  ('Amaze', 2),
  ('Jazz', 3),
  ('WR-V', 4),
  ('CR-V', 5),
  ('Civic', 6),
  ('BR-V', 7),
  ('Brio', 8)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Honda';

-- Insert Toyota models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Innova Crysta', 1),
  ('Fortuner', 2),
  ('Glanza', 3),
  ('Urban Cruiser', 4),
  ('Camry', 5),
  ('Yaris', 6),
  ('Etios', 7),
  ('Corolla Altis', 8)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Toyota';

-- Insert Kia models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Seltos', 1),
  ('Sonet', 2),
  ('Carnival', 3),
  ('Carens', 4)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Kia';

-- Insert Ford models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('EcoSport', 1),
  ('Endeavour', 2),
  ('Figo', 3),
  ('Freestyle', 4),
  ('Aspire', 5),
  ('Mustang', 6)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Ford';

-- Insert Volkswagen models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Polo', 1),
  ('Vento', 2),
  ('Tiguan', 3),
  ('T-Roc', 4),
  ('Passat', 5),
  ('Jetta', 6)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Volkswagen';

-- Insert Renault models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Kwid', 1),
  ('Duster', 2),
  ('Captur', 3)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Renault';

-- Insert Nissan models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Magnite', 1),
  ('Kicks', 2),
  ('Terrano', 3)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Nissan';

-- Insert Chevrolet models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Beat', 1),
  ('Cruze', 2),
  ('Trailblazer', 3)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Chevrolet';

-- Insert Skoda models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Rapid', 1),
  ('Octavia', 2),
  ('Superb', 3),
  ('Kushaq', 4)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Skoda';

-- Insert MG models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Hector', 1),
  ('ZS EV', 2),
  ('Gloster', 3),
  ('Astor', 4)
) AS models(model_name, model_order)
WHERE car_makes.name = 'MG';

-- Insert Jeep models
INSERT INTO public.car_models (make_id, name, sort_order)
SELECT id, model_name, model_order
FROM car_makes, 
LATERAL (VALUES 
  ('Compass', 1),
  ('Wrangler', 2),
  ('Meridian', 3)
) AS models(model_name, model_order)
WHERE car_makes.name = 'Jeep';

-- Insert cities data
INSERT INTO public.cities (name, state, sort_order) VALUES
('Chennai', 'Tamil Nadu', 1),
('Mumbai', 'Maharashtra', 2),
('Delhi', 'Delhi', 3),
('Bangalore', 'Karnataka', 4),
('Hyderabad', 'Telangana', 5),
('Pune', 'Maharashtra', 6),
('Kolkata', 'West Bengal', 7),
('Ahmedabad', 'Gujarat', 8),
('Jaipur', 'Rajasthan', 9),
('Lucknow', 'Uttar Pradesh', 10),
('Surat', 'Gujarat', 11),
('Kanpur', 'Uttar Pradesh', 12),
('Nagpur', 'Maharashtra', 13),
('Indore', 'Madhya Pradesh', 14),
('Thane', 'Maharashtra', 15),
('Bhopal', 'Madhya Pradesh', 16),
('Visakhapatnam', 'Andhra Pradesh', 17),
('Vadodara', 'Gujarat', 18),
('Firozabad', 'Uttar Pradesh', 19),
('Ludhiana', 'Punjab', 20),
('Rajkot', 'Gujarat', 21),
('Agra', 'Uttar Pradesh', 22),
('Siliguri', 'West Bengal', 23),
('Nashik', 'Maharashtra', 24),
('Faridabad', 'Haryana', 25),
('Patiala', 'Punjab', 26),
('Ghaziabad', 'Uttar Pradesh', 27),
('Kalyan', 'Maharashtra', 28),
('Dombivli', 'Maharashtra', 29),
('Howrah', 'West Bengal', 30);

-- Create indexes for better performance
CREATE INDEX idx_car_models_make_id ON car_models(make_id);
CREATE INDEX idx_car_makes_name ON car_makes(name);
CREATE INDEX idx_car_models_name ON car_models(name);
CREATE INDEX idx_cities_name ON cities(name);

-- Add updated_at triggers
CREATE TRIGGER update_car_makes_updated_at 
  BEFORE UPDATE ON car_makes 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_car_models_updated_at 
  BEFORE UPDATE ON car_models 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cities_updated_at 
  BEFORE UPDATE ON cities 
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
