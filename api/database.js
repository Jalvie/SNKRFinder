const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Ensure data directory exists
const dataDir = path.join(__dirname, '../data');
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

// Read SQL files
let schemaSql, queriesSql;
try {
    schemaSql = fs.readFileSync(path.join(__dirname, 'sql/schema.sql'), 'utf8');
    queriesSql = fs.readFileSync(path.join(__dirname, 'sql/queries.sql'), 'utf8');
} catch (error) {
    console.error('Error reading SQL files:', error);
    process.exit(1);
}

// Parse queries into an object
const queries = {};
try {
    console.log('📝 Parsing SQL queries...');
    const queryBlocks = queriesSql.split(';').filter(block => block.trim());
    queryBlocks.forEach(block => {
        const trimmed = block.trim();
        if (trimmed) {
            const commentMatch = trimmed.match(/^--\s*(.+)/);
            if (commentMatch) {
                const comment = commentMatch[1];
                const query = trimmed.replace(/^--.+\n/, '').trim();
                const key = comment.toLowerCase().replace(/\s+/g, '_');
                queries[key] = query;
                console.log(`✅ Parsed query: ${key}`);
            }
        }
    });
    console.log('📦 Successfully parsed all queries');
} catch (error) {
    console.error('❌ Error parsing SQL queries:', error);
    process.exit(1);
}

// Validate required queries
const requiredQueries = [
    'save_releases',
    'save_shoe_details',
    'get_latest_releases',
    'get_shoe_by_id_exact_match',
    'get_shoe_by_id_partial_match',
    'get_shoes_needing_update',
    'cleanup_old_entries'
];

const missingQueries = requiredQueries.filter(query => !queries[query]);
if (missingQueries.length > 0) {
    console.error('❌ Missing required queries:', missingQueries);
    process.exit(1);
}

// Create database connection
const db = new sqlite3.Database(path.join(__dirname, '../data/nike.db'), (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
        process.exit(1);
    } else {
        console.log('📦 Connected to SQLite database');
        initDatabase().catch(err => {
            console.error('Error initializing database:', err);
            process.exit(1);
        });
    }
});

// Initialize database tables
function initDatabase() {
    return new Promise((resolve, reject) => {
        db.exec(schemaSql, (err) => {
            if (err) {
                console.error('Error initializing database:', err);
                reject(err);
            } else {
                console.log('✅ Database initialized successfully');
                resolve();
            }
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

            const stmt = db.prepare(queries.save_releases);

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
        
        db.run(queries.save_shoe_details, [
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
            details.isLaunched ? 1 : 0,
            details.stockxUrl || '',
            details.stockxPrice || '',
            details.stockxLastSale || '',
            details.stockxSales || '',
            details.stockxName || '',
            details.stockxSku || ''
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
        db.all(queries.get_latest_releases, [limit], (err, rows) => {
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
            console.error('Invalid shoe ID:', id);
            reject(new Error('Invalid shoe ID'));
            return;
        }

        console.log('🔍 Querying database for shoe:', id);

        // First try exact match
        db.get(queries.get_shoe_by_id_exact_match, [id], (err, row) => {
            if (err) {
                console.error('Error getting shoe by ID:', err);
                reject(err);
                return;
            }

            if (row) {
                console.log('✅ Found exact match in database');
                try {
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
                } catch (error) {
                    console.error('Error processing database row:', error);
                    reject(error);
                }
            } else {
                console.log('🔄 No exact match, trying partial match');
                // If no exact match, try partial match
                db.get(queries.get_shoe_by_id_partial_match, [`${id}%`], (err, row) => {
                    if (err) {
                        console.error('Error getting shoe by partial ID:', err);
                        reject(err);
                        return;
                    }

                    if (row) {
                        console.log('✅ Found partial match in database');
                        try {
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
                        } catch (error) {
                            console.error('Error processing database row:', error);
                            reject(error);
                        }
                    } else {
                        console.log('❌ No matches found in database');
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
        db.all(queries.get_shoes_needing_update, (err, rows) => {
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
        db.run(queries.cleanup_old_entries, (err) => {
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