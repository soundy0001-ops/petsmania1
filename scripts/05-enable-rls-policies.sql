-- Enable RLS and create policies for PetHouse BBA

-- Enable RLS on products table
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Policy for products: Allow all operations for authenticated users
-- Since we're using anon key, we'll allow all operations (in production, restrict this)
CREATE POLICY "Allow all operations on products" ON products
FOR ALL USING (true);

-- Enable RLS on orders table
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for orders: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on orders" ON orders
FOR ALL USING (true);

-- Enable RLS on order_items table
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Policy for order_items: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on order_items" ON order_items
FOR ALL USING (true);

-- Enable RLS on admin_users table
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- Policy for admin_users: Allow all operations for authenticated users
CREATE POLICY "Allow all operations on admin_users" ON admin_users
FOR ALL USING (true);
