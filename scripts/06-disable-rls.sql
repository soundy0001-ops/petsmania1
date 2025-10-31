-- Temporarily disable RLS for testing (enable again in production with proper policies)

ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
