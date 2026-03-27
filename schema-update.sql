-- Run this in your Supabase SQL Editor to remove strict Auth integration and allow dummy accounts to be created:

-- 1. Remove the strict foreign key enforcing users to exist in the hidden auth.users table
ALTER TABLE public.users DROP CONSTRAINT IF EXISTS users_id_fkey;

-- 2. Allow the public.users table to generate its own IDs for new dummy users
ALTER TABLE public.users ALTER COLUMN id SET DEFAULT gen_random_uuid();

-- 3. Disable Row Level Security since we are using dummy cookie auth rather than secure JWTs
ALTER TABLE public.users DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.views DISABLE ROW LEVEL SECURITY;

-- 4. Clean up the old triggers that are no longer needed
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
DROP FUNCTION IF EXISTS public.handle_new_user();
