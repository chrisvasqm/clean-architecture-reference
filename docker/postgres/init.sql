-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  price NUMERIC(10, 2) NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Seed initial products
INSERT INTO products (id, name, description, price, stock, created_at, updated_at)
VALUES
  ('1', 'Mechanical Keyboard', 'Hot-swappable mechanical keyboard with RGB backlighting', 99.99, 25, NOW(), NOW()),
  ('2', 'Wireless Ergonomic Mouse', 'High-precision wireless mouse with thumb rest', 49.99, 50, NOW(), NOW())
ON CONFLICT (id) DO NOTHING;
