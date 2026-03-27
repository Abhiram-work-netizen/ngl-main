-- users table
CREATE TABLE public.users (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  profile_pic text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Turn on Row Level Security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Allow public read access to users (so we can see their profile by username)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.users FOR SELECT
  USING ( true );

-- Allow users to update their own profiles
CREATE POLICY "Users can insert their own profile."
  ON public.users FOR INSERT
  WITH CHECK ( auth.uid() = id );

CREATE POLICY "Users can update own profile."
  ON public.users FOR UPDATE
  USING ( auth.uid() = id );

-- messages table
CREATE TABLE public.messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  receiver_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  sender_id uuid REFERENCES public.users(id) ON DELETE SET NULL, -- sender is optional (anonymous)
  message text NOT NULL,
  revealed boolean DEFAULT false NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to anonymously insert a message
CREATE POLICY "Anyone can send a message."
  ON public.messages FOR INSERT
  WITH CHECK ( true );

-- Only receivers can view their own messages
CREATE POLICY "Users can view their own messages."
  ON public.messages FOR SELECT
  USING ( auth.uid() = receiver_id );

-- Only receivers can update their own messages (e.g. to reveal)
CREATE POLICY "Users can update their own messages."
  ON public.messages FOR UPDATE
  USING ( auth.uid() = receiver_id );

-- views table
CREATE TABLE public.views (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.users(id) ON DELETE CASCADE NOT NULL,
  viewer_ip text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE public.views ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert a view
CREATE POLICY "Anyone can view."
  ON public.views FOR INSERT
  WITH CHECK ( true );

-- Users can select view count for their profile (or compute it)
CREATE POLICY "Users can read views for their profile."
  ON public.views FOR SELECT
  USING ( auth.uid() = user_id );

-- Function to handle new user signups and automatically create a row in public.users
CREATE OR REPLACE FUNCTION public.handle_new_user() 
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.users (id, username, email, profile_pic)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(md5(random()::text), 1, 5)),
    new.email,
    new.raw_user_meta_data->>'avatar_url'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to automatically call handle_new_user() when an auth user is created
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
