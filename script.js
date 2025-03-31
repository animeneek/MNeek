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

                // Add click event to navigate to the movie or series detail page
                itemDiv.addEventListener('click', function() {
                    const mediaType = item.media_type === 'movie' ? 'movie' : 'series';
                    window.location.href = `${mediaType}.html?id=${item.id}`;
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
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=release_dates`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data || data.success === false) {
                console.error('Movie data not found:', data);
                return;
            }

            document.getElementById('movie-poster').src = data.poster_path 
                ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` 
                : 'placeholder-image.jpg';

            document.querySelector('.movie-detail-bg').style.backgroundImage = data.backdrop_path 
                ? `url(https://image.tmdb.org/t/p/w1280/${data.backdrop_path})` 
                : 'none';

            document.getElementById('movie-title').textContent = `${data.title} (${new Date(data.release_date).getFullYear()})`;
            document.getElementById('original-title').textContent = `Original Title: ${data.original_title || 'N/A'}`;
            document.getElementById('genre').textContent = data.genres.map(genre => genre.name).join(', ') || 'N/A';
            document.getElementById('movie-synopsis').textContent = data.overview || 'No synopsis available.';
            document.getElementById('status').textContent = data.status || 'N/A';
            document.getElementById('original-language').textContent = data.original_language.toUpperCase() || 'N/A';

            // Get certification (MPAA rating)
            let certification = 'N/A';
            if (data.release_dates && data.release_dates.results) {
                let usRating = data.release_dates.results.find(r => r.iso_3166_1 === 'US');
                if (usRating && usRating.release_dates.length > 0) {
                    certification = usRating.release_dates[0].certification || 'N/A';
                }
            }
            document.getElementById('certificate').textContent = certification;

            loadRecommendations(movieId, 'movie');
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Function to load series details from TMDB
function loadSeriesDetails(seriesId) {
    const apiKey = 'e3afd4c89e3351edad9e875ff7a01f0c';
    const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&append_to_response=content_ratings`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            if (!data || data.success === false) {
                console.error('Series data not found:', data);
                return;
            }

            document.getElementById('movie-poster').src = data.poster_path 
                ? `https://image.tmdb.org/t/p/w500/${data.poster_path}` 
                : 'placeholder-image.jpg';

            document.querySelector('.movie-detail-bg').style.backgroundImage = data.backdrop_path 
                ? `url(https://image.tmdb.org/t/p/w1280/${data.backdrop_path})` 
                : 'none';

            document.getElementById('movie-title').textContent = `${data.name} (${new Date(data.first_air_date).getFullYear()})`;
            document.getElementById('original-title').textContent = `Original Title: ${data.original_name || 'N/A'}`;
            document.getElementById('genre').textContent = data.genres.map(genre => genre.name).join(', ') || 'N/A';
            document.getElementById('movie-synopsis').textContent = data.overview || 'No synopsis available.';
            document.getElementById('status').textContent = data.status || 'N/A';
            document.getElementById('original-language').textContent = data.original_language.toUpperCase() || 'N/A';

            // Get content rating (TV rating)
            let certification = 'N/A';
            if (data.content_ratings && data.content_ratings.results) {
                let usRating = data.content_ratings.results.find(r => r.iso_3166_1 === 'US');
                if (usRating) {
                    certification = usRating.rating || 'N/A';
                }
            }
            document.getElementById('certificate').textContent = certification;

            loadRecommendations(seriesId, 'tv');
        })
        .catch(error => console.error('Error fetching series details:', error));
}

// Function to load recommendations for movies or series
function loadRecommendations(mediaId, type) {
    const apiKey = 'e3afd4c89e3351edad9e875ff7a01f0c';
    const url = `https://api.themoviedb.org/3/${type}/${mediaId}/recommendations?api_key=${apiKey}`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            const recommendationList = document.getElementById('recommendation-list');
            recommendationList.innerHTML = '';

            if (!data.results || data.results.length === 0) {
                recommendationList.innerHTML = '<p>No recommendations available.</p>';
                return;
            }

            data.results.forEach(recommendation => {
                const recommendationItem = document.createElement('div');
                recommendationItem.classList.add('slider-item');

                const recommendationImg = document.createElement('img');
                recommendationImg.src = recommendation.poster_path 
                    ? `https://image.tmdb.org/t/p/w500/${recommendation.poster_path}` 
                    : 'placeholder-image.jpg';
                recommendationImg.alt = recommendation.name || recommendation.title;

                const recommendationTitle = document.createElement('h3');
                recommendationTitle.textContent = recommendation.name || recommendation.title;
                recommendationTitle.classList.add('slider-title');

                recommendationItem.appendChild(recommendationImg);
                recommendationItem.appendChild(recommendationTitle);
                recommendationList.appendChild(recommendationItem);

                recommendationItem.addEventListener('click', function () {
                    window.location.href = `${type}.html?id=${recommendation.id}`;
                });
            });
        })
        .catch(error => console.error('Error fetching recommendations:', error));
}

// Check if we are on a movie or series detail page and load the appropriate details
const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const mediaId = urlParams.get('id');
const pageType = window.location.pathname.includes('movie.html') ? 'movie' : 'series';

if (mediaId) {
    if (pageType === 'movie') {
        loadMovieDetails(mediaId);
    } else {
        loadSeriesDetails(mediaId);
    }
}

// Function to initialize the slider (requires external library or custom implementation)
function initializeSlider() {
    // Add your slider initialization code here
}
