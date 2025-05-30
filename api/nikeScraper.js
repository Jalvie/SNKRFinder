const puppeteer = require('puppeteer');

function generateShoeId(name, index) {
    if (!name) return `unknown-${index}`;
    
    // Create a URL-friendly ID from the shoe name
    const baseId = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
    
    return `${baseId}-${index}`;
}

function normalizeProductUrl(url) {
    if (!url) return null;
    
    try {
        // If it's already a full URL, validate it
        if (url.startsWith('http')) {
            new URL(url);
            return url;
        }
        
        // If it's a relative URL, make it absolute
        const absoluteUrl = `https://www.nike.com${url.startsWith('/') ? '' : '/'}${url}`;
        new URL(absoluteUrl); // Validate the constructed URL
        return absoluteUrl;
    } catch (error) {
        console.warn('⚠️ Invalid product URL:', url);
        return null;
    }
}

async function scrapeNikeReleases(maxRetries = 3) {
    console.log('🚀 Launching Nike scraper...');
    
    let browser = null;
    let page = null;
    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            browser = await puppeteer.launch({
                headless: "new",
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                    '--disable-dev-shm-usage',
                    '--disable-accelerated-2d-canvas',
                    '--disable-gpu',
                    '--window-size=1280,800'
                ]
            });
            
            page = await browser.newPage();
            
            // Set viewport and user agent
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
            
            // Set timeout
            page.setDefaultTimeout(30000);
            
            // Navigate to Nike's new shoes page
            console.log('🌍 Navigating to Nike new shoes...');
            await page.goto('https://www.nike.com/w/new-shoes-3n82yzy7ok', {
                waitUntil: ['domcontentloaded', 'networkidle2'],
                timeout: 30000
            });
            
            // Wait for the product grid to load
            console.log('🔍 Looking for products...');
            await page.waitForSelector('.product-card', { timeout: 30000 });
            
            // Extract products
            console.log('📦 Extracting product information...');
            const rawProducts = await page.evaluate(() => {
                const items = document.querySelectorAll('.product-card');
                return Array.from(items).slice(0, 12).map(item => {
                    const name = item.querySelector('.product-card__title, .product-title')?.textContent?.trim() || '';
                    const price = item.querySelector('.product-price, .price')?.textContent?.trim() || '';
                    const imageUrl = item.querySelector('img[src*="nike"], img[src*="static.nike"]')?.src || '';
                    
                    // Try multiple selectors for product URL
                    let productUrl = null;
                    const linkSelectors = [
                        'a[href*="/t/"]',
                        'a[href*="/p/"]',
                        'a[href*="nike.com"]',
                        'a.product-card__link',
                        'a[href]'
                    ];
                    
                    for (const selector of linkSelectors) {
                        const link = item.querySelector(selector);
                        if (link && link.href) {
                            productUrl = link.href;
                            break;
                        }
                    }
                    
                    const status = item.querySelector('.product-card__badge, .product-badge')?.textContent?.trim() || '';
                    
                    return {
                        name,
                        price,
                        imageUrl,
                        productUrl,
                        status,
                        timestamp: new Date().toISOString()
                    };
                });
            });
            
            // Process and validate products
            const products = rawProducts
                .filter(product => product.name && product.imageUrl) // Filter out invalid products
                .map((product, index) => {
                    const normalizedUrl = normalizeProductUrl(product.productUrl);
                    if (!normalizedUrl) {
                        console.warn(`⚠️ No valid product URL found for: ${product.name}`);
                    }
                    return {
                        ...product,
                        id: generateShoeId(product.name, index),
                        productUrl: normalizedUrl
                    };
                });
            
            console.log(`✨ Successfully scraped ${products.length} products!`);
            products.forEach((product, index) => {
                console.log(`${index + 1}. ${product.name} (ID: ${product.id}) - ${product.price} ${product.status ? `(${product.status})` : ''}`);
                if (product.productUrl) {
                    console.log(`   URL: ${product.productUrl}`);
                }
            });
            
            return products;
            
        } catch (error) {
            console.error(`❌ Error scraping Nike releases (attempt ${retryCount + 1}/${maxRetries}):`, error);
            
            if (retryCount === maxRetries - 1) {
                throw new Error(`Failed to scrape Nike releases after ${maxRetries} attempts: ${error.message}`);
            }
            
            retryCount++;
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            
        } finally {
            if (page) {
                try {
                    await page.close();
                } catch (error) {
                    console.error('Error closing page:', error);
                }
            }
            
            if (browser) {
                try {
                    await browser.close();
                } catch (error) {
                    console.error('Error closing browser:', error);
                }
            }
        }
    }
}

module.exports = { scrapeNikeReleases }; 