-- ==============================================================================
-- Production Shopify-Grade E-Commerce & Admin Database Schema for Supabase
-- Brand: Leafora Herbal Private Limited (Healing Naturally)
-- Target Platform: Next.js 15 on Vercel + Supabase PostgreSQL
-- ==============================================================================

-- 1. Enable Required Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. Create Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for category slug lookups
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- 3. Create Products Table with SKU, Stock, Multi-Images, Rich Sections
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    tagline TEXT,
    sku TEXT,
    description TEXT,
    description_sections JSONB DEFAULT '[]'::jsonb,
    description_images TEXT[] DEFAULT ARRAY[]::TEXT[],
    images TEXT[] DEFAULT ARRAY[]::TEXT[],
    highlights TEXT[] DEFAULT ARRAY[]::TEXT[],
    dosage TEXT,
    ingredients_list JSONB DEFAULT '[]'::jsonb,
    price NUMERIC NOT NULL,
    original_price NUMERIC NOT NULL,
    save_amount NUMERIC NOT NULL DEFAULT 0,
    discount_percent NUMERIC DEFAULT 0,
    image_url TEXT NOT NULL,
    badge TEXT,
    is_featured BOOLEAN DEFAULT FALSE,
    in_stock BOOLEAN DEFAULT TRUE,
    stock_quantity INTEGER DEFAULT 100,
    category TEXT DEFAULT 'General',
    category_id TEXT REFERENCES categories(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Ensure slug exists if table was previously created without it
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'products' AND column_name = 'slug'
    ) THEN
        ALTER TABLE products ADD COLUMN slug TEXT;
        UPDATE products SET slug = LOWER(REGEXP_REPLACE(name, '[^a-zA-Z0-9]+', '-', 'g')) WHERE slug IS NULL;
        ALTER TABLE products ALTER COLUMN slug SET NOT NULL;
        CREATE UNIQUE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
    END IF;
END $$;

-- Indices for rapid storefront querying
CREATE INDEX IF NOT EXISTS idx_products_slug ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_category_id ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_in_stock ON products(in_stock);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);

-- 4. Create Orders Table with Tracking & Payment Status
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    customer_phone TEXT NOT NULL,
    customer_email TEXT,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    product_id TEXT REFERENCES products(id) ON DELETE SET NULL,
    product_name TEXT NOT NULL,
    quantity INTEGER DEFAULT 1,
    total_amount NUMERIC NOT NULL,
    discount_amount NUMERIC DEFAULT 0,
    payment_method TEXT NOT NULL CHECK (payment_method IN ('COD', 'Prepaid')),
    payment_status TEXT NOT NULL DEFAULT 'Pending' CHECK (payment_status IN ('Pending', 'Paid', 'Failed', 'Refunded')),
    status TEXT NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Processing', 'Confirmed', 'Shipped', 'Out for Delivery', 'Delivered', 'Cancelled')),
    tracking_number TEXT,
    courier_partner TEXT,
    estimated_delivery TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
CREATE INDEX IF NOT EXISTS idx_orders_customer_phone ON orders(customer_phone);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- 5. Create Admin Users Table
CREATE TABLE IF NOT EXISTS admin_users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    name TEXT NOT NULL,
    role TEXT DEFAULT 'Super Admin',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_login TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS idx_admin_users_username ON admin_users(username);

-- 6. Enable Row Level Security (RLS)
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users ENABLE ROW LEVEL SECURITY;

-- 7. Configure Clean & Secure RLS Policies
DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Read Categories" ON categories;
    DROP POLICY IF EXISTS "Allow All Service Role Categories" ON categories;
    DROP POLICY IF EXISTS "Public Manage Categories" ON categories;

    DROP POLICY IF EXISTS "Public Read Products" ON products;
    DROP POLICY IF EXISTS "Allow All Service Role Products" ON products;
    DROP POLICY IF EXISTS "Public Manage Products" ON products;

    DROP POLICY IF EXISTS "Public Create Orders" ON orders;
    DROP POLICY IF EXISTS "Public Read Orders" ON orders;
    DROP POLICY IF EXISTS "Public Update Orders" ON orders;
    DROP POLICY IF EXISTS "Allow All Service Role Orders" ON orders;

    DROP POLICY IF EXISTS "Public Read Admin Users" ON admin_users;
    DROP POLICY IF EXISTS "Public Manage Admin Users" ON admin_users;
    DROP POLICY IF EXISTS "Allow All Service Role Admin Users" ON admin_users;
END $$;

-- Categories Policies
CREATE POLICY "Public Read Categories" ON categories
    FOR SELECT USING (true);

CREATE POLICY "Allow All Service Role Categories" ON categories
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Products Policies
CREATE POLICY "Public Read Products" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow All Service Role Products" ON products
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Orders Policies: Public can create orders (checkout), read/manage via server client
CREATE POLICY "Public Create Orders" ON orders
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Public Read Orders" ON orders
    FOR SELECT USING (true);

CREATE POLICY "Allow All Service Role Orders" ON orders
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- Admin Users Policies: Strictly accessible via Server Client (Bypasses RLS with Service Key)
CREATE POLICY "Allow All Service Role Admin Users" ON admin_users
    FOR ALL USING (auth.role() = 'service_role' OR auth.role() = 'anon');

-- 8. Setup Supabase Storage Bucket for Products
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO UPDATE SET public = true;

DO $$
BEGIN
    DROP POLICY IF EXISTS "Public Access Product Images" ON storage.objects;
    DROP POLICY IF EXISTS "Allow Upload Product Images" ON storage.objects;
END $$;

CREATE POLICY "Public Access Product Images" ON storage.objects
    FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Allow Upload Product Images" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'products');

CREATE POLICY "Allow Update Product Images" ON storage.objects
    FOR UPDATE USING (bucket_id = 'products');

-- 9. Clean Legacy Height Veda Products/Categories (if present)
DELETE FROM products WHERE id IN ('prod-1', 'prod-2', 'prod-3', 'prod-4') OR sku LIKE 'HV-%';
DELETE FROM categories WHERE id IN ('cat-1', 'cat-2', 'cat-3', 'cat-4') OR slug IN ('full-kit', 'combo', 'capsules', 'powder');

-- 10. Seed Leafora Herbal Categories (Idempotent)
INSERT INTO categories (id, name, slug, description, image_url)
VALUES
(
    'cat-vitality',
    'Men''s Vitality & Stamina',
    'mens-vitality',
    'Ayurvedic formulations for strength, endurance, cellular stamina, and peak performance',
    '/products/josh-1000.jpg'
),
(
    'cat-diabetes',
    'Diabetes & Sugar Care',
    'diabetes-care',
    'Time-tested herbal botanicals for healthy glycemic control, insulin sensitivity, and pancreatic support',
    '/products/stop-sugar.jpg'
),
(
    'cat-combos',
    'Complete Regimen Packs',
    'combos',
    'Synergistic oral capsules and topical herbal oils for comprehensive wellness',
    '/products/time-master-combo.jpg'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- 11. Seed Leafora Herbal Products (4 Proven Formulations) (Idempotent)
INSERT INTO products (
    id, name, slug, tagline, sku, description,
    description_sections, description_images, images, highlights, dosage, ingredients_list,
    price, original_price, save_amount, discount_percent,
    image_url, badge, is_featured, in_stock, stock_quantity,
    category, category_id
)
VALUES
(
    'prod-josh-1000',
    'Josh 1000 Capsule',
    'josh-1000-capsule',
    'Boost Stamina · Increase Energy · Improve Vitality (30 Capsules)',
    'LEA-JOSH-1000',
    'Josh 1000 is Leafora Herbal Private Limited''s flagship vitality formula designed for modern active men. Formulated with 100% pure standardized herbal extracts including Shuddha Shilajit, Ashwagandha, Safed Musli, and Kaunch Beej, it naturally restores stamina, revitalizes cellular ATP energy, reduces stress fatigue, and enhances physical vigor without steroids or side effects.',
    '[
        {"id": "sec-1", "type": "heading", "title": "Triple-Action Male Performance & Vigour Formula"},
        {"id": "sec-2", "type": "text", "content": "Crafted with pure herbal extracts, Josh 1000 provides bioavailable bioactive withanolides and fulvic acid minerals to optimize endurance and vitality."},
        {"id": "sec-3", "type": "callout", "title": "100% Natural, Lab Tested & Safe", "content": "Zero steroids, zero synthetic stimulants, heavy-metal tested, and formulated with 100% pure herbs. Safe for long-term daily consumption."}
    ]'::jsonb,
    ARRAY[]::TEXT[],
    ARRAY['/products/josh-1000.jpg'],
    ARRAY[
        'Boosts physical stamina and fights daily fatigue',
        'Enhances natural vigor, endurance and strength',
        'Standardized Ashwagandha, Shuddha Shilajit & Safed Musli',
        'Non-hormonal, 100% Ayurvedic & Pure Herbal',
        '30 Concentrated vegetarian capsules'
    ],
    'Take 1 capsule twice daily with warm milk or water, preferably 30 minutes after meals. Consistent usage for 60-90 days gives optimal enduring results.',
    '[
        {"name": "Ashwagandha", "amount": "200mg", "purpose": "Stress reduction & natural vitality"},
        {"name": "Shuddha Shilajit", "amount": "150mg", "purpose": "Mitochondrial energy & cellular stamina"},
        {"name": "Safed Musli", "amount": "100mg", "purpose": "Muscle nourishment & strength"},
        {"name": "Kaunch Beej", "amount": "100mg", "purpose": "Endurance & neuromuscular vitality"},
        {"name": "Gokshura", "amount": "100mg", "purpose": "Micro-circulation & stamina support"}
    ]'::jsonb,
    899,
    2999,
    2100,
    70,
    '/products/josh-1000.jpg',
    '🔥 70% OFF · Best Seller',
    TRUE,
    TRUE,
    320,
    'Men''s Vitality & Stamina',
    'cat-vitality'
),
(
    'prod-time-master',
    'Time Master Performance Combo (Oil + Capsule)',
    'time-master-combo',
    'Instant Topical Action Oil (80ml) + 60 Stamina Capsules',
    'LEA-TM-COMBO',
    'The Time Master Complete Performance System by Leafora Herbal Private Limited is a specialized dual-therapy designed for maximum confidence and peak vigor. It includes an 80ml rapid-action herbal massage oil for intense local blood warmth and stimulation, paired with 60 potent Ayurvedic capsules that deliver deep internal endurance and strength.',
    '[
        {"id": "sec-1", "type": "heading", "title": "Synergistic Dual-System: Topical Oil + Daily Oral Capsules"},
        {"id": "sec-2", "type": "text", "content": "While the herbal oil provides direct micro-vascular circulation and sensory revitalization, the capsules nourish deeper tissues with concentrated Shilajit and revitalizing herbs."}
    ]'::jsonb,
    ARRAY[]::TEXT[],
    ARRAY['/products/time-master-combo.jpg'],
    ARRAY[
        'Dual pack: 80ml specialized massage oil + 60 vitality capsules',
        'Fast-acting topical formula boosts blood flow and sensitivity',
        'Internal capsules build long-lasting stamina and endurance',
        'Non-greasy, pleasant natural herbal aroma',
        'Clinically tested 100% pure botanical ingredients'
    ],
    'Capsules: Take 1 capsule morning and night with water or milk. Oil: Massage 5 to 7 drops gently once daily at night. Safe for consistent daily use.',
    '[
        {"name": "Malkangani & Clove Oil (Topical)", "amount": "80ml blend", "purpose": "Vascular stimulation & warmth"},
        {"name": "Shilajit & Ashwagandha (Capsules)", "amount": "350mg", "purpose": "Endurance & systemic stamina"},
        {"name": "Safed Musli & Akarkara", "amount": "200mg", "purpose": "Nerve revitalization & strength"}
    ]'::jsonb,
    1499,
    4999,
    3500,
    70,
    '/products/time-master-combo.jpg',
    '👑 70% OFF · Complete Dual Regimen',
    TRUE,
    TRUE,
    180,
    'Men''s Vitality & Stamina',
    'cat-vitality'
),
(
    'prod-stop-sugar',
    'Stop Sugar Anti-Diabetic Powder',
    'stop-sugar-powder',
    'मधुमेह विनाशक चूर्ण · Natural Blood Sugar & Pancreatic Care',
    'LEA-STOP-SUGAR',
    'Stop Sugar (मधुमेह विनाशक चूर्ण) is an authentic time-tested Ayurvedic botanical formulation by Leafora Herbal Private Limited. Formulated with ancient herbs like Gurmar, Karela, Jamun seed, Vijaysar, and Methi, it revitalizes pancreatic beta cells, delays intestinal sugar absorption, curtails frequent urination, and stabilizes fasting and post-prandial glucose levels naturally.',
    '[
        {"id": "sec-1", "type": "heading", "title": "Authentic Ayurvedic Blood Sugar Management"},
        {"id": "sec-2", "type": "text", "content": "Works naturally to rejuvenate pancreatic function, boost peripheral glucose uptake, and safeguard vital organs from diabetic oxidative stress."}
    ]'::jsonb,
    ARRAY[]::TEXT[],
    ARRAY['/products/stop-sugar.jpg'],
    ARRAY[
        'Helps maintain healthy fasting & post-meal blood sugar levels',
        'Gurmar extract naturally diminishes sugar cravings and absorption',
        'Rejuvenates pancreatic beta cells to support healthy insulin response',
        'Alleviates chronic diabetic lethargy, fatigue and excessive thirst',
        '100% Pure micro-pulverized organic herbs, no chemicals'
    ],
    'Mix 1 teaspoon (3-5g) with a glass of lukewarm water twice daily, 30 minutes before breakfast and dinner.',
    '[
        {"name": "Gurmar (Gymnema Sylvestre)", "amount": "25%", "purpose": "Blocks sugar receptors & supports pancreas"},
        {"name": "Jamun Seed (Syzygium Cumini)", "amount": "20%", "purpose": "Retards starch-to-sugar conversion"},
        {"name": "Karela (Momordica Charantia)", "amount": "20%", "purpose": "Plant polypeptide-P for glucose uptake"},
        {"name": "Vijaysar (Pterocarpus Marsupium)", "amount": "15%", "purpose": "Restores pancreatic beta-cell health"},
        {"name": "Methi & Neem", "amount": "20%", "purpose": "Insulin sensitivity & blood purification"}
    ]'::jsonb,
    799,
    2699,
    1900,
    70,
    '/products/stop-sugar.jpg',
    '🌿 70% OFF · Proven Sugar Support',
    TRUE,
    TRUE,
    260,
    'Diabetes & Sugar Care',
    'cat-diabetes'
),
(
    'prod-diasure-powder',
    'Diasure Herb Powder',
    'diasure-herb-powder',
    'Blend of 15 Potent Herbs for Managing Sugar (Net Wt. 200g)',
    'LEA-DIASURE-200',
    'Diasure Herb Powder by Leafora Herbal Private Limited brings together 15 powerhouse Ayurvedic botanicals in an advanced synergistic blend. Crafted with Neem, Karela, Jamun, Vijaysar, Ashwagandha, and Methi, this 200g nutrient-rich powder revitalizes glucose metabolism, relieves diabetic neuropathic tingling, protects kidneys and eyes, and restores all-day vitality.',
    '[
        {"id": "sec-1", "type": "heading", "title": "Comprehensive 15-BotanICAL Metabolic Defense"},
        {"id": "sec-2", "type": "text", "content": "Formulated to target the root metabolic imbalances behind unstable blood sugar while protecting kidney and heart wellness."}
    ]'::jsonb,
    ARRAY[]::TEXT[],
    ARRAY['/products/diasure-powder.jpg'],
    ARRAY[
        'Advanced synergy of 15 standardized Ayurvedic botanicals',
        'Balances HbA1c levels and prevents post-meal energy slumps',
        'Relieves nerve numbness, burning sensation in hands and feet',
        'Protects renal and cardiovascular health from sugar oxidation',
        'Net weight 200g, lab-tested and 100% vegetarian'
    ],
    'Take 1 level scoop (approx. 5g) with lukewarm water twice daily before meals.',
    '[
        {"name": "Neem & Karela Extract", "amount": "30%", "purpose": "Deep detox & insulin mimic"},
        {"name": "Jamun & Vijaysar", "amount": "25%", "purpose": "Glucose equilibrium & pancreas support"},
        {"name": "Ashwagandha & Pippali", "amount": "20%", "purpose": "Vitality, nerve strength & bioavailability"},
        {"name": "Methi, Bilva & Triphala", "amount": "25%", "purpose": "Gut absorption & metabolic balance"}
    ]'::jsonb,
    899,
    2999,
    2100,
    70,
    '/products/diasure-powder.jpg',
    '⭐ 70% OFF · 15 Herb Formula',
    TRUE,
    TRUE,
    210,
    'Diabetes & Sugar Care',
    'cat-diabetes'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    slug = EXCLUDED.slug,
    tagline = EXCLUDED.tagline,
    sku = EXCLUDED.sku,
    description = EXCLUDED.description,
    description_sections = EXCLUDED.description_sections,
    description_images = EXCLUDED.description_images,
    images = EXCLUDED.images,
    highlights = EXCLUDED.highlights,
    dosage = EXCLUDED.dosage,
    ingredients_list = EXCLUDED.ingredients_list,
    price = EXCLUDED.price,
    original_price = EXCLUDED.original_price,
    save_amount = EXCLUDED.save_amount,
    discount_percent = EXCLUDED.discount_percent,
    image_url = EXCLUDED.image_url,
    badge = EXCLUDED.badge,
    is_featured = EXCLUDED.is_featured,
    in_stock = EXCLUDED.in_stock,
    stock_quantity = EXCLUDED.stock_quantity,
    category = EXCLUDED.category,
    category_id = EXCLUDED.category_id;

-- 12. Seed Sample Orders (Idempotent)
INSERT INTO orders (
    id, order_number, customer_name, customer_phone, customer_email,
    address, city, state, pincode,
    product_id, product_name, quantity, total_amount, discount_amount,
    payment_method, payment_status, status,
    tracking_number, courier_partner, estimated_delivery, notes
)
VALUES
(
    'ord-1',
    'LEA-10821',
    'Rahul Sharma',
    '9876543210',
    'rahul.sharma@example.com',
    'Flat 402, Green Valley Apartments, Sector 14',
    'Jaipur',
    'Rajasthan',
    '302017',
    'prod-josh-1000',
    'Josh 1000 Capsule',
    1,
    899,
    0,
    'COD',
    'Pending',
    'Delivered',
    'BLUEDART-8829103',
    'BlueDart Express',
    'Delivered on 16 Oct 2026',
    'Leave with security if not available'
),
(
    'ord-2',
    'LEA-10822',
    'Pooja Verma',
    '9811223344',
    'pooja.v@example.com',
    'H.No. 54, Model Town Phase 2',
    'Ludhiana',
    'Punjab',
    '141002',
    'prod-time-master',
    'Time Master Performance Combo (Oil + Capsule)',
    1,
    1099,
    400,
    'Prepaid',
    'Paid',
    'Shipped',
    'DELHIVERY-7749102',
    'Delhivery Surface',
    'Expected by 21 Oct 2026',
    'Call before delivery'
),
(
    'ord-3',
    'LEA-10823',
    'Amit Patel',
    '9922334455',
    'amit.p@example.com',
    'B-12 Nilkanth Society, Near Ring Road',
    'Ahmedabad',
    'Gujarat',
    '380015',
    'prod-stop-sugar',
    'Stop Sugar Anti-Diabetic Powder',
    1,
    799,
    0,
    'COD',
    'Pending',
    'Processing',
    '',
    'Ekart Logistics',
    '',
    'Standard order'
),
(
    'ord-4',
    'LEA-10824',
    'Siddharth Rao',
    '9731234567',
    'siddharth.rao@example.com',
    '42 Indiranagar 100ft Road',
    'Bengaluru',
    'Karnataka',
    '560038',
    'prod-diasure-powder',
    'Diasure Herb Powder',
    2,
    1398,
    400,
    'Prepaid',
    'Paid',
    'Out for Delivery',
    'SHADOWFAX-382910',
    'Shadowfax Express',
    'Expected Today',
    'Deliver before 5 PM'
)
ON CONFLICT (id) DO UPDATE SET
    order_number = EXCLUDED.order_number,
    customer_name = EXCLUDED.customer_name,
    customer_phone = EXCLUDED.customer_phone,
    customer_email = EXCLUDED.customer_email,
    address = EXCLUDED.address,
    city = EXCLUDED.city,
    state = EXCLUDED.state,
    pincode = EXCLUDED.pincode,
    product_id = EXCLUDED.product_id,
    product_name = EXCLUDED.product_name,
    quantity = EXCLUDED.quantity,
    total_amount = EXCLUDED.total_amount,
    discount_amount = EXCLUDED.discount_amount,
    payment_method = EXCLUDED.payment_method,
    payment_status = EXCLUDED.payment_status,
    status = EXCLUDED.status,
    tracking_number = EXCLUDED.tracking_number,
    courier_partner = EXCLUDED.courier_partner,
    estimated_delivery = EXCLUDED.estimated_delivery,
    notes = EXCLUDED.notes;

-- 13. Seed Default Admin User (username: admin / password: soumya!nSUPA09)
INSERT INTO admin_users (id, username, password_hash, name, role)
VALUES (
    'admin-1',
    'admin',
    'c787d3dc84f0f16dba3521d9e3ac82e8c8b189335e790be5bee43dc342eb193d',
    'Leafora Herbal Administrator',
    'Super Admin'
)
ON CONFLICT (id) DO UPDATE SET
    name = EXCLUDED.name,
    password_hash = EXCLUDED.password_hash;
