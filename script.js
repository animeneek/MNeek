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
    const url = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&append_to_response=credits,reviews`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
            document.querySelector('.movie-detail-bg').style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280/${data.backdrop_path})`;
            document.getElementById('movie-title').textContent = `${data.title} (${new Date(data.release_date).getFullYear()})`;
            document.getElementById('certificate').textContent = data.certification || 'N/A';
            document.getElementById('original-title').textContent = data.original_title;
            document.getElementById('genre').textContent = data.genres.map(genre => genre.name).join(', ');
            document.getElementById('movie-synopsis').textContent = data.overview;
            document.getElementById('original-name').textContent = data.original_title;
            document.getElementById('status').textContent = data.status;
            document.getElementById('original-language').textContent = data.original_language;

            const recommendationsUrl = `https://api.themoviedb.org/3/movie/${movieId}/recommendations?api_key=${apiKey}`;
            fetch(recommendationsUrl)
                .then(response => response.json())
                .then(recommendationsData => {
                    const recommendationList = document.getElementById('recommendation-list');
                    recommendationList.innerHTML = ''; // Clear previous content
                    recommendationsData.results.forEach(recommendation => {
                        const recommendationItem = document.createElement('div');
                        recommendationItem.classList.add('slider-item');

                        const recommendationImg = document.createElement('img');
                        recommendationImg.src = `https://image.tmdb.org/t/p/w500/${recommendation.poster_path}`;
                        recommendationImg.alt = recommendation.title || recommendation.name;

                        const recommendationTitle = document.createElement('h3');
                        recommendationTitle.textContent = recommendation.title || recommendation.name;
                        recommendationTitle.classList.add('slider-title');

                        recommendationItem.appendChild(recommendationImg);
                        recommendationItem.appendChild(recommendationTitle);
                        recommendationList.appendChild(recommendationItem);
                    });
                })
                .catch(error => console.error('Error fetching recommendations:', error));
        })
        .catch(error => console.error('Error fetching movie details:', error));
}

// Function to load series details from TMDB
function loadSeriesDetails(seriesId) {
    const apiKey = 'e3afd4c89e3351edad9e875ff7a01f0c';
    const url = `https://api.themoviedb.org/3/tv/${seriesId}?api_key=${apiKey}&append_to_response=credits,reviews`;

    fetch(url)
        .then(response => response.json())
        .then(data => {
            document.getElementById('movie-poster').src = `https://image.tmdb.org/t/p/w500/${data.poster_path}`;
            document.querySelector('.movie-detail-bg').style.backgroundImage = `url(https://image.tmdb.org/t/p/w1280/${data.backdrop_path})`;
            document.getElementById('movie-title').textContent = `${data.name} (${new Date(data.first_air_date).getFullYear()})`;
            document.getElementById('certificate').textContent = data.certification || 'N/A';
            document.getElementById('original-title').textContent = data.original_name;
            document.getElementById('genre').textContent = data.genres.map(genre => genre.name).join(', ');
            document.getElementById('movie-synopsis').textContent = data.overview;
            document.getElementById('original-name').textContent = data.original_name;
            document.getElementById('status').textContent = data.status;
            document.getElementById('original-language').textContent = data.original_language;

            const recommendationsUrl = `https://api.themoviedb.org/3/tv/${seriesId}/recommendations?api_key=${apiKey}`;
            fetch(recommendationsUrl)
                .then(response => response.json())
                .then(recommendationsData => {
                    const recommendationList = document.getElementById('recommendation-list');
                    recommendationList.innerHTML = ''; // Clear previous content
                    recommendationsData.results.forEach(recommendation => {
                        const recommendationItem = document.createElement('div');
                        recommendationItem.classList.add('slider-item');

                        const recommendationImg = document.createElement('img');
                        recommendationImg.src = `https://image.tmdb.org/t/p/w500/${recommendation.poster_path}`;
                        recommendationImg.alt = recommendation.name || recommendation.title;

                        const recommendationTitle = document.createElement('h3');
                        recommendationTitle.textContent = recommendation.name || recommendation.title;
                        recommendationTitle.classList.add('slider-title');

                        recommendationItem.appendChild(recommendationImg);
                        recommendationItem.appendChild(recommendationTitle);
                        recommendationList.appendChild(recommendationItem);
                    });
                })
                .catch(error => console.error('Error fetching recommendations:', error));
        })
        .catch(error => console.error('Error fetching series details:', error));
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
