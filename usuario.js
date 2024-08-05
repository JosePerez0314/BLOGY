// Esperar a que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', (event) => {
    // Obtener el formulario de creación de usuario
    const form = document.getElementById('createUserForm');

    // Comprobar si el formulario existe en el DOM
    if (form) {
        // Agregar un event listener al formulario para manejar el evento de envío
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evitar el comportamiento por defecto del formulario

            // Obtener el valor del campo de entrada de nombre de usuario
            const username = document.querySelector('input[name="username"]').value;

            try {
                // Enviar los datos del formulario al servidor
                const response = await fetch('/crear-usuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                // Manejar la respuesta del servidor
                if (response.ok) {
                    // Redirigir a la página de comentarios si el usuario se crea correctamente
                    window.location.href = '/comentario.html';
                } else {
                    alert('Error al crear usuario');
                }
            } catch (error) {
                // Manejo de errores en la conexión con el servidor
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }
});