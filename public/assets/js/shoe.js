async function loadShoeDetails() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const shoeContainer = document.getElementById('shoe-container');

    try {
        loading.style.display = 'block';
        error.style.display = 'none';
        shoeContainer.style.display = 'none';

        const shoeId = window.location.pathname.split('/').pop();
        const response = await fetch(`/api/shoe/${shoeId}`);
        const shoe = await response.json();

        if (!response.ok) {
            throw new Error(shoe.error || 'Failed to fetch shoe details');
        }

        const statusClass = shoe.status?.toLowerCase().includes('just in') ? 'status-just-in' :
                          shoe.status?.toLowerCase().includes('coming soon') ? 'status-coming-soon' :
                          shoe.status?.toLowerCase().includes('sale') ? 'status-sale' : '';

        shoeContainer.innerHTML = `
            <div class="shoe-gallery">
                <img src="${shoe.imageUrl}" alt="${shoe.name}" class="main-image" id="mainImage">
                ${shoe.imageUrls && shoe.imageUrls.length > 1 ? `
                    <div class="thumbnail-grid">
                        ${shoe.imageUrls.map((url, index) => `
                            <img src="${url}" alt="${shoe.name} - View ${index + 1}" 
                                 class="thumbnail ${index === 0 ? 'active' : ''}"
                                 onclick="updateMainImage('${url}', this)">
                        `).join('')}
                    </div>
                ` : ''}
            </div>
            <div class="shoe-details">
                <h1 class="shoe-title">${shoe.name}</h1>
                ${shoe.status ? `<span class="status-badge ${statusClass}">${shoe.status}</span>` : ''}
                <p class="shoe-price">${shoe.price}</p>
                
                <div class="store-buttons">
                    <a href="${shoe.productUrl}" target="_blank" class="store-btn nike-btn">
                        <img src="/assets/img/icons/nike.png" alt="Nike">
                        <div class="store-info">
                            <span class="store-name">Nike</span>
                            <span class="store-price">${shoe.price}</span>
                        </div>
                    </a>
                    <a href="${shoe.stockxUrl || '#'}" target="_blank" class="store-btn stockx-btn" ${!shoe.stockxUrl ? 'style="opacity: 0.7; pointer-events: none;"' : ''}>
                        <img src="/assets/img/icons/stockx.png" alt="StockX">
                        <div class="store-info">
                            <span class="store-name">StockX</span>
                            <span class="store-price">${shoe.stockxPrice ? `$${shoe.stockxPrice}` : 'Price Unavailable'}</span>
                        </div>
                    </a>
                </div>
                
                ${shoe.status?.toLowerCase().includes('just in') ? `
                    <div class="launch-info">
                        <div class="launch-date">Launching Today</div>
                        <div class="launch-time">Available Now</div>
                        <div class="launch-buttons">
                            <a href="${shoe.productUrl}" target="_blank" class="launch-btn">
                                <img src="/assets/img/icons/nike.png" alt="Nike">
                                Buy on Nike
                            </a>
                            <a href="${shoe.productUrl}" target="_blank" class="launch-btn secondary">
                                <img src="/assets/img/icons/cart.png" alt="Cart">
                                Add to Cart
                            </a>
                        </div>
                    </div>
                ` : shoe.status?.toLowerCase().includes('coming soon') ? `
                    <div class="launch-info">
                        <div class="launch-date">Coming Soon</div>
                        <div class="launch-time">Launch Date TBA</div>
                        <div class="launch-buttons">
                            <a href="${shoe.productUrl}" target="_blank" class="launch-btn">
                                <img src="/assets/img/icons/nike.png" alt="Nike">
                                View on Nike
                            </a>
                            <button class="launch-btn secondary disabled">
                                <img src="/assets/img/icons/notify.png" alt="Notify">
                                Notify Me
                            </button>
                        </div>
                    </div>
                ` : ''}
                
                <div class="shoe-info">
                    ${shoe.description ? `
                        <div class="info-item">
                            <div class="info-label">Description</div>
                            <div class="info-value">${shoe.description}</div>
                        </div>
                    ` : ''}
                    
                    ${shoe.colorway ? `
                        <div class="info-item">
                            <div class="info-label">Colorway</div>
                            <div class="info-value">${shoe.colorway}</div>
                        </div>
                    ` : ''}
                    
                    ${shoe.style ? `
                        <div class="info-item">
                            <div class="info-label">Style Code</div>
                            <div class="info-value">${shoe.style}</div>
                        </div>
                    ` : ''}
                    
                    ${shoe.isLaunched && shoe.sizes && shoe.sizes.length > 0 ? `
                        <div class="info-item">
                            <div class="info-label">Available Sizes</div>
                            <div class="sizes-grid">
                                ${shoe.sizes.map(size => `
                                    <a href="${shoe.productUrl}" target="_blank" 
                                       class="size-button ${size.available ? 'available' : 'unavailable'}"
                                       ${!size.available ? 'onclick="return false;"' : ''}
                                       title="${size.outOfStock ? 'Out of Stock' : size.available ? 'Available' : 'Unavailable'}">
                                        ${size.size}
                                        ${size.outOfStock ? '<span class="out-of-stock-badge">OOS</span>' : ''}
                                    </a>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}
                </div>
            </div>
        `;

        shoeContainer.style.display = 'grid';
    } catch (err) {
        error.style.display = 'block';
        errorMessage.textContent = err.message;
    } finally {
        loading.style.display = 'none';
    }
}

function updateMainImage(url, thumbnail) {
    const mainImage = document.getElementById('mainImage');
    mainImage.src = url;
    
    // Update active thumbnail
    document.querySelectorAll('.thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    thumbnail.classList.add('active');
}

// Load shoe details when the page loads
document.addEventListener('DOMContentLoaded', loadShoeDetails);