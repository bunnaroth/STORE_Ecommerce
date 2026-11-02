BEGIN;

DO $$
BEGIN
    CREATE TYPE user_role AS ENUM ('customer', 'admin');
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

DO $$
BEGIN
    CREATE TYPE order_status AS ENUM (
        'pending',
        'paid',
        'processing',
        'shipped',
        'delivered',
        'cancelled'
    );
EXCEPTION
    WHEN duplicate_object THEN NULL;
END
$$;

CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    role user_role DEFAULT 'customer',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS addresses (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title VARCHAR(100) DEFAULT 'Home',
    street VARCHAR(255) NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100),
    postal_code VARCHAR(20) NOT NULL,
    country VARCHAR(100) NOT NULL,
    is_default BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS products (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL CHECK (price >= 0),
    stock INT NOT NULL CHECK (stock >= 0),
    images TEXT[] NOT NULL DEFAULT '{}',
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_featured BOOLEAN NOT NULL DEFAULT false
);

CREATE TABLE IF NOT EXISTS carts (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS cart_items (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
    product_id INT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    quantity INT NOT NULL CHECK (quantity > 0),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT unique_cart_product UNIQUE (cart_id, product_id)
);

CREATE TABLE IF NOT EXISTS orders (
    id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE SET NULL,
    shipping_address_id INT REFERENCES addresses(id) ON DELETE SET NULL,
    total_amount NUMERIC(10, 2) NOT NULL CHECK (total_amount >= 0),
    status order_status DEFAULT 'pending',
    stripe_session_id VARCHAR(255) UNIQUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS order_items (
    id SERIAL PRIMARY KEY,
    order_id INT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
    product_id INT REFERENCES products(id) ON DELETE SET NULL,
    quantity INT NOT NULL CHECK (quantity > 0),
    price_at_purchase NUMERIC(10, 2) NOT NULL CHECK (price_at_purchase >= 0)
);

ALTER TABLE users
    ADD COLUMN IF NOT EXISTS role user_role DEFAULT 'customer',
    ALTER COLUMN email TYPE VARCHAR(255),
    ALTER COLUMN password_hash TYPE VARCHAR(255),
    ALTER COLUMN first_name TYPE VARCHAR(100),
    ALTER COLUMN last_name TYPE VARCHAR(100),
    ALTER COLUMN created_at DROP NOT NULL,
    ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE products
    ADD COLUMN IF NOT EXISTS is_featured BOOLEAN NOT NULL DEFAULT false,
    ALTER COLUMN name TYPE VARCHAR(255),
    ALTER COLUMN category TYPE VARCHAR(100),
    ALTER COLUMN stock DROP DEFAULT,
    ALTER COLUMN created_at DROP NOT NULL,
    ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE carts
    ALTER COLUMN created_at DROP NOT NULL,
    ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE cart_items
    ALTER COLUMN created_at DROP NOT NULL,
    ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE orders
    ALTER COLUMN user_id DROP NOT NULL,
    ALTER COLUMN shipping_address_id DROP NOT NULL,
    ALTER COLUMN stripe_session_id TYPE VARCHAR(255),
    ALTER COLUMN status DROP DEFAULT,
    ALTER COLUMN status TYPE order_status USING status::text::order_status,
    ALTER COLUMN status DROP NOT NULL,
    ALTER COLUMN status SET DEFAULT 'pending',
    ALTER COLUMN created_at DROP NOT NULL,
    ALTER COLUMN updated_at DROP NOT NULL;

ALTER TABLE order_items
    ALTER COLUMN product_id DROP NOT NULL;

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'orders'::regclass
          AND conname = 'orders_user_id_fkey'
          AND confdeltype = 'n'
    ) THEN
        ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_user_id_fkey;
        ALTER TABLE orders
            ADD CONSTRAINT orders_user_id_fkey
            FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'orders'::regclass
          AND conname = 'orders_shipping_address_id_fkey'
          AND confdeltype = 'n'
    ) THEN
        ALTER TABLE orders DROP CONSTRAINT IF EXISTS orders_shipping_address_id_fkey;
        ALTER TABLE orders
            ADD CONSTRAINT orders_shipping_address_id_fkey
            FOREIGN KEY (shipping_address_id) REFERENCES addresses(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (
        SELECT 1
        FROM pg_constraint
        WHERE conrelid = 'order_items'::regclass
          AND conname = 'order_items_product_id_fkey'
          AND confdeltype = 'n'
    ) THEN
        ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;
        ALTER TABLE order_items
            ADD CONSTRAINT order_items_product_id_fkey
            FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE SET NULL;
    END IF;
END
$$;

CREATE INDEX IF NOT EXISTS idx_addresses_user_id ON addresses(user_id);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_cart_items_cart_id ON cart_items(cart_id);
CREATE INDEX IF NOT EXISTS idx_orders_user_id ON orders(user_id);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS products_featured_created_at_idx
    ON products (created_at DESC)
    WHERE is_featured = true;

COMMIT;
