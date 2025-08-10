-- Manual Setup Script for Notifications System
-- Run this in your Supabase SQL Editor

-- 1. First, let's add the notification triggers

-- Function to create notification for new offers
CREATE OR REPLACE FUNCTION create_offer_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Get car details
    DECLARE
        car_title TEXT;
        seller_id UUID;
    BEGIN
        SELECT 
            CONCAT(year, ' ', make, ' ', model) as title,
            seller_id
        INTO car_title, seller_id
        FROM cars 
        WHERE id = NEW.car_id;
        
        -- Create notification for the car seller
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_id,
            action_url,
            priority
        ) VALUES (
            seller_id,
            'offer',
            'New Offer Received',
            CONCAT('You received a ₹', NEW.amount, ' offer for your ', car_title),
            NEW.car_id,
            CONCAT('/car/', NEW.car_id),
            'high'
        );
        
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

-- Function to create notification for new cars
CREATE OR REPLACE FUNCTION create_car_listing_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Create a system notification for new cars
    IF NEW.status = 'active' THEN
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_id,
            action_url,
            priority
        ) VALUES (
            NEW.seller_id,
            'listing',
            'Car Listed Successfully',
            CONCAT('Your ', NEW.year, ' ', NEW.make, ' ', NEW.model, ' has been listed successfully'),
            NEW.id,
            CONCAT('/car/', NEW.id),
            'medium'
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Function to create system notifications
CREATE OR REPLACE FUNCTION create_system_notification(
    target_user_id UUID,
    title TEXT,
    message TEXT,
    action_url TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        action_url,
        priority
    ) VALUES (
        target_user_id,
        'system',
        title,
        message,
        action_url,
        'medium'
    );
END;
$$ LANGUAGE plpgsql;

-- 2. Create triggers only if tables exist
DO $$
BEGIN
    -- Create offer trigger if offers table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'offers') THEN
        DROP TRIGGER IF EXISTS trigger_offer_notification ON offers;
        CREATE TRIGGER trigger_offer_notification
            AFTER INSERT ON offers
            FOR EACH ROW
            EXECUTE FUNCTION create_offer_notification();
        RAISE NOTICE 'Created offer notification trigger';
    ELSE
        RAISE NOTICE 'Offers table does not exist, skipping offer trigger';
    END IF;
    
    -- Create car listing trigger if cars table exists
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cars') THEN
        DROP TRIGGER IF EXISTS trigger_car_listing_notification ON cars;
        CREATE TRIGGER trigger_car_listing_notification
            AFTER INSERT ON cars
            FOR EACH ROW
            EXECUTE FUNCTION create_car_listing_notification();
        RAISE NOTICE 'Created car listing notification trigger';
    ELSE
        RAISE NOTICE 'Cars table does not exist, skipping car listing trigger';
    END IF;
END $$;

-- 3. Now let's insert sample notifications for testing

-- Get sample data
DO $$
DECLARE
    sample_user_id UUID;
    sample_car_id UUID;
BEGIN
    -- Get a sample user (first user in the system)
    SELECT id INTO sample_user_id FROM users LIMIT 1;
    
    -- Get a sample car (only if cars table exists)
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'cars') THEN
        SELECT id INTO sample_car_id FROM cars LIMIT 1;
    END IF;
    
    -- Only proceed if we have a user
    IF sample_user_id IS NOT NULL THEN
        -- Clear existing notifications for this user
        DELETE FROM notifications WHERE user_id = sample_user_id;
        
        -- Insert sample notifications
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_id,
            action_url,
            priority,
            is_read,
            created_at
        ) VALUES 
        -- Recent offer notification (unread)
        (
            sample_user_id,
            'offer',
            'New Offer Received',
            'You received a ₹450,000 offer for your 2020 Honda City',
            sample_car_id,
            '/car/' || COALESCE(sample_car_id::text, ''),
            'high',
            false,
            NOW() - INTERVAL '2 hours'
        ),
        -- Test drive notification (unread)
        (
            sample_user_id,
            'test_drive',
            'Test Drive Request',
            'Someone requested a test drive for your 2020 Honda City',
            sample_car_id,
            '/car/' || COALESCE(sample_car_id::text, ''),
            'high',
            false,
            NOW() - INTERVAL '6 hours'
        ),
        -- Car listing notification (read)
        (
            sample_user_id,
            'listing',
            'Car Listed Successfully',
            'Your 2020 Honda City has been listed successfully',
            sample_car_id,
            '/car/' || COALESCE(sample_car_id::text, ''),
            'medium',
            true,
            NOW() - INTERVAL '1 day'
        ),
        -- System notification (read)
        (
            sample_user_id,
            'system',
            'Welcome to Unskip!',
            'Thank you for joining our platform. Start by listing your first car!',
            NULL,
            '/sell-car',
            'medium',
            true,
            NOW() - INTERVAL '2 days'
        ),
        -- Another offer notification (read)
        (
            sample_user_id,
            'offer',
            'Offer Received',
            'You received a ₹420,000 offer for your 2020 Honda City',
            sample_car_id,
            '/car/' || COALESCE(sample_car_id::text, ''),
            'medium',
            true,
            NOW() - INTERVAL '1 day'
        );
        
        RAISE NOTICE 'Sample notifications inserted for user: %', sample_user_id;
    ELSE
        RAISE NOTICE 'No users found in the system. Please create a user first.';
    END IF;
END $$;

-- 4. Create a function to manually add notifications for testing
CREATE OR REPLACE FUNCTION add_test_notification(
    user_uuid UUID,
    notification_type TEXT,
    notification_title TEXT,
    notification_message TEXT,
    related_entity_id UUID DEFAULT NULL,
    action_url TEXT DEFAULT NULL
)
RETURNS VOID AS $$
BEGIN
    INSERT INTO notifications (
        user_id,
        type,
        title,
        message,
        related_id,
        action_url,
        priority,
        is_read
    ) VALUES (
        user_uuid,
        notification_type,
        notification_title,
        notification_message,
        related_entity_id,
        action_url,
        'medium',
        false
    );
END;
$$ LANGUAGE plpgsql;

-- 5. Show current notifications count
SELECT 
    'Current notifications in system:' as info,
    COUNT(*) as total_notifications,
    COUNT(CASE WHEN is_read = false THEN 1 END) as unread_notifications
FROM notifications;
