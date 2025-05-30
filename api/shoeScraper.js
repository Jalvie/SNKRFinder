const puppeteer = require('puppeteer');

function isValidUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

async function scrapeShoeDetails(shoeUrl, maxRetries = 3) {
    console.log('🚀 Starting shoe details scraper...');
    
    // Validate URL before proceeding
    if (!shoeUrl) {
        throw new Error('No URL provided');
    }
    
    if (!isValidUrl(shoeUrl)) {
        console.error('❌ Invalid URL provided:', shoeUrl);
        throw new Error(`Invalid URL: ${shoeUrl}`);
    }
    
    console.log('🔗 Valid URL:', shoeUrl);
    
    let browser = null;
    let page = null;
    let retryCount = 0;
    let lastError = null;
    
    while (retryCount < maxRetries) {
        try {
            if (page) {
                try {
                    await page.close();
                } catch (closeError) {
                    console.error('Error closing previous page:', closeError);
                }
            }
            
            if (!browser) {
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
            }
            
            page = await browser.newPage();
            
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
            await page.waitForSelector('[data-testid="product-title"], .product-title, h1', { 
                timeout: 30000,
                visible: true 
            });
            
            // Extract detailed product information
            console.log('📦 Extracting product details...');
            const details = await page.evaluate(() => {
                const name = document.querySelector('[data-testid="product-title"], .product-title, h1')?.textContent?.trim() || '';
                const price = document.querySelector('[data-testid="product-price"], .product-price, .price')?.textContent?.trim() || '';
                
                // Get all product images
                const imageSelectors = [
                    '[data-testid="hero-image"] img',
                    '.product-image',
                    'img[src*="nike"]',
                    'img[src*="static.nike"]',
                    '.gallery-image',
                    '[data-testid="gallery-image"]',
                    '.carousel-image',
                    '[data-testid="carousel-image"]'
                ];
                
                let images = new Set();
                for (const selector of imageSelectors) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(img => {
                        if (img.src && img.src.includes('nike')) {
                            // Get the highest quality image URL
                            let highResUrl = img.src;
                            
                            // Replace width and height parameters for higher quality
                            highResUrl = highResUrl.replace(/\/w_\d+,\/h_\d+/, '/w_2000,/h_2000');
                            highResUrl = highResUrl.replace(/\/c_limit/, '/c_fill');
                            
                            // Remove any quality parameters
                            highResUrl = highResUrl.replace(/\/q_\d+/, '');
                            
                            // Ensure we have a valid URL
                            if (highResUrl.startsWith('//')) {
                                highResUrl = 'https:' + highResUrl;
                            }
                            
                            // Only add if it's a valid Nike product image URL
                            if (highResUrl.includes('static.nike.com') && 
                                highResUrl.endsWith('.png') && 
                                !highResUrl.includes('misc') &&
                                !highResUrl.includes('icon') &&
                                !highResUrl.includes('logo') &&
                                !highResUrl.includes('3732c58b-d0ad-4c3c-898c-c4b90193312b')) {
                                images.add(highResUrl);
                            }
                        }
                    });
                }
                
                // Convert to array and sort by image number if present
                const imageUrls = Array.from(images).sort((a, b) => {
                    const numA = parseInt(a.match(/\/(\d+)\.png/)?.[1] || '0');
                    const numB = parseInt(b.match(/\/(\d+)\.png/)?.[1] || '0');
                    return numA - numB;
                });
                
                const mainImageUrl = imageUrls[0] || '';
                
                // Get the product URL
                const productUrl = window.location.href;
                
                const status = document.querySelector('[data-testid="product-badge"], .product-badge, .badge')?.textContent?.trim() || '';
                const isLaunched = !status.toLowerCase().includes('coming soon');
                
                // Get additional details with fallback selectors
                const description = document.querySelector('[data-testid="product-description"], .product-description, .description')?.textContent?.trim() || '';
                const colorway = document.querySelector('[data-testid="colorway-label"], .colorway-label, .colorway')?.textContent?.trim() || '';
                const style = document.querySelector('[data-testid="style-code"], .style-code, .style')?.textContent?.trim() || '';
                
                // Get available sizes with multiple selectors
                const sizeSelectors = [
                    '[data-testid="size-selector"] button',
                    '.size-selector button',
                    '.size-button',
                    '[data-testid="size-option"]',
                    '.size-option',
                    'button[data-testid*="size"]',
                    'button[class*="size"]'
                ];
                
                let sizes = [];
                for (const selector of sizeSelectors) {
                    const sizeElements = document.querySelectorAll(selector);
                    if (sizeElements.length > 0) {
                        sizes = Array.from(sizeElements).map(button => ({
                            size: button.textContent.trim(),
                            available: !button.hasAttribute('disabled') && 
                                    !button.classList.contains('disabled') &&
                                    !button.classList.contains('unavailable') &&
                                    !button.hasAttribute('aria-disabled'),
                            outOfStock: button.classList.contains('out-of-stock') ||
                                      button.getAttribute('aria-label')?.toLowerCase().includes('out of stock')
                        }));
                        break;
                    }
                }
                
                // If no sizes found, try to find any size-related elements
                if (sizes.length === 0) {
                    const allElements = document.querySelectorAll('*');
                    for (const element of allElements) {
                        const text = element.textContent.trim();
                        if (text.match(/^[0-9]+(\.[0-9]+)?$/)) {
                            sizes.push({
                                size: text,
                                available: !element.classList.contains('disabled') && 
                                         !element.classList.contains('unavailable'),
                                outOfStock: element.classList.contains('out-of-stock')
                            });
                        }
                    }
                }
                
                return {
                    name,
                    price,
                    imageUrl: mainImageUrl,
                    imageUrls,
                    productUrl,
                    status,
                    isLaunched,
                    description,
                    colorway,
                    style,
                    sizes,
                    timestamp: new Date().toISOString()
                };
            });
            
            // Validate required fields
            if (!details.name || !details.imageUrl) {
                throw new Error('Required fields missing from scraped data');
            }
            
            console.log('✅ Successfully scraped shoe details');
            if (details.sizes.length > 0) {
                console.log('👟 Available sizes:', details.sizes.map(s => `${s.size} (${s.available ? 'Available' : 'Unavailable'})`).join(', '));
            } else {
                console.log('⚠️ No sizes found');
            }
            
            return details;
            
        } catch (error) {
            console.error(`❌ Error scraping shoe details (attempt ${retryCount + 1}/${maxRetries}):`, error);
            lastError = error;
            
            if (retryCount === maxRetries - 1) {
                throw new Error(`Failed to scrape shoe details after ${maxRetries} attempts: ${lastError.message}`);
            }
            
            retryCount++;
            // Wait before retrying (exponential backoff)
            await new Promise(resolve => setTimeout(resolve, Math.pow(2, retryCount) * 1000));
            
        } finally {
            if (page) {
                try {
                    await page.close();
                    console.log('📄 Page closed successfully');
                } catch (closeError) {
                    console.error('Error closing page:', closeError);
                }
            }
        }
    }
    
    // Clean up browser if we're done
    if (browser) {
        try {
            await browser.close();
            console.log('👋 Browser closed successfully');
        } catch (closeError) {
            console.error('Error closing browser:', closeError);
        }
    }
}

module.exports = { scrapeShoeDetails }; 