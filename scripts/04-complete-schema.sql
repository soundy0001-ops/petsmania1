-- Complete Database Schema for PetHouse BBA v2
-- Drop existing tables if they exist
DROP TABLE IF EXISTS order_items CASCADE;
DROP TABLE IF EXISTS orders CASCADE;
DROP TABLE IF EXISTS products CASCADE;
DROP TABLE IF EXISTS admin_users CASCADE;

-- Admin Users Table
CREATE TABLE admin_users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products Table with all required fields
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  promo_price DECIMAL(10, 2),
  reduction INT DEFAULT 0, -- Percentage reduction
  image_url TEXT,
  images TEXT[] DEFAULT ARRAY[]::TEXT[], -- Array of additional images
  animal TEXT NOT NULL, -- 'chat', 'chien', 'oiseau', 'autre'
  type TEXT NOT NULL, -- 'accessoires', 'alimentaire', 'soin'
  subtype TEXT, -- 'croquettes', 'jouets', 'collier', etc.
  marque TEXT, -- Brand name
  stock INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status TEXT DEFAULT 'pending', -- 'pending', 'confirmed', 'shipped', 'delivered'
  created_at TIMESTAMP DEFAULT NOW()
);

-- Order Items Table
CREATE TABLE order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id),
  quantity INT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_products_animal ON products(animal);
CREATE INDEX idx_products_type ON products(type);
CREATE INDEX idx_products_marque ON products(marque);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_created_at ON orders(created_at);

-- Insert sample admin user (password: admin123)
INSERT INTO admin_users (password_hash) 
VALUES ('$2a$10$YourHashedPasswordHere');
