// TMDB API Key
const TMDB_API_KEY = 'e3afd4c89e3351edad9e875ff7a01f0c';

// Fetch wrapper
async function fetchTMDB(url) {
  try {
    const response = await fetch(`https://api.themoviedb.org/3/${url}?api_key=${TMDB_API_KEY}`);
    return await response.json();
  } catch (error) {
    console.error('Error fetching from TMDB:', error);
    return null;
  }
}

// Search functionality
async function performSearch(query) {
  if (!query.trim()) return [];
  
  const movies = await fetchTMDB(`search/movie?query=${encodeURIComponent(query)}`);
  const tvShows = await fetchTMDB(`search/tv?query=${encodeURIComponent(query)}`);
  
  return {
    movies: movies?.results || [],
    tvShows: tvShows?.results || []
  };
}

// Initialize search
function initSearch() {
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  
  if (!searchInput || !searchResults) return;
  
  let timeout;
  
  searchInput.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(async () => {
      const query = searchInput.value.trim();
      if (query.length < 2) {
        searchResults.classList.add('hidden');
        return;
      }
      
      const results = await performSearch(query);
      displaySearchResults(results);
      searchResults.classList.remove('hidden');
    }, 300);
  });
  
  // Hide results when clicking outside
  document.addEventListener('click', (e) => {
    if (!searchResults.contains(e.target) && e.target !== searchInput) {
      searchResults.classList.add('hidden');
    }
  });
}

// Display search results
function displaySearchResults(results) {
  const searchResults = document.getElementById('searchResults');
  if (!searchResults) return;
  
  let html = '';
  
  if (results.movies.length > 0) {
    html += `<div class="mb-4">
      <h3 class="text-sm font-semibold mb-2 text-gray-400">Movies</h3>
      <div class="space-y-2">`;
    
    results.movies.slice(0, 5).forEach(movie => {
      html += `<a href="details.html?id=${movie.id}&type=movie" class="flex items-center p-2 hover:bg-darkest rounded transition">
        <img src="${movie.poster_path ? `https://image.tmdb.org/t/p/w92${movie.poster_path}` : 'https://via.placeholder.com/92x138'}" 
             alt="${movie.title}" 
             class="w-10 h-14 object-cover rounded mr-3">
        <div>
          <h4 class="font-medium">${movie.title}</h4>
          <p class="text-xs text-gray-400">${movie.release_date ? movie.release_date.substring(0, 4) : ''}</p>
        </div>
      </a>`;
    });
    
    html += `</div></div>`;
  }
  
  if (results.tvShows.length > 0) {
    html += `<div>
      <h3 class="text-sm font-semibold mb-2 text-gray-400">TV Shows</h3>
      <div class="space-y-2">`;
    
    results.tvShows.slice(0, 5).forEach(show => {
      html += `<a href="details.html?id=${show.id}&type=tv" class="flex items-center p-2 hover:bg-darkest rounded transition">
        <img src="${show.poster_path ? `https://image.tmdb.org/t/p/w92${show.poster_path}` : 'https://via.placeholder.com/92x138'}" 
             alt="${show.name}" 
             class="w-10 h-14 object-cover rounded mr-3">
        <div>
          <h4 class="font-medium">${show.name}</h4>
          <p class="text-xs text-gray-400">${show.first_air_date ? show.first_air_date.substring(0, 4) : ''}</p>
        </div>
      </a>`;
    });
    
    html += `</div></div>`;
  }
  
  if (!html) {
    html = `<div class="p-4 text-center text-gray-400">No results found</div>`;
  }
  
  searchResults.innerHTML = html;
}

// Initialize hero slider
let currentSlide = 0;
let slideInterval;

async function initHeroSlider() {
  const slider = document.getElementById('heroSlider');
  if (!slider) return;
  
  const { results } = await fetchTMDB('trending/movie/day');
  if (!results || results.length === 0) return;
  
  // Create slides
  results.slice(0, 5).forEach((movie, index) => {
    const slide = document.createElement('div');
    slide.className = `hero-slide ${index === 0 ? 'opacity-100' : 'opacity-0'}`;
    slide.dataset.index = index;
    
    slide.innerHTML = `
      <img src="https://image.tmdb.org/t/p/original${movie.backdrop_path}" 
           alt="${movie.title}" 
           class="hero-backdrop">
      <div class="hero-content">
        <h1 class="text-3xl md:text-5xl font-bold mb-2">${movie.title}</h1>
        <div class="flex items-center mb-4">
          <span class="bg-accent text-xs px-2 py-1 rounded mr-2">${movie.vote_average.toFixed(1)}</span>
          <span class="text-sm text-gray-300">${movie.release_date ? movie.release_date.substring(0, 4) : ''}</span>
        </div>
        <p class="text-sm md:text-base mb-4 line-clamp-3">${movie.overview}</p>
        <div class="flex space-x-3">
          <a href="watch.html?id=${movie.id}&type=movie" class="bg-accent hover:bg-accent-hover px-4 py-2 rounded-full flex items-center">
            <i class="fas fa-play mr-2"></i> Watch Now
          </a>
          <a href="details.html?id=${movie.id}&type=movie" class="bg-darkest hover:bg-gray-800 px-4 py-2 rounded-full">
            <i class="fas fa-info-circle"></i>
          </a>
        </div>
      </div>
    `;
    
    slider.appendChild(slide);
  });
  
  // Start slider
  const slides = document.querySelectorAll('.hero-slide');
  if (slides.length > 1) {
    slideInterval = setInterval(() => {
      slides[currentSlide].classList.remove('opacity-100');
      slides[currentSlide].classList.add('opacity-0');
      
      currentSlide = (currentSlide + 1) % slides.length;
      
      slides[currentSlide].classList.remove('opacity-0');
      slides[currentSlide].classList.add('opacity-100');
    }, 5000);
  }
}

// Initialize filters
function initFilters() {
  const genreFilters = document.getElementById('genreFilters');
  const yearFilter = document.getElementById('yearFilter');
  
  if (genreFilters) {
    // This would be populated from an actual genre fetch
    const genres = [
      { id: 28, name: 'Action' },
      { id: 12, name: 'Adventure' },
      { id: 16, name: 'Animation' },
      // Add more genres as needed
    ];
    
    genres.forEach(genre => {
      const checkbox = document.createElement('div');
      checkbox.className = 'flex items-center mb-2';
      checkbox.innerHTML = `
        <input type="checkbox" id="genre-${genre.id}" value="${genre.id}" class="mr-2">
        <label for="genre-${genre.id}" class="text-sm cursor-pointer">${genre.name}</label>
      `;
      genreFilters.appendChild(checkbox);
    });
  }
  
  if (yearFilter) {
    const currentYear = new Date().getFullYear();
    for (let year = currentYear; year >= 2000; year--) {
      const option = document.createElement('option');
      option.value = year;
      option.textContent = year;
      yearFilter.appendChild(option);
    }
  }
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  initSearch();
  initHeroSlider();
  initFilters();
});
