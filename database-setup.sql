-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'employee', 'sales')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(50) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id),
  total DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'in-progress', 'ready', 'delivered')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY,
  order_id UUID NOT NULL REFERENCES orders(id),
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  observation TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert initial users
INSERT INTO users (id, name, email, password, role)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Manager User', 'manager@sucrebiscoiteria.com.br', 'password', 'manager'),
('00000000-0000-0000-0000-000000000002', 'Employee User', 'employee@sucrebiscoiteria.com.br', 'password', 'employee'),
('00000000-0000-0000-0000-000000000003', 'Sales User', 'sales@sucrebiscoiteria.com.br', 'password', 'sales')
ON CONFLICT (email) DO NOTHING;

-- Insert initial products
INSERT INTO products (id, name, description, price)
VALUES 
('00000000-0000-0000-0000-000000000001', 'Chocolate Cake', 'Delicious chocolate cake with rich frosting', 25.99),
('00000000-0000-0000-0000-000000000002', 'Vanilla Cupcakes', 'Light and fluffy vanilla cupcakes with buttercream', 12.99),
('00000000-0000-0000-0000-000000000003', 'Strawberry Tart', 'Fresh strawberry tart with custard filling', 18.50)
ON CONFLICT (id) DO NOTHING;

-- Insert initial clients
INSERT INTO clients (id, name, email, phone)
VALUES 
('00000000-0000-0000-0000-000000000001', 'John Doe', 'john@example.com', '555-123-4567'),
('00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com', '555-987-6543'),
('00000000-0000-0000-0000-000000000003', 'Robert Johnson', 'robert@example.com', '555-456-7890')
ON CONFLICT (id) DO NOTHING;
