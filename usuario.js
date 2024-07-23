document.getElementById('createUserForm').addEventListener('submit', async function (event) {
    // Mantener el código para el menú hamburguesa
    const hamButton = document.getElementById('hamButton');
    const nav = document.querySelector('.nav');

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

    event.preventDefault(); // Previene el comportamiento por defecto del formulario

    const username = document.querySelector('.form__input').value;

    try {
        const response = await fetch('/crear-usuario', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: username })
        });

        if (response.ok) {
            alert('Usuario creado exitosamente');
            window.location.href = 'comentario.html'; // Redirige a la página de comentarios
        } else {
            alert('Error al crear el usuario');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    }
});
