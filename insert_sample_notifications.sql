-- Insert sample notifications for testing
-- This script will create sample notifications for various events

-- First, let's get some user IDs to work with
DO $$
DECLARE
    sample_user_id UUID;
    sample_car_id UUID;
    sample_chat_id UUID;
BEGIN
    -- Get a sample user (first user in the system)
    SELECT id INTO sample_user_id FROM users LIMIT 1;
    
    -- Get a sample car
    SELECT id INTO sample_car_id FROM cars LIMIT 1;
    
    -- Get a sample chat
    SELECT id INTO sample_chat_id FROM chats LIMIT 1;
    
    -- Only proceed if we have a user
    IF sample_user_id IS NOT NULL THEN
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
        -- Recent offer notification
        (
            sample_user_id,
            'offer',
            'New Offer Received',
            'You received a ₹450,000 offer for your 2020 Honda City',
            sample_car_id,
            '/car/' || sample_car_id,
            'high',
            false,
            NOW() - INTERVAL '2 hours'
        ),
        -- Chat notification
        (
            sample_user_id,
            'chat',
            'New Message',
            'New message about 2020 Honda City',
            sample_chat_id,
            '/chat/' || sample_chat_id,
            'medium',
            false,
            NOW() - INTERVAL '4 hours'
        ),
        -- Car listing notification
        (
            sample_user_id,
            'listing',
            'Car Listed Successfully',
            'Your 2020 Honda City has been listed successfully',
            sample_car_id,
            '/car/' || sample_car_id,
            'medium',
            true,
            NOW() - INTERVAL '1 day'
        ),
        -- System notification
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
        -- Test drive notification
        (
            sample_user_id,
            'test_drive',
            'Test Drive Request',
            'Someone requested a test drive for your 2020 Honda City',
            sample_car_id,
            '/car/' || sample_car_id,
            'high',
            false,
            NOW() - INTERVAL '6 hours'
        ),
        -- Another offer notification (read)
        (
            sample_user_id,
            'offer',
            'Offer Received',
            'You received a ₹420,000 offer for your 2020 Honda City',
            sample_car_id,
            '/car/' || sample_car_id,
            'medium',
            true,
            NOW() - INTERVAL '1 day'
        ),
        -- Chat notification (read)
        (
            sample_user_id,
            'chat',
            'Message Received',
            'New message about 2020 Honda City',
            sample_chat_id,
            '/chat/' || sample_chat_id,
            'medium',
            true,
            NOW() - INTERVAL '2 days'
        );
        
        RAISE NOTICE 'Sample notifications inserted for user: %', sample_user_id;
    ELSE
        RAISE NOTICE 'No users found in the system. Please create a user first.';
    END IF;
END $$;
