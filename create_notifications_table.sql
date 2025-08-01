-- Create notifications table with proper constraints
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID NOT NULL DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    related_id UUID NULL,
    action_url TEXT NULL,
    priority TEXT NOT NULL DEFAULT 'medium'::text,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NULL DEFAULT now(),
    CONSTRAINT notifications_pkey PRIMARY KEY (id),
    CONSTRAINT notifications_user_id_fkey FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT notifications_priority_check CHECK (
        (priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))
    ),
    CONSTRAINT notifications_type_check CHECK (
        (type = ANY (
            ARRAY[
                'offer'::text,
                'chat'::text,
                'listing'::text,
                'system'::text,
                'test_drive'::text
            ]
        ))
    )
) TABLESPACE pg_default;

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications USING btree (user_id) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_notifications_user_id_is_read ON public.notifications USING btree (user_id, is_read) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON public.notifications USING btree (created_at DESC) TABLESPACE pg_default;
CREATE INDEX IF NOT EXISTS idx_notifications_type ON public.notifications USING btree (type) TABLESPACE pg_default;

-- Enable Row Level Security
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications" ON public.notifications
    FOR DELETE USING (auth.uid() = user_id);

-- Allow system to create notifications for users
CREATE POLICY "System can create notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_notifications_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_notifications_updated_at
    BEFORE UPDATE ON notifications
    FOR EACH ROW
    EXECUTE FUNCTION update_notifications_updated_at();

-- Add comments
COMMENT ON TABLE public.notifications IS 'Stores user notifications for various app events';
COMMENT ON COLUMN public.notifications.type IS 'Type of notification: offer, chat, listing, system, test_drive';
COMMENT ON COLUMN public.notifications.priority IS 'Priority level: low, medium, high';
COMMENT ON COLUMN public.notifications.related_id IS 'Related entity ID (car_id, chat_id, etc.)';
COMMENT ON COLUMN public.notifications.action_url IS 'URL to navigate to when notification is clicked'; 