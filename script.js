// Dynamically load the header and menu
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    });

fetch('menu.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('menu-container').innerHTML = data;
    });

fetch('slider.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('slider-container').innerHTML = data;
        loadTrendingMovies('week'); // Load trending for the week by default
        document.getElementById('switch-today').addEventListener('click', () => loadTrendingMovies('day'));
        document.getElementById('switch-week').addEventListener('click', () => loadTrendingMovies('week'));
    });

document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'home.html';
});

// Function to load trending movies and TV series from TMDB
function loadTrendingMovies(time_window) {
    const apiKey = 'e3afd4c89e3351edad9e875ff7a01f0c';
    const url = `https://api.themoviedb.org/3/trending/all/${time_window}?api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const slider = document.getElementById('trending-slider');
            slider.innerHTML = ''; // Clear previous content
            data.results.forEach(item => {
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('slider-item');

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500/${item.poster_path}`;
                img.alt = item.title || item.name;

                const title = document.createElement('h3');
                title.textContent = item.title || item.name;
                title.classList.add('slider-title');

                const releaseDate = document.createElement('p');
                releaseDate.textContent = item.release_date || item.first_air_date;
                releaseDate.classList.add('slider-release-date');

                const rating = document.createElement('div');
                rating.classList.add('rating-circle');
                const ratingValue = Math.round(item.vote_average * 10);
                rating.innerHTML = `<span>${ratingValue}%</span>`;
                rating.style.background = `conic-gradient(#ff4444 ${ratingValue}%, #444 ${ratingValue}%)`;

                itemDiv.appendChild(img);
                itemDiv.appendChild(title);
                itemDiv.appendChild(rating);
                itemDiv.appendChild(releaseDate);
                slider.appendChild(itemDiv);
            });

            initializeSlider(); // Initialize the slider after items are added
        })
        .catch(error => console.error('Error fetching trending data:', error));
}

// Function to initialize the slider (requires external library or custom implementation)
function initializeSlider() {
    // Add your slider initialization code here
}
