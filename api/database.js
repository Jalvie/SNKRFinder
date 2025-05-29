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
        // Drop existing table to ensure correct schema
        db.run('DROP TABLE IF EXISTS nike_releases', (err) => {
            if (err) {
                console.error('Error dropping table:', err);
                reject(err);
                return;
            }

            // Create table with correct schema
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
                    console.error('Error creating table:', err);
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
        db.run('BEGIN TRANSACTION', (err) => {
            if (err) {
                console.error('Error starting transaction:', err);
                reject(err);
                return;
            }

            const stmt = db.prepare(`
                INSERT OR REPLACE INTO nike_releases (id, name, price, image_url, product_url, status)
                VALUES (?, ?, ?, ?, ?, ?)
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

// Get a specific shoe by ID
function getShoeById(id) {
    return new Promise((resolve, reject) => {
        if (!id || typeof id !== 'string') {
            reject(new Error('Invalid shoe ID'));
            return;
        }

        db.get(`
            SELECT id, name, price, image_url as imageUrl, product_url as productUrl, status, timestamp
            FROM nike_releases
            WHERE id = ?
        `, [id], (err, row) => {
            if (err) {
                console.error('Error getting shoe by ID:', err);
                reject(err);
            } else {
                resolve(row || null);
            }
        });
    });
}

module.exports = {
    saveReleases,
    getLatestReleases,
    getShoeById
}; 