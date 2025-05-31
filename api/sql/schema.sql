-- Create releases table
CREATE TABLE IF NOT EXISTS nike_releases (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT,
    image_url TEXT,
    product_url TEXT,
    status TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Create shoe details table
CREATE TABLE IF NOT EXISTS shoe_details (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    price TEXT,
    image_url TEXT,
    image_urls TEXT,
    product_url TEXT,
    status TEXT,
    description TEXT,
    colorway TEXT,
    style TEXT,
    sizes TEXT,
    is_launched BOOLEAN,
    stockx_url TEXT,
    stockx_price TEXT,
    stockx_last_sale TEXT,
    stockx_sales TEXT,
    stockx_name TEXT,
    stockx_sku TEXT,
    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (id) REFERENCES nike_releases(id)
); 