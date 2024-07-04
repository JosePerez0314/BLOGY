const hamButton = document.getElementById('hamButton');
const nav = document.querySelector('.nav');

hamButton.addEventListener('click', function() {
    if (window.innerWidth < 600) {
        nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
    }
});

window.addEventListener('resize', function() {
    if (window.innerWidth >= 600) {
        nav.style.display = 'flex';
    } else {
        nav.style.display = 'none';
    }
});