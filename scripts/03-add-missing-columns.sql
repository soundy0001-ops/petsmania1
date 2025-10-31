-- Add missing columns to products table if they don't exist
ALTER TABLE products
ADD COLUMN IF NOT EXISTS animal_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS product_type VARCHAR(50),
ADD COLUMN IF NOT EXISTS subcategory VARCHAR(100);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_animal_type ON products(animal_type);
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_brand ON products(brand);
