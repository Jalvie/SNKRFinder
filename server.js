const express = require("express");
const NodeCache = require('node-cache');
const { scrapeNikeReleases } = require('./api/nikeScraper');
const { scrapeShoeDetails } = require('./api/shoeScraper');
const { saveReleases, saveShoeDetails, getLatestReleases, getShoeById, getShoesNeedingUpdate } = require('./api/database');
const path = require('path');

const port = process.env.PORT || 3000;
const app = express();

// Initialize cache with 3 hours TTL
const cache = new NodeCache({ 
    stdTTL: 60 * 60 * 3, // 3 hours
    checkperiod: 60 * 5, // Check for expired keys every 5 minutes
    useClones: false // Store references instead of cloning objects
});

// Serve static files with correct MIME types
app.use(express.static(path.join(__dirname, 'public'), {
    setHeaders: (res, path) => {
        if (path.endsWith('.css')) {
            res.setHeader('Content-Type', 'text/css');
        }
    }
}));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Server error:', err);
    res.status(500).json({ 
        error: 'Internal server error',
        message: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Function to update shoe details
async function updateShoeDetails() {
    try {
        console.log('🔄 Starting daily shoe details update...');
        const shoesToUpdate = await getShoesNeedingUpdate();
        console.log(`📦 Found ${shoesToUpdate.length} shoes needing update`);

        for (const shoe of shoesToUpdate) {
            try {
                console.log(`🔍 Updating details for shoe: ${shoe.id}`);
                const details = await scrapeShoeDetails(shoe.productUrl);
                await saveShoeDetails(shoe.id, details);
                console.log(`✅ Updated details for shoe: ${shoe.id}`);
                
                // Wait a bit between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 2000));
            } catch (error) {
                console.error(`❌ Error updating shoe ${shoe.id}:`, error);
            }
        }
        
        console.log('✨ Daily update completed');
    } catch (error) {
        console.error('❌ Error in daily update:', error);
    }
}

// Run daily update at midnight
function scheduleDailyUpdate() {
    const now = new Date();
    const night = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate() + 1, // tomorrow
        0, 0, 0 // midnight
    );
    const msToMidnight = night.getTime() - now.getTime();

    setTimeout(() => {
        updateShoeDetails();
        // Schedule next update
        setInterval(updateShoeDetails, 24 * 60 * 60 * 1000);
    }, msToMidnight);
}

// Start daily update scheduler
scheduleDailyUpdate();

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
        
        if (!releases || releases.length === 0) {
            throw new Error('No releases found');
        }
        
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
            if (dbReleases && dbReleases.length > 0) {
                return res.json(dbReleases);
            }
        } catch (dbError) {
            console.error('Database fallback failed:', dbError);
        }
        
        res.status(500).json({ 
            error: 'Failed to fetch Nike releases',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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
        
        if (!requestedId) {
            return res.status(400).json({ error: 'Shoe ID is required' });
        }
        
        console.log(`🔍 Looking up shoe: ${requestedId}`);
        
        // Try to get the shoe from the database first
        let shoe = await getShoeById(requestedId);
        
        if (!shoe) {
            console.log('🔄 Shoe not found in database, checking cache...');
            // If not in database, try to get from cache
            const cachedData = cache.get('nike-releases');
            if (cachedData) {
                const cachedShoe = cachedData.find(s => s.id.startsWith(requestedId));
                if (cachedShoe) {
                    console.log('📦 Found shoe in cache');
                    shoe = cachedShoe;
                }
            }
            
            if (!shoe) {
                console.log('🔍 Shoe not found in cache, scraping new data...');
                // If not in cache, scrape new data
                const releases = await scrapeNikeReleases();
                await saveReleases(releases);
                cache.set('nike-releases', releases);
                
                shoe = releases.find(s => s.id.startsWith(requestedId));
                if (!shoe) {
                    console.log(`❌ No shoe found with ID: ${requestedId}`);
                    return res.status(404).json({ 
                        error: 'Shoe not found',
                        message: `No shoe found with ID starting with: ${requestedId}`
                    });
                }
            }
        }

        // Check if we need to update the details
        const needsUpdate = !shoe.last_updated || 
            (new Date() - new Date(shoe.last_updated)) > 24 * 60 * 60 * 1000;

        if (needsUpdate && shoe.productUrl) {
            console.log('🔄 Updating shoe details...');
            console.log('🔗 Using URL:', shoe.productUrl);
            try {
                const details = await scrapeShoeDetails(shoe.productUrl);
                await saveShoeDetails(shoe.id, details);
                shoe = { ...shoe, ...details };
                console.log('✅ Updated shoe details');
            } catch (error) {
                console.error('❌ Error updating shoe details:', error);
                // Continue with existing details if update fails
            }
        }

        console.log(`✅ Successfully retrieved shoe: ${requestedId}`);
        res.json(shoe);
    } catch (error) {
        console.error('Error fetching shoe details:', error);
        res.status(500).json({ 
            error: 'Failed to fetch shoe details',
            message: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
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