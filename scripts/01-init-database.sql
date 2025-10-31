-- Create tables for PetHouse BBA

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en VARCHAR(255) NOT NULL,
  name_fr VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255) NOT NULL,
  description_en TEXT,
  description_fr TEXT,
  description_ar TEXT,
  category VARCHAR(50) NOT NULL, -- cats, dogs, birds, other
  price DECIMAL(10, 2) NOT NULL,
  image_url VARCHAR(500),
  brand VARCHAR(100),
  stock_quantity INT DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name VARCHAR(255) NOT NULL,
  customer_email VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(20),
  customer_address TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, confirmed, shipped, delivered
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Coupons table
CREATE TABLE IF NOT EXISTS coupons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,
  discount_percent INT,
  discount_amount DECIMAL(10, 2),
  max_uses INT,
  current_uses INT DEFAULT 0,
  expiry_date TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Admin users table
CREATE TABLE IF NOT EXISTS admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_featured ON products(is_featured);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_email ON orders(customer_email);
CREATE INDEX idx_coupons_code ON coupons(code);
