// Selecciona el botón .ham
const hamButton = document.getElementById('hamButton');
    
// Selecciona el elemento nav
const nav = document.querySelector('.nav');

// Agrega un evento de clic al botón .ham
hamButton.addEventListener('click', function() {
    // Alternar la visibilidad del nav
    nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
});