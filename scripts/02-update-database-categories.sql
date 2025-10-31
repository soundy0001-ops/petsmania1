-- Add subcategories and brands to products table
ALTER TABLE products ADD COLUMN IF NOT EXISTS subcategory TEXT;
ALTER TABLE products ADD COLUMN IF NOT EXISTS product_type TEXT; -- 'Accessoires', 'Alimentaire', 'Soin et Toilettage'
ALTER TABLE products ADD COLUMN IF NOT EXISTS animal_type TEXT; -- 'cats', 'dogs', 'birds', 'other'

-- Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert brands
INSERT INTO brands (name) VALUES 
  ('Biazoo'),
  ('Biozoo'),
  ('Canistar'),
  ('Catisfactions'),
  ('Friskies'),
  ('IMAC'),
  ('Men for San'),
  ('Purina'),
  ('Sanicat'),
  ('Simba'),
  ('Skudo'),
  ('Stefanplast'),
  ('Trixie'),
  ('Whiskas')
ON CONFLICT (name) DO NOTHING;

-- Create subcategories table
CREATE TABLE IF NOT EXISTS subcategories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name_en TEXT NOT NULL,
  name_fr TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  product_type TEXT NOT NULL, -- 'Accessoires', 'Alimentaire', 'Soin et Toilettage'
  animal_type TEXT NOT NULL, -- 'cats', 'dogs', 'birds', 'other'
  icon TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert subcategories for Cats
INSERT INTO subcategories (name_en, name_fr, name_ar, product_type, animal_type, icon) VALUES
  -- Accessoires
  ('Cat Tree', 'Arbre à chat', 'شجرة القطط', 'Accessoires', 'cats', '🌳'),
  ('Litter Box', 'Bac à litière', 'صندوق الفضلات', 'Accessoires', 'cats', '🚽'),
  ('Bottle', 'Biberon', 'زجاجة', 'Accessoires', 'cats', '🍼'),
  ('Transport Cage', 'Cage de transport', 'قفص النقل', 'Accessoires', 'cats', '🚗'),
  ('Collar', 'Collier', 'طوق', 'Accessoires', 'cats', '⭕'),
  ('Nail Clipper', 'Coupe ongles', 'مقص الأظافر', 'Accessoires', 'cats', '✂️'),
  ('Feeder', 'Gamelle', 'وعاء الطعام', 'Accessoires', 'cats', '🍽️'),
  ('Gloves', 'Gants', 'قفازات', 'Accessoires', 'cats', '🧤'),
  ('Harness', 'Harnais', 'حزام', 'Accessoires', 'cats', '🎀'),
  ('Toys', 'Jouets', 'ألعاب', 'Accessoires', 'cats', '🧶'),
  ('Litter', 'Litières', 'رمل الفضلات', 'Accessoires', 'cats', '🏜️'),
  ('Litter Shovel', 'Pelle à litière', 'مجرفة الفضلات', 'Accessoires', 'cats', '🔧'),
  ('Transport Bag', 'Sac transport', 'حقيبة النقل', 'Accessoires', 'cats', '👜'),
  -- Alimentaire
  ('Food Supplement', 'Complément alimentaire', 'مكمل غذائي', 'Alimentaire', 'cats', '💊'),
  ('Canned Food', 'Conserve', 'طعام معلب', 'Alimentaire', 'cats', '🥫'),
  ('Dry Food', 'Croquettes', 'طعام جاف', 'Alimentaire', 'cats', '🌾'),
  ('Treats', 'Friandises et récompenses', 'الحلويات والمكافآت', 'Alimentaire', 'cats', '🍖'),
  ('Jelly', 'Gelée', 'جيلي', 'Alimentaire', 'cats', '🍮'),
  -- Soin et Toilettage
  ('Antiparasitic', 'Antiparasitaires', 'مضادات الطفيليات', 'Soin et Toilettage', 'cats', '🛡️'),
  ('Brushes', 'Brosses et soins', 'الفرش والعناية', 'Soin et Toilettage', 'cats', '🪮'),
  ('Shampoo', 'Shampoings', 'الشامبو', 'Soin et Toilettage', 'cats', '🧴');

-- Insert subcategories for Dogs
INSERT INTO subcategories (name_en, name_fr, name_ar, product_type, animal_type, icon) VALUES
  -- Accessoires
  ('Dog Bed', 'Lit pour chien', 'سرير الكلب', 'Accessoires', 'dogs', '🛏️'),
  ('Leash', 'Laisse', 'حبل المشي', 'Accessoires', 'dogs', '🪢'),
  ('Collar', 'Collier', 'طوق', 'Accessoires', 'dogs', '⭕'),
  ('Toys', 'Jouets', 'ألعاب', 'Accessoires', 'dogs', '🎾'),
  ('Feeder', 'Gamelle', 'وعاء الطعام', 'Accessoires', 'dogs', '🍽️'),
  ('Water Bowl', 'Bol d\'eau', 'وعاء الماء', 'Accessoires', 'dogs', '💧'),
  ('Transport Cage', 'Cage de transport', 'قفص النقل', 'Accessoires', 'dogs', '🚗'),
  ('Harness', 'Harnais', 'حزام', 'Accessoires', 'dogs', '🎀'),
  -- Alimentaire
  ('Dry Food', 'Croquettes', 'طعام جاف', 'Alimentaire', 'dogs', '🌾'),
  ('Canned Food', 'Conserve', 'طعام معلب', 'Alimentaire', 'dogs', '🥫'),
  ('Treats', 'Friandises et récompenses', 'الحلويات والمكافآت', 'Alimentaire', 'dogs', '🍖'),
  ('Food Supplement', 'Complément alimentaire', 'مكمل غذائي', 'Alimentaire', 'dogs', '💊'),
  -- Soin et Toilettage
  ('Shampoo', 'Shampoings', 'الشامبو', 'Soin et Toilettage', 'dogs', '🧴'),
  ('Brushes', 'Brosses et soins', 'الفرش والعناية', 'Soin et Toilettage', 'dogs', '🪮'),
  ('Antiparasitic', 'Antiparasitaires', 'مضادات الطفيليات', 'Soin et Toilettage', 'dogs', '🛡️');

-- Insert subcategories for Birds
INSERT INTO subcategories (name_en, name_fr, name_ar, product_type, animal_type, icon) VALUES
  -- Accessoires
  ('Cage', 'Cage', 'قفص', 'Accessoires', 'birds', '🏠'),
  ('Toys', 'Jouets', 'ألعاب', 'Accessoires', 'birds', '🎪'),
  ('Water Dispenser', 'Distributeur d\'eau', 'موزع الماء', 'Accessoires', 'birds', '💧'),
  ('Feeder', 'Mangeoire', 'وعاء الطعام', 'Accessoires', 'birds', '🍽️'),
  ('Perch', 'Perchoir', 'الجثم', 'Accessoires', 'birds', '🌳'),
  -- Alimentaire
  ('Seeds', 'Graines', 'البذور', 'Alimentaire', 'birds', '🌾'),
  ('Food Supplement', 'Complément alimentaire', 'مكمل غذائي', 'Alimentaire', 'birds', '💊'),
  -- Soin et Toilettage
  ('Cleaning Products', 'Produits de nettoyage', 'منتجات التنظيف', 'Soin et Toilettage', 'birds', '🧹'),
  ('Feather Care', 'Soins des plumes', 'العناية بالريش', 'Soin et Toilettage', 'birds', '🪶');

-- Insert subcategories for Other Pets
INSERT INTO subcategories (name_en, name_fr, name_ar, product_type, animal_type, icon) VALUES
  -- Accessoires
  ('Cage', 'Cage', 'قفص', 'Accessoires', 'other', '🏠'),
  ('Bedding', 'Litière', 'الفراش', 'Accessoires', 'other', '🏜️'),
  ('Toys', 'Jouets', 'ألعاب', 'Accessoires', 'other', '🎮'),
  ('Feeder', 'Mangeoire', 'وعاء الطعام', 'Accessoires', 'other', '🍽️'),
  -- Alimentaire
  ('Food', 'Nourriture', 'الطعام', 'Alimentaire', 'other', '🌾'),
  ('Treats', 'Friandises', 'الحلويات', 'Alimentaire', 'other', '🍖'),
  -- Soin et Toilettage
  ('Care Products', 'Produits de soin', 'منتجات العناية', 'Soin et Toilettage', 'other', '🧴');
