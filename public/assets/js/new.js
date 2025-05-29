async function fetchReleases() {
    const loading = document.getElementById('loading');
    const error = document.getElementById('error');
    const errorMessage = document.getElementById('errorMessage');
    const products = document.getElementById('products');

    try {
        loading.style.display = 'block';
        error.style.display = 'none';
        products.innerHTML = '';

        const response = await fetch('/api/nike-releases');
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to fetch releases');
        }

        data.forEach(product => {
            const card = document.createElement('div');
            card.className = 'product-card';
            
            const statusClass = product.status?.toLowerCase().includes('just in') ? 'status-just-in' :
                              product.status?.toLowerCase().includes('coming soon') ? 'status-coming-soon' :
                              product.status?.toLowerCase().includes('sale') ? 'status-sale' : '';

            card.innerHTML = `
                ${product.status ? `<span class="status-badge ${statusClass}">${product.status}</span>` : ''}
                <img src="${product.imageUrl}" alt="${product.name}" class="product-image">
                <div>
                    <h3 class="product-title">${product.name}</h3>
                    <p class="product-price">${product.price}</p>
                    <div class="store-buttons">
                        <a href="/shoe/${product.id}" class="view-btn">
                            View Details
                        </a>
                    <a href="${product.productUrl}" target="_blank" class="view-btn">
                        View on Nike
                    </a>
                    </div>
                </div>
            `;
            products.appendChild(card);
        });
    } catch (err) {
        error.style.display = 'block';
        errorMessage.textContent = err.message;
    } finally {
        loading.style.display = 'none';
    }
}

// Initial load
document.addEventListener('DOMContentLoaded', fetchReleases);