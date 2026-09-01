-- =========================================================================
-- AURICVISTA DIRECT FARM - POSTGRESQL RELATIONAL SCHEMA
-- =========================================================================

-- Enable UUID extension if available
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(100) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255),
    role VARCHAR(50) NOT NULL CHECK (role IN ('farmer', 'customer', 'admin')),
    phone VARCHAR(50),
    address TEXT,
    location VARCHAR(255),
    farm_name VARCHAR(255),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);

-- 2. FARMER PROFILES TABLE
CREATE TABLE IF NOT EXISTS farmer_profiles (
    id VARCHAR(100) PRIMARY KEY,
    user_id VARCHAR(100) REFERENCES users(id) ON DELETE CASCADE,
    farmer_slug VARCHAR(100) UNIQUE,
    farm_name VARCHAR(255) NOT NULL,
    location VARCHAR(255) NOT NULL,
    latitude DECIMAL(10, 8),
    longitude DECIMAL(11, 8),
    experience VARCHAR(100),
    specialty VARCHAR(255),
    acreage VARCHAR(100),
    highlight_badge VARCHAR(100),
    description TEXT,
    verification_status VARCHAR(50) DEFAULT 'verified' CHECK (verification_status IN ('pending', 'verified', 'rejected')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_farmer_profiles_user ON farmer_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_farmer_profiles_slug ON farmer_profiles(farmer_slug);

-- 3. PRODUCE LISTINGS TABLE
CREATE TABLE IF NOT EXISTS produce_listings (
    id VARCHAR(100) PRIMARY KEY,
    farmer_id VARCHAR(100),
    farmer_name VARCHAR(255) NOT NULL,
    farmer_email VARCHAR(255),
    farm_location VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    quantity_available NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (quantity_available >= 0),
    harvest_date DATE NOT NULL DEFAULT CURRENT_DATE,
    images JSONB NOT NULL DEFAULT '[]'::jsonb,
    quality_score NUMERIC(3, 1),
    freshness_label VARCHAR(50),
    ai_quality_data JSONB,
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Draft', 'Sold Out')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_produce_category ON produce_listings(category);
CREATE INDEX IF NOT EXISTS idx_produce_status ON produce_listings(status);
CREATE INDEX IF NOT EXISTS idx_produce_farmer_email ON produce_listings(farmer_email);
CREATE INDEX IF NOT EXISTS idx_produce_harvest_date ON produce_listings(harvest_date);

-- 4. ORDERS TABLE
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(50),
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    delivery_fee NUMERIC(10, 2) NOT NULL DEFAULT 0 CHECK (delivery_fee >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0),
    delivery_method VARCHAR(50) NOT NULL DEFAULT 'Home Delivery' CHECK (delivery_method IN ('Home Delivery', 'Farm Pickup')),
    delivery_address TEXT,
    preferred_delivery_date DATE NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'Cash on Delivery',
    payment_status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    order_status VARCHAR(50) NOT NULL DEFAULT 'Placed' CHECK (order_status IN ('Placed', 'Harvesting', 'Dispatched', 'Delivered', 'Cancelled')),
    estimated_delivery VARCHAR(100),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_orders_customer_email ON orders(customer_email);
CREATE INDEX IF NOT EXISTS idx_orders_order_status ON orders(order_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 5. ORDER ITEMS TABLE
CREATE TABLE IF NOT EXISTS order_items (
    id VARCHAR(100) PRIMARY KEY,
    order_id VARCHAR(100) NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    produce_id VARCHAR(100),
    farmer_id VARCHAR(100),
    farmer_name VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    image TEXT,
    quantity NUMERIC(10, 2) NOT NULL CHECK (quantity > 0),
    unit VARCHAR(50) NOT NULL DEFAULT 'kg',
    unit_price NUMERIC(10, 2) NOT NULL CHECK (unit_price >= 0),
    subtotal NUMERIC(10, 2) NOT NULL CHECK (subtotal >= 0)
);

CREATE INDEX IF NOT EXISTS idx_order_items_order ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_items_produce ON order_items(produce_id);

-- 6. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS reviews (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100),
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255),
    farmer_id VARCHAR(100) NOT NULL,
    farmer_name VARCHAR(255) NOT NULL,
    produce_id VARCHAR(100),
    produce_name VARCHAR(255),
    rating NUMERIC(2, 1) NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    verified BOOLEAN DEFAULT TRUE,
    photos JSONB DEFAULT '[]'::jsonb,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_reviews_farmer ON reviews(farmer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_produce ON reviews(produce_id);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);

-- 7. SUBSCRIPTIONS TABLE
CREATE TABLE IF NOT EXISTS subscriptions (
    id VARCHAR(100) PRIMARY KEY,
    customer_id VARCHAR(100),
    farmer_id VARCHAR(100),
    produce_id VARCHAR(100),
    frequency VARCHAR(50) NOT NULL DEFAULT 'Weekly' CHECK (frequency IN ('Weekly', 'Biweekly', 'Monthly')),
    quantity NUMERIC(10, 2) NOT NULL DEFAULT 1 CHECK (quantity > 0),
    status VARCHAR(50) NOT NULL DEFAULT 'Active' CHECK (status IN ('Active', 'Paused', 'Cancelled')),
    next_delivery_date DATE,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_subscriptions_customer ON subscriptions(customer_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions(status);
