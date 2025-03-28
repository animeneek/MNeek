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
        const menuToggle = document.getElementById('menu-toggle');
        const menu = document.querySelector('.menu');
        
        menuToggle.addEventListener('click', () => {
            menu.classList.toggle('open');
        });
    });

document.getElementById('home-button').addEventListener('click', function() {
    window.location.href = 'home.html';
});
