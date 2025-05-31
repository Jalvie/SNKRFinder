const puppeteer = require('puppeteer');
const { StockxClient } = require('stockx-scraper');

// Initialize StockX client
const stockxClient = new StockxClient({
    currencyCode: 'USD',
    countryCode: 'US',
    languageCode: 'EN'
});

function isValidUrl(url) {
    if (!url) return false;
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

async function findStockXUrl(shoeName) {
    try {
        console.log('🔍 Searching StockX for:', shoeName);
        const products = await stockxClient.search({
            query: shoeName
        });

        if (products && products.length > 0) {
            // Find the best match
            const bestMatch = products[0];
            console.log('✅ Found StockX match:', bestMatch.name);
            return {
                stockxUrl: bestMatch.url,
                stockxPrice: bestMatch.price,
                stockxLastSale: bestMatch.lastSale,
                stockxSales: bestMatch.sales,
                stockxName: bestMatch.name,
                stockxSku: bestMatch.sku
            };
        }
        
        console.log('❌ No StockX matches found');
        return null;
    } catch (error) {
        console.error('❌ Error searching StockX:', error);
        return null;
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

            // Wait for images to load
            console.log('⏳ Waiting for images to load...');
            await page.waitForSelector('[data-testid="hero-image"], [data-testid="gallery-image"], img[src*="nike"], img[src*="static.nike"]', {
                timeout: 30000,
                visible: true
            });
            
            // Extract detailed product information
            console.log('📦 Extracting product details...');
            const details = await page.evaluate(() => {
                // Get name with multiple selectors
                const nameSelectors = [
                    '[data-testid="product-title"]',
                    '.product-title',
                    'h1',
                    '[data-testid="product-name"]',
                    '.product-name',
                    '.product-heading'
                ];
                
                let name = '';
                for (const selector of nameSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        name = element.textContent.trim();
                        if (name) break;
                    }
                }

                // Get price with multiple selectors
                const priceSelectors = [
                    '[data-testid="product-price"]',
                    '.product-price',
                    '.price',
                    '[data-testid="price"]',
                    '.product-price-value'
                ];
                
                let price = '';
                for (const selector of priceSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        const priceText = element.textContent.trim();
                        // Extract just the price using regex
                        const priceMatch = priceText.match(/\$?\d+(\.\d{2})?/);
                        if (priceMatch) {
                            price = priceMatch[0];
                            if (!price.startsWith('$')) {
                                price = '$' + price;
                            }
                            break;
                        }
                    }
                }

                // Get all product images
                const imageSelectors = [
                    '[data-testid="hero-image"]',
                    '[data-testid="hero-image"] img',
                    '[data-testid="gallery-image"]',
                    '[data-testid="gallery-image"] img',
                    '.product-image',
                    'img[src*="nike"]',
                    'img[src*="static.nike"]',
                    '.gallery-image',
                    '[data-testid="gallery-image"]',
                    '.carousel-image',
                    '[data-testid="carousel-image"]',
                    '.product-image img',
                    '.product-gallery img',
                    '.product-gallery-image img',
                    '.product-hero-image img',
                    '.product-detail-image img',
                    '.product-detail-gallery img',
                    '.product-detail-hero img',
                    '.product-detail-carousel img',
                    '.product-detail-slider img',
                    '.product-detail-thumbnail img',
                    '.product-detail-main img',
                    '.product-detail-zoom img',
                    'picture source[srcset*="nike"]',
                    'picture source[srcset*="static.nike"]',
                    'source[srcset*="nike"]',
                    'source[srcset*="static.nike"]'
                ];
                
                let images = new Set();
                for (const selector of imageSelectors) {
                    const elements = document.querySelectorAll(selector);
                    elements.forEach(element => {
                        // Handle both img elements and source elements
                        let imageUrl = '';
                        if (element.tagName === 'IMG') {
                            imageUrl = element.src;
                        } else if (element.tagName === 'SOURCE') {
                            imageUrl = element.srcset;
                        } else if (element.hasAttribute('srcset')) {
                            imageUrl = element.srcset;
                        } else if (element.hasAttribute('src')) {
                            imageUrl = element.src;
                        } else if (element.hasAttribute('data-src')) {
                            imageUrl = element.getAttribute('data-src');
                        } else if (element.hasAttribute('data-srcset')) {
                            imageUrl = element.getAttribute('data-srcset');
                        } else if (element.hasAttribute('style')) {
                            // Try to extract URL from background-image in style
                            const style = element.getAttribute('style');
                            const match = style.match(/url\(['"]?([^'"()]+)['"]?\)/);
                            if (match) {
                                imageUrl = match[1];
                            }
                        }

                        if (imageUrl) {
                            // Handle srcset format (multiple URLs with sizes)
                            const urls = imageUrl.split(',').map(url => {
                                const [urlPart] = url.trim().split(' ');
                                return urlPart;
                            });

                            urls.forEach(url => {
                                if (url && url.includes('nike')) {
                                    // Get the highest quality image URL
                                    let highResUrl = url;
                                    
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
                                        (highResUrl.endsWith('.png') || highResUrl.endsWith('.jpg')) && 
                                        !highResUrl.includes('misc') &&
                                        !highResUrl.includes('icon') &&
                                        !highResUrl.includes('logo') &&
                                        !highResUrl.includes('3732c58b-d0ad-4c3c-898c-c4b90193312b')) {
                                        images.add(highResUrl);
                                    }
                                }
                            });
                        }
                    });
                }

                // If no images found, try to find any image URLs in the page
                if (images.size === 0) {
                    const allElements = document.querySelectorAll('*');
                    for (const element of allElements) {
                        const html = element.outerHTML;
                        const matches = html.match(/https:\/\/static\.nike\.com\/[^"'\s]+\.(png|jpg)/g) || [];
                        matches.forEach(url => {
                            if (!url.includes('misc') && 
                                !url.includes('icon') && 
                                !url.includes('logo') && 
                                !url.includes('3732c58b-d0ad-4c3c-898c-c4b90193312b')) {
                                images.add(url);
                            }
                        });
                    }
                }
                
                // Convert to array and sort by image number if present
                const imageUrls = Array.from(images).sort((a, b) => {
                    const numA = parseInt(a.match(/\/(\d+)\.(png|jpg)/)?.[1] || '0');
                    const numB = parseInt(b.match(/\/(\d+)\.(png|jpg)/)?.[1] || '0');
                    return numA - numB;
                });
                
                const mainImageUrl = imageUrls[0] || '';

                // Get the product URL
                const productUrl = window.location.href;
                
                // Get status with multiple selectors
                const statusSelectors = [
                    '[data-testid="product-badge"]',
                    '.product-badge',
                    '.badge',
                    '[data-testid="status"]',
                    '.product-status'
                ];
                
                let status = '';
                for (const selector of statusSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        status = element.textContent.trim();
                        if (status) break;
                    }
                }
                
                const isLaunched = !status.toLowerCase().includes('coming soon');
                
                // Get description with multiple selectors
                const descriptionSelectors = [
                    '[data-testid="product-description"]',
                    '.product-description',
                    '.description',
                    '[data-testid="description"]',
                    '.product-details'
                ];
                
                let description = '';
                for (const selector of descriptionSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        description = element.textContent.trim();
                        if (description) break;
                    }
                }
                
                // Get colorway with multiple selectors
                const colorwaySelectors = [
                    '[data-testid="colorway-label"]',
                    '.colorway-label',
                    '.colorway',
                    '[data-testid="color"]',
                    '.product-color'
                ];
                
                let colorway = '';
                for (const selector of colorwaySelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        colorway = element.textContent.trim();
                        if (colorway) break;
                    }
                }
                
                // Get style with multiple selectors
                const styleSelectors = [
                    '[data-testid="style-code"]',
                    '.style-code',
                    '.style',
                    '[data-testid="style"]',
                    '.product-style'
                ];
                
                let style = '';
                for (const selector of styleSelectors) {
                    const element = document.querySelector(selector);
                    if (element) {
                        style = element.textContent.trim();
                        if (style) break;
                    }
                }
                
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

                // Log what we found
                console.log('Found details:', {
                    name: name || 'Not found',
                    price: price || 'Not found',
                    imageUrl: mainImageUrl || 'Not found',
                    status: status || 'Not found',
                    imageCount: imageUrls.length,
                    imageUrls: imageUrls
                });
                
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
            
            // Find StockX URL for the shoe
            if (details.name) {
                console.log('🔍 Looking up StockX URL...');
                const stockxInfo = await findStockXUrl(details.name);
                if (stockxInfo) {
                    // Merge StockX info with existing details
                    Object.assign(details, stockxInfo);
                }
            }
            
            // Validate required fields
            if (!details.name || !details.imageUrl) {
                console.error('Missing required fields:', {
                    name: details.name || 'Missing',
                    imageUrl: details.imageUrl || 'Missing',
                    imageCount: details.imageUrls?.length || 0,
                    imageUrls: details.imageUrls
                });
                throw new Error('Required fields missing from scraped data');
            }
            
            console.log('✅ Successfully scraped shoe details');
            if (details.sizes.length > 0) {
                console.log('👟 Available sizes:', details.sizes.map(s => `${s.size} (${s.available ? 'Available' : 'Unavailable'})`).join(', '));
            } else {
                console.log('⚠️ No sizes found');
            }
            
            // Add timestamp
            details.last_updated = new Date().toISOString();
            
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