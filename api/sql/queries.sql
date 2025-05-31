-- Save releases
INSERT OR REPLACE INTO nike_releases (id, name, price, image_url, product_url, status, timestamp)
VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);

-- Save shoe details
INSERT OR REPLACE INTO shoe_details (
    id, name, price, image_url, image_urls, product_url, status,
    description, colorway, style, sizes, is_launched,
    stockx_url, stockx_price, stockx_last_sale, stockx_sales, stockx_name, stockx_sku,
    last_updated
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP);

-- Get latest releases
SELECT id, name, price, image_url as imageUrl, product_url as productUrl, status, timestamp
FROM nike_releases
ORDER BY timestamp DESC
LIMIT ?;

-- Get shoe by ID exact match
SELECT 
    r.id, r.name, r.price, r.image_url as imageUrl, 
    r.product_url as productUrl, r.status, r.timestamp,
    d.description, d.colorway, d.style, d.sizes, d.image_urls as imageUrls,
    d.is_launched as isLaunched, d.last_updated,
    d.stockx_url as stockxUrl, d.stockx_price as stockxPrice,
    d.stockx_last_sale as stockxLastSale, d.stockx_sales as stockxSales,
    d.stockx_name as stockxName, d.stockx_sku as stockxSku
FROM nike_releases r
LEFT JOIN shoe_details d ON r.id = d.id
WHERE r.id = ?;

-- Get shoe by ID partial match
SELECT 
    r.id, r.name, r.price, r.image_url as imageUrl, 
    r.product_url as productUrl, r.status, r.timestamp,
    d.description, d.colorway, d.style, d.sizes, d.image_urls as imageUrls,
    d.is_launched as isLaunched, d.last_updated,
    d.stockx_url as stockxUrl, d.stockx_price as stockxPrice,
    d.stockx_last_sale as stockxLastSale, d.stockx_sales as stockxSales,
    d.stockx_name as stockxName, d.stockx_sku as stockxSku
FROM nike_releases r
LEFT JOIN shoe_details d ON r.id = d.id
WHERE r.id LIKE ?
ORDER BY r.timestamp DESC
LIMIT 1;

-- Get shoes needing update
SELECT r.id, r.product_url as productUrl
FROM nike_releases r
LEFT JOIN shoe_details d ON r.id = d.id
WHERE d.last_updated IS NULL 
   OR d.last_updated < datetime('now', '-1 day')
ORDER BY r.timestamp DESC;

-- Cleanup old entries
DELETE FROM nike_releases
WHERE id NOT IN (
    SELECT id FROM nike_releases
    ORDER BY timestamp DESC
    LIMIT 1000
); 