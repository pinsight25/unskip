-- Add triggers to automatically create notifications

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

-- Trigger for new offers
CREATE TRIGGER trigger_offer_notification
    AFTER INSERT ON offers
    FOR EACH ROW
    EXECUTE FUNCTION create_offer_notification();

-- Function to create notification for new cars (for followers/subscribers)
CREATE OR REPLACE FUNCTION create_car_listing_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- For now, create a system notification for new cars
    -- In the future, this could notify followers or users with similar preferences
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

-- Trigger for new car listings
CREATE TRIGGER trigger_car_listing_notification
    AFTER INSERT ON cars
    FOR EACH ROW
    EXECUTE FUNCTION create_car_listing_notification();

-- Function to create notification for new chat messages
CREATE OR REPLACE FUNCTION create_chat_notification()
RETURNS TRIGGER AS $$
BEGIN
    -- Get the other user in the chat
    DECLARE
        other_user_id UUID;
        car_title TEXT;
    BEGIN
        -- Determine the other user in the chat
        IF NEW.sender_id = (SELECT buyer_id FROM chats WHERE id = NEW.chat_id) THEN
            other_user_id := (SELECT seller_id FROM chats WHERE id = NEW.chat_id);
        ELSE
            other_user_id := (SELECT buyer_id FROM chats WHERE id = NEW.chat_id);
        END IF;
        
        -- Get car title for context
        SELECT CONCAT(year, ' ', make, ' ', model) as title
        INTO car_title
        FROM cars c
        JOIN chats ch ON c.id = ch.car_id
        WHERE ch.id = NEW.chat_id;
        
        -- Create notification for the other user
        INSERT INTO notifications (
            user_id,
            type,
            title,
            message,
            related_id,
            action_url,
            priority
        ) VALUES (
            other_user_id,
            'chat',
            'New Message',
            CONCAT('New message about ', car_title),
            NEW.chat_id,
            CONCAT('/chat/', NEW.chat_id),
            'medium'
        );
        
        RETURN NEW;
    END;
END;
$$ LANGUAGE plpgsql;

-- Trigger for new chat messages
CREATE TRIGGER trigger_chat_notification
    AFTER INSERT ON messages
    FOR EACH ROW
    EXECUTE FUNCTION create_chat_notification();

-- Function to create system notifications for important events
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
