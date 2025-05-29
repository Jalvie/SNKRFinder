document.addEventListener('DOMContentLoaded', () => {
    const searchForm = document.querySelector('.search-form');
    searchForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const query = searchForm.querySelector('input').value;
        if (query) {
            window.location.href = `/search?q=${encodeURIComponent(query)}`;
        }
    });
});