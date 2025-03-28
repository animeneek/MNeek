// Dynamically load the header
fetch('header.html')
    .then(response => response.text())
    .then(data => {
        document.getElementById('header-container').innerHTML = data;
    });

document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'index.html';
});
