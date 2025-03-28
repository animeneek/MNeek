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
        loadTrendingMovies(); // Load trending movies after slider is added
    });

document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'home.html';
});

// Function to load trending movies from TMDB
function loadTrendingMovies() {
    const apiKey = 'e3afd4c89e3351edad9e875ff7a01f0c';
    const url = `https://api.themoviedb.org/3/trending/movie/week?api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const slider = document.getElementById('trending-slider');
            data.results.forEach(movie => {
                const movieDiv = document.createElement('div');
                movieDiv.classList.add('slider-item');

                const img = document.createElement('img');
                img.src = `https://image.tmdb.org/t/p/w500/${movie.poster_path}`;
                img.alt = movie.title;

                movieDiv.appendChild(img);
                slider.appendChild(movieDiv);
            });

            initializeSlider(); // Initialize the slider after movies are added
        })
        .catch(error => console.error('Error fetching trending movies:', error));
}

// Function to initialize the slider (requires external library or custom implementation)
function initializeSlider() {
    // Add your slider initialization code here
}
