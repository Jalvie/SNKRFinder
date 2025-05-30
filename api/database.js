const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, '../data/nike.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('📦 Connected to SQLite database');
        initDatabase();
    }
});

// Initialize database tables
function initDatabase() {
    return new Promise((resolve, reject) => {
        // Create releases table
        db.run(`
            CREATE TABLE IF NOT EXISTS nike_releases (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                price TEXT,
                image_url TEXT,
                product_url TEXT,
                status TEXT,
                timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
            )
        `, (err) => {
            if (err) {
                console.error('Error creating releases table:', err);
                reject(err);
                return;
            }

            // Create shoe details table
            db.run(`
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
                    last_updated DATETIME DEFAULT CURRENT_TIMESTAMP,
                    FOREIGN KEY (id) REFERENCES nike_releases(id)
                )
            `, (err) => {
                if (err) {
                    console.error('Error creating shoe details table:', err);
                    reject(err);
                } else {
                    console.log('✅ Database initialized successfully');
                    resolve();
                }
            });
        });
    });
}

// Save releases to database
function saveReleases(releases) {
    return new Promise((resolve, reject) => {
        if (!Array.isArray(releases) || releases.length === 0) {
            reject(new Error('No releases to save'));
            return;
        }

        db.run('BEGIN TRANSACTION', (err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                reject(err);
                return;
            }

            const stmt = db.prepare(`
                INSERT OR REPLACE INTO nike_releases (id, name, price, image_url, product_url, status, timestamp)
                VALUES (?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
            `);

            let hasError = false;

            releases.forEach(release => {
                if (!release.id || typeof release.id !== 'string') {
                    console.error('Invalid release ID:', release);
                    hasError = true;
                    return;
                }

                stmt.run(
                    release.id,
                    release.name || '',
                    release.price || '',
                    release.imageUrl || '',
                    release.productUrl || '',
                    release.status || '',
                    (err) => {
                        if (err) {
                            console.error('Error inserting release:', err);
                            hasError = true;
                        }
                    }
                );
            });

            stmt.finalize();

            if (hasError) {
                db.run('ROLLBACK', () => {
                    reject(new Error('Failed to save some releases'));
                });
                return;
            }

            db.run('COMMIT', (err) => {
                if (err) {
                    console.error('Error committing transaction:', err);
                    db.run('ROLLBACK', () => {
                        reject(err);
                    });
                } else {
                    resolve();
                }
            });
        });
    });
}

// Save shoe details to database
function saveShoeDetails(shoeId, details) {
    return new Promise((resolve, reject) => {
        if (!shoeId || !details) {
            reject(new Error('Invalid shoe details'));
            return;
        }

        const sizes = JSON.stringify(details.sizes || []);
        const imageUrls = JSON.stringify(details.imageUrls || []);
        
        db.run(`
            INSERT OR REPLACE INTO shoe_details (
                id, name, price, image_url, image_urls, product_url, status,
                description, colorway, style, sizes, is_launched, last_updated
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
        `, [
            shoeId,
            details.name || '',
            details.price || '',
            details.imageUrl || '',
            imageUrls,
            details.productUrl || '',
            details.status || '',
            details.description || '',
            details.colorway || '',
            details.style || '',
            sizes,
            details.isLaunched ? 1 : 0
        ], (err) => {
            if (err) {
                console.error('Error saving shoe details:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Get latest releases from database
function getLatestReleases(limit = 12) {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT id, name, price, image_url as imageUrl, product_url as productUrl, status, timestamp
            FROM nike_releases
            ORDER BY timestamp DESC
            LIMIT ?
        `, [limit], (err, rows) => {
            if (err) {
                console.error('Error getting latest releases:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

// Get a specific shoe by ID with details
function getShoeById(id) {
    return new Promise((resolve, reject) => {
        if (!id || typeof id !== 'string') {
            reject(new Error('Invalid shoe ID'));
            return;
        }

        // First try exact match
        db.get(`
            SELECT 
                r.id, r.name, r.price, r.image_url as imageUrl, 
                r.product_url as productUrl, r.status, r.timestamp,
                d.description, d.colorway, d.style, d.sizes, d.image_urls as imageUrls,
                d.is_launched as isLaunched, d.last_updated
            FROM nike_releases r
            LEFT JOIN shoe_details d ON r.id = d.id
            WHERE r.id = ?
        `, [id], (err, row) => {
            if (err) {
                console.error('Error getting shoe by ID:', err);
                reject(err);
            } else if (row) {
                // Parse JSON fields
                if (row.sizes) {
                    try {
                        row.sizes = JSON.parse(row.sizes);
                    } catch (e) {
                        console.error('Error parsing sizes JSON:', e);
                        row.sizes = [];
                    }
                } else {
                    row.sizes = [];
                }
                
                if (row.imageUrls) {
                    try {
                        row.imageUrls = JSON.parse(row.imageUrls);
                    } catch (e) {
                        console.error('Error parsing imageUrls JSON:', e);
                        row.imageUrls = [];
                    }
                } else {
                    row.imageUrls = [];
                }
                
                resolve(row);
            } else {
                // If no exact match, try partial match
                db.get(`
                    SELECT 
                        r.id, r.name, r.price, r.image_url as imageUrl, 
                        r.product_url as productUrl, r.status, r.timestamp,
                        d.description, d.colorway, d.style, d.sizes, d.image_urls as imageUrls,
                        d.is_launched as isLaunched, d.last_updated
                    FROM nike_releases r
                    LEFT JOIN shoe_details d ON r.id = d.id
                    WHERE r.id LIKE ?
                    ORDER BY r.timestamp DESC
                    LIMIT 1
                `, [`${id}%`], (err, row) => {
                    if (err) {
                        console.error('Error getting shoe by partial ID:', err);
                        reject(err);
                    } else if (row) {
                        // Parse JSON fields
                        if (row.sizes) {
                            try {
                                row.sizes = JSON.parse(row.sizes);
                            } catch (e) {
                                console.error('Error parsing sizes JSON:', e);
                                row.sizes = [];
                            }
                        } else {
                            row.sizes = [];
                        }
                        
                        if (row.imageUrls) {
                            try {
                                row.imageUrls = JSON.parse(row.imageUrls);
                            } catch (e) {
                                console.error('Error parsing imageUrls JSON:', e);
                                row.imageUrls = [];
                            }
                        } else {
                            row.imageUrls = [];
                        }
                        
                        resolve(row);
                    } else {
                        resolve(null);
                    }
                });
            }
        });
    });
}

// Get shoes that need updating (older than 24 hours)
function getShoesNeedingUpdate() {
    return new Promise((resolve, reject) => {
        db.all(`
            SELECT r.id, r.product_url as productUrl
            FROM nike_releases r
            LEFT JOIN shoe_details d ON r.id = d.id
            WHERE d.last_updated IS NULL 
               OR d.last_updated < datetime('now', '-1 day')
            ORDER BY r.timestamp DESC
        `, (err, rows) => {
            if (err) {
                console.error('Error getting shoes needing update:', err);
                reject(err);
            } else {
                resolve(rows || []);
            }
        });
    });
}

// Clean up old entries (keep last 1000 entries)
function cleanupOldEntries() {
    return new Promise((resolve, reject) => {
        db.run(`
            DELETE FROM nike_releases
            WHERE id NOT IN (
                SELECT id FROM nike_releases
                ORDER BY timestamp DESC
                LIMIT 1000
            )
        `, (err) => {
            if (err) {
                console.error('Error cleaning up old entries:', err);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

// Run cleanup periodically
setInterval(() => {
    cleanupOldEntries().catch(err => {
        console.error('Error in periodic cleanup:', err);
    });
}, 24 * 60 * 60 * 1000); // Run once per day

module.exports = {
    saveReleases,
    saveShoeDetails,
    getLatestReleases,
    getShoeById,
    getShoesNeedingUpdate
}; 