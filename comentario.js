// Asegurándome que primero cargue el DOM antes de que se ejecute el código JS
document.addEventListener('DOMContentLoaded', (event) => {
    // Funcionalidades del botón hamburguesa
    const hamButton = document.getElementById('hamButton');
    const nav = document.querySelector('.nav');

    if (hamButton && nav) {
        hamButton.addEventListener('click', function () {
            if (window.innerWidth < 600) {
                nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth >= 600) {
                nav.style.display = 'flex';
            } else {
                nav.style.display = 'none';
            }
        });

        // Asegurarse de que el estado inicial del menú es correcto
        if (window.innerWidth < 600) {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
        }
    }

    // Ajustar el cursor del input 
    const comentarioInput = document.getElementById('comentarioInput');
    const maxLength = 150; 

    if (comentarioInput) {
        comentarioInput.addEventListener('input', () => {
            if (comentarioInput.value.length > maxLength) {
                comentarioInput.value = comentarioInput.value.substring(0, maxLength);
            }
        });
    }
});
