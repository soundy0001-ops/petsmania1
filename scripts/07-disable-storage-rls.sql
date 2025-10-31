-- Disable RLS on storage.objects for the products bucket
-- This allows file uploads to the products bucket

ALTER TABLE storage.objects DISABLE ROW LEVEL SECURITY;

-- Alternative: Create a policy for the products bucket
-- INSERT INTO storage.buckets (id, name, public) VALUES ('products', 'products', true);
-- CREATE POLICY "Allow all operations on products bucket" ON storage.objects FOR ALL USING (bucket_id = 'products');
