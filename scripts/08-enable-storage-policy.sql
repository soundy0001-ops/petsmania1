-- Enable storage policy for the products bucket to allow uploads

CREATE POLICY "Allow all operations on products bucket" ON storage.objects
FOR ALL USING (bucket_id = 'products');
