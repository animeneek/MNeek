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

document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'home.html';
});

// TMDB API Key
const apiKey = 'YOUR_TMDB_API_KEY'; // Replace with your actual TMDB API key

// Elements
const todayButton = document.getElementById('today-button');
const weekButton = document.getElementById('week-button');
const trendingSlider = document.getElementById('trending-slider');

// Fetch trending data and update slider
function fetchTrendingData(timeWindow) {
    const url = `https://api.themoviedb.org/3/trending/all/${timeWindow}?api_key=${apiKey}`;
    fetch(url)
        .then(response => response.json())
        .then(data => updateTrendingSlider(data.results))
        .catch(error => console.error('Error fetching trending data:', error));
}

// Update trending slider with fetched data
function updateTrendingSlider(items) {
    trendingSlider.innerHTML = '';
    items.forEach(item => {
        const trendingItem = document.createElement('div');
        trendingItem.classList.add('trending-item');
        trendingItem.innerHTML = `
            <img src="https://image.tmdb.org/t/p/w500${item.poster_path}" alt="${item.title || item.name}">
            <div class="title">${item.title || item.name}</div>
        `;
        trendingSlider.appendChild(trendingItem);
    });
}

// Event listeners for buttons
todayButton.addEventListener('click', () => {
    todayButton.classList.add('active');
    weekButton.classList.remove('active');
    fetchTrendingData('day');
});

weekButton.addEventListener('click', () => {
    weekButton.classList.add('active');
    todayButton.classList.remove('active');
    fetchTrendingData('week');
});

// Initial fetch for today's trending data
fetchTrendingData('day');
