function searchTMDB(query, page) {
    const apiKey = 'YOUR_TMDB_API_KEY';
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${apiKey}&query=${query}&page=${page}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            displayResults(data.results);
            setupPagination(data.page, data.total_pages, query);
        })
        .catch(error => console.error('Error fetching search results:', error));
}

function displayResults(results) {
    const resultsContainer = document.getElementById('search-results');
    resultsContainer.innerHTML = '';

    results.forEach(result => {
        const resultItem = document.createElement('div');
        resultItem.classList.add('result-item');

        const title = result.title || result.name;
        const posterPath = result.poster_path ? `https://image.tmdb.org/t/p/w500/${result.poster_path}` : 'assets/no_image.png';
        
        resultItem.innerHTML = `
            <img src="${posterPath}" alt="${title}">
            <h2>${title}</h2>
            <p>${result.overview}</p>
        `;

        resultsContainer.appendChild(resultItem);
    });
}

function setupPagination(currentPage, totalPages, query) {
    const paginationContainer = document.getElementById('pagination');
    paginationContainer.innerHTML = '';

    for (let i = 1; i <= totalPages; i++) {
        const pageButton = document.createElement('button');
        pageButton.textContent = i;
        pageButton.classList.add('page-button');
        if (i === currentPage) {
            pageButton.classList.add('active');
        }

        pageButton.addEventListener('click', function() {
            searchTMDB(query, i);
        });

        paginationContainer.appendChild(pageButton);
    }
}
