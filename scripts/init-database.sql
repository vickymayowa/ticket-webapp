-- Create tables for Event Ticketing System

-- Events table
CREATE TABLE IF NOT EXISTS events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(255) NOT NULL,
  description TEXT,
  image_url VARCHAR(500),
  category VARCHAR(100),
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  location VARCHAR(500) NOT NULL,
  total_tickets INTEGER NOT NULL,
  available_tickets INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_by UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  first_name VARCHAR(255),
  last_name VARCHAR(255),
  phone VARCHAR(20),
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tickets table
CREATE TABLE IF NOT EXISTS tickets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  ticket_number VARCHAR(50) NOT NULL UNIQUE,
  qr_code TEXT,
  quantity INTEGER NOT NULL DEFAULT 1,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'purchased', -- purchased, redeemed
  purchase_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Orders/Payments table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  amount DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL,
  reference VARCHAR(100), -- Paystack reference
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, failed
  payment_method VARCHAR(50) DEFAULT 'paystack',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for better query performance
CREATE INDEX idx_events_created_by ON events(created_by);
CREATE INDEX idx_tickets_event_id ON tickets(event_id);
CREATE INDEX idx_tickets_user_id ON tickets(user_id);
CREATE INDEX idx_orders_user_id ON orders(user_id);
CREATE INDEX idx_orders_event_id ON orders(event_id);
CREATE INDEX idx_orders_reference ON orders(reference);
