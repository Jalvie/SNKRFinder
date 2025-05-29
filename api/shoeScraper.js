const puppeteer = require('puppeteer');

async function scrapeShoeDetails(shoeUrl, maxRetries = 3) {
    console.log('🚀 Starting shoe details scraper...');
    
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

    let retryCount = 0;
    
    while (retryCount < maxRetries) {
        try {
            const page = await browser.newPage();
            
            // Set viewport and user agent
            await page.setViewport({ width: 1280, height: 800 });
            await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

            // Set longer timeout
            page.setDefaultTimeout(60000); // 60 seconds

            // Navigate to the shoe's page with more lenient wait conditions
            console.log(`🔗 Navigating to shoe page (attempt ${retryCount + 1}/${maxRetries})...`);
            await page.goto(shoeUrl, {
                waitUntil: ['domcontentloaded', 'networkidle2'],
                timeout: 60000
            });

            // Wait for the product details to load with a more specific selector
            console.log('⏳ Waiting for product details...');
            await page.waitForSelector('[data-testid="product-title"], .product-title', { 
                timeout: 30000,
                visible: true 
            });

            // Extract detailed product information
            console.log('📦 Extracting product details...');
            const details = await page.evaluate(() => {
                const name = document.querySelector('[data-testid="product-title"], .product-title, h1')?.textContent?.trim() || '';
                const price = document.querySelector('[data-testid="product-price"], .product-price, .price')?.textContent?.trim() || '';
                const imageUrl = document.querySelector('img[src*="nike"], img[src*="static.nike"], [data-testid="hero-image"] img, .product-image')?.src || '';
                const status = document.querySelector('[data-testid="product-badge"], .product-badge, .badge')?.textContent?.trim() || '';
                
                // Get additional details with fallback selectors
                const description = document.querySelector('[data-testid="product-description"], .product-description, .description')?.textContent?.trim() || '';
                const colorway = document.querySelector('[data-testid="colorway-label"], .colorway-label, .colorway')?.textContent?.trim() || '';
                const style = document.querySelector('[data-testid="style-code"], .style-code, .style')?.textContent?.trim() || '';
                
                // Get available sizes with fallback selectors
                const sizes = Array.from(document.querySelectorAll('[data-testid="size-selector"] button, .size-selector button, .size-button'))
                    .map(button => ({
                        size: button.textContent.trim(),
                        available: !button.hasAttribute('disabled')
                    }));

                return {
                    name,
                    price,
                    imageUrl,
                    status,
                    description,
                    colorway,
                    style,
                    sizes,
                    timestamp: new Date().toISOString()
                };
            });

            console.log('✅ Successfully scraped shoe details');
            return details;

        } catch (error) {
            console.error(`❌ Error scraping shoe details (attempt ${retryCount + 1}/${maxRetries}):`, error);
            
            if (retryCount === maxRetries - 1) {
                throw new Error(`Failed to scrape shoe details after ${maxRetries} attempts: ${error.message}`);
            }
            
            retryCount++;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
        } finally {
            await browser.close();
            console.log('👋 Scraper finished');
        }
    }
}

module.exports = { scrapeShoeDetails }; 