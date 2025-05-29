const express = require("express");
const NodeCache = require('node-cache');
const { scrapeNikeReleases } = require('./api/nikeScraper');
const { scrapeShoeDetails } = require('./api/shoeScraper');
const { saveReleases, getLatestReleases, getShoeById } = require('./api/database');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

// Initialize cache with 3 hours TTL
const cache = new NodeCache({ stdTTL: 60 * 60 * 3 });

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Endpoint to get Nike releases
app.get('/api/nike-releases', async (req, res) => {
    try {
        // Check cache first
        const cachedData = cache.get('nike-releases');
        if (cachedData) {
            console.log('📦 Serving from cache');
            return res.json(cachedData);
        }

        // If not in cache, scrape new data
        console.log('🔍 Scraping new data');
        const releases = await scrapeNikeReleases();
        
        // Save to database
        await saveReleases(releases);
        console.log('💾 Saved to database');

        // Update cache
        cache.set('nike-releases', releases);
        console.log('📦 Updated cache');

        res.json(releases);
    } catch (error) {
        console.error('Error fetching Nike releases:', error);
        
        // If scraping fails, try to get data from database
        try {
            console.log('🔄 Falling back to database');
            const dbReleases = await getLatestReleases();
            if (dbReleases.length > 0) {
                return res.json(dbReleases);
            }
        } catch (dbError) {
            console.error('Database fallback failed:', dbError);
        }
        
        res.status(500).json({ error: 'Failed to fetch Nike releases' });
    }
});

// Route for viewing individual shoes
app.get('/shoe/:id', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'shoe.html'));
});

// API endpoint for getting a specific shoe
app.get('/api/shoe/:id', async (req, res) => {
    try {
        const requestedId = req.params.id;
        
        // Try to get the shoe from the database first
        console.log('🔍 Looking up shoe in database...');
        let shoe = await getShoeById(requestedId);
        
        if (!shoe) {
            // If not in database, try to get from cache
            console.log('🔄 Shoe not found in database, checking cache...');
            const cachedData = cache.get('nike-releases');
            if (cachedData) {
                // Try to find a shoe where the ID starts with the requested ID
                const cachedShoe = cachedData.find(s => s.id.startsWith(requestedId));
                if (cachedShoe) {
                    console.log('📦 Found shoe in cache');
                    shoe = cachedShoe;
                }
            }
            
            if (!shoe) {
                // If not in cache, scrape new data
                console.log('🔍 Shoe not found in cache, scraping new data...');
                const releases = await scrapeNikeReleases();
                await saveReleases(releases);
                cache.set('nike-releases', releases);
                
                // Try to find a shoe where the ID starts with the requested ID
                shoe = releases.find(s => s.id.startsWith(requestedId));
                if (!shoe) {
                    return res.status(404).json({ error: 'Shoe not found' });
                }
            }
        }

        // Get detailed information for the shoe
        console.log('🔍 Fetching detailed shoe information...');
        const details = await scrapeShoeDetails(shoe.productUrl);
        
        // Combine basic and detailed information
        const fullDetails = {
            ...shoe,
            ...details
        };
        
        res.json(fullDetails);
    } catch (error) {
        console.error('Error fetching shoe details:', error);
        res.status(500).json({ error: 'Failed to fetch shoe details' });
    }
});

// Serve favicon
app.get('/favicon.ico', (req, res) => {
    res.redirect('/assets/img/misc/airforceshoes.png');
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Server running at http://localhost:${port}`);
});