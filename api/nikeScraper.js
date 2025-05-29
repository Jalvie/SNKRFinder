const puppeteer = require('puppeteer');

function generateShoeId(name, index) {
    // Create a URL-friendly ID from the shoe name
    const baseId = name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-') // Replace non-alphanumeric chars with hyphens
        .replace(/-+/g, '-')        // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, '');     // Remove leading/trailing hyphens
    
    // Add index to ensure uniqueness
    return `${baseId}-${index}`;
}

async function scrapeNikeReleases() {
    console.log('🚀 Launching Nike scraper...');
    
    const browser = await puppeteer.launch({
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
    console.log('🌐 Browser launched successfully!');

    try {
        const page = await browser.newPage();
        console.log('📄 New page created');
        
        // Set viewport to a reasonable size
        await page.setViewport({ width: 1280, height: 800 });
        console.log('📏 Viewport set to 1280x800');

        // Set a shorter timeout
        page.setDefaultTimeout(30000);
        console.log('⏱️ Timeout set to 30 seconds');

        // Navigate to Nike's new shoes page
        console.log('🌍 Navigating to Nike new shoes...');
        await page.goto('https://www.nike.com/w/new-shoes-3n82yzy7ok', {
            waitUntil: 'domcontentloaded',
            timeout: 30000
        });
        console.log('✅ Page loaded successfully!');

        // Wait for the product grid to load
        console.log('🔍 Looking for products...');
        await page.waitForSelector('.product-card', { timeout: 30000 });
        console.log('🎯 Found product grid!');

        // Extract only the first 12 products for faster response
        console.log('📦 Extracting product information...');
        const rawProducts = await page.evaluate(() => {
            const items = document.querySelectorAll('.product-card');
            return Array.from(items).slice(0, 12).map(item => {
                const name = item.querySelector('.product-card__title, .product-title')?.textContent?.trim() || '';
                const price = item.querySelector('.product-price, .price')?.textContent?.trim() || '';
                const imageUrl = item.querySelector('img[src*="nike"], img[src*="static.nike"]')?.src || '';
                const productUrl = item.querySelector('a[href*="/t/"], a[href*="/p/"]')?.href || '';
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

        // Add IDs to products
        const products = rawProducts.map((product, index) => ({
            ...product,
            id: generateShoeId(product.name, index)
        }));

        console.log(`✨ Successfully scraped ${products.length} products!`);
        console.log('👟 Products found:');
        products.forEach((product, index) => {
            console.log(`${index + 1}. ${product.name} (ID: ${product.id}) - ${product.price} ${product.status ? `(${product.status})` : ''}`);
        });

        return products;

    } catch (error) {
        console.error('❌ Error scraping Nike releases:', error);
        throw error;
    } finally {
        console.log('🔒 Closing browser...');
        await browser.close();
        console.log('👋 Scraper finished!');
    }
}

module.exports = { scrapeNikeReleases }; 