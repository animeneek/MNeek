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
        loadTrending('day'); // Load trending for today by default
        document.getElementById('today').addEventListener('change', () => loadTrending('day'));
        document.getElementById('this-week').addEventListener('change', () => loadTrending('week'));
    });

fetch('whatsnew-slider.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('whatsnew-slider-container').innerHTML = data;
        loadWhatsNew(); // Load new movies by default
    });

document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'home.html';
});

// Function to load trending movies and TV series from TMDB
function loadTrending(time_window) {
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
                releaseDate.textContent = new Date(item.release_date || item.first_air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                releaseDate.classList.add('slider-release-date');

                const rating = document.createElement('div');
                rating.classList.add('rating-circle');
                const ratingValue = Math.round(item.vote_average * 10);
                rating.innerHTML = `<span class="rating-text">${ratingValue}%</span>`;
                rating.style.background = `conic-gradient(#ff4444 ${ratingValue}%, #444 ${ratingValue}%)`;

                const innerCircle = document.createElement('div');
                innerCircle.classList.add('inner-circle');
                rating.appendChild(innerCircle);

                itemDiv.appendChild(img);
                itemDiv.appendChild(title);
                itemDiv.appendChild(rating);
                itemDiv.appendChild(releaseDate);
                slider.appendChild(itemDiv);

                // Add click event to navigate to the movie detail page
                itemDiv.addEventListener('click', function() {
                    window.location.href = `movie.html?id=${item.id}`;
                });
            });

            initializeSlider(); // Initialize the slider after items are added
        })
        .catch(error => console.error('Error fetching trending data:', error));
}

// Function to load new movies from TMDB
function loadWhatsNew() {
    const apiKey = 'e3afd4c89e3351edad9e875ff7a01f0c';
    const url = `https://api.themoviedb.org/3/movie/now_playing?api_key=${apiKey}&region=US`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const slider = document.getElementById('new-slider');
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
                releaseDate.textContent = new Date(item.release_date || item.first_air_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                releaseDate.classList.add('slider-release-date');

                const rating = document.createElement('div');
                rating.classList.add('rating-circle');
                const ratingValue = Math.round(item.vote_average * 10);
                rating.innerHTML = `<span class="rating-text">${ratingValue}%</span>`;
                rating.style.background = `conic-gradient(#ff4444 ${ratingValue}%, #444 ${ratingValue}%)`;

                const innerCircle = document.createElement('div');
                innerCircle.classList.add('inner-circle');
                rating.appendChild(innerCircle);

                itemDiv.appendChild(img);
                itemDiv.appendChild(title);
                itemDiv.appendChild(rating);
                itemDiv.appendChild(releaseDate);
                slider.appendChild(itemDiv);

                // Add click event to navigate to the movie detail page
                itemDiv.addEventListener('click', function() {
                    window.location.href = `movie.html?id=${item.id}`;
                });
            });

            initializeSlider(); // Initialize the slider after items are added
        })
        .catch(error => console.error('Error fetching new data:', error));
}

// Function to load movie details from TMDB
function loadMovieDetails(movieId) {
    const apiKey = 'e3afd4c89e3351edad9e875ff7a01f0c';
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,reviews`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
            document.getElementById('movie-title').textContent = data.title;
            document.getElementById('movie-rating').textContent = `Rating: ${data.vote_average}`;
            document.getElementById('movie-synopsis').textContent = data.overview;

            const castList = document.getElementById('movie-cast-list');
            castList.innerHTML = '';
            data.credits.cast.forEach(member => {
                const listItem = document.createElement('li');
                listItem.textContent = member.name + ' as ' + member.character;
                castList.appendChild(listItem);
            });

            const reviewsList = document.getElementById('movie-reviews-list');
            reviewsList.innerHTML = '';
            data.reviews.results.forEach(review => {
                const listItem = document.createElement('li');
                listItem.textContent = review.author + ': ' + review.content;
                reviewsList.appendChild(listItem);
            });
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Example of how to call loadMovieDetails when navigating to the movie page
// Assuming the movie ID is passed as a query parameter in the URL
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const movieId = urlParams.get('id');
if (movieId) {
    loadMovieDetails(movieId);
}

// Function to initialize the slider (requires external library or custom implementation)
function initializeSlider() {
    // Add your slider initialization code here
}
