// Esperar a que el DOM se haya cargado completamente
document.addEventListener('DOMContentLoaded', (event) => {
    // Verificar la autenticación del usuario
    fetch('/verificar-autenticacion')
        .then(response => response.json())
        .then(data => {
            if (!data.autenticado) {
                // Si no está autenticado, redirigir a la página de creación de usuario
                alert("No tienes una cuenta, te vamos a redirigir a crear un usuario");
                window.location.href = '/usuario.html'; 
            }
        })
        .catch(error => {
            // Manejo de errores en la verificación de autenticación
            console.error('Error al verificar autenticación:', error);
            window.location.href = '/usuario.html';
        });

    // Obtener elementos del DOM
    const hamButton = document.getElementById('hamButton');
    const nav = document.querySelector('.nav');

    // Comprobar si los elementos existen en el DOM
    if (hamButton && nav) {
        // Agregar función al botón de hamburguesa
        hamButton.addEventListener('click', function () {
            if (window.innerWidth < 600) {
                // Mostrar u ocultar el menú de navegación en pantallas pequeñas
                nav.style.display = nav.style.display === 'none' ? 'flex' : 'none';
            }
        });

        // Ajustar la visibilidad del menú de navegación al cambiar el tamaño de la ventana
        window.addEventListener('resize', function () {
            if (window.innerWidth >= 600) {
                nav.style.display = 'flex';
            } else {
                nav.style.display = 'none';
            }
        });

        // Configurar la visibilidad inicial del menú de navegación
        if (window.innerWidth < 600) {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
        }
    }

    // Manejar el envío del formulario de comentarios
    const form = document.querySelector('form[action="/enviar-comentario"]');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const commentInput = document.querySelector('input[name="comment"]');
            const comment = commentInput.value;

            try {
                // Enviar comentario al servidor
                const response = await fetch('/enviar-comentario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comment })
                });

                if (response.ok) {
                    // Limpiar el campo de comentario y recargar la lista de comentarios
                    commentInput.value = '';
                    cargarComentarios();
                } else {
                    alert('Error al enviar comentario');
                }
            } catch (error) {
                // Manejo de errores al enviar comentario
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }

    // Manejar el envío del formulario de búsqueda
    const buscarForm = document.getElementById('buscarForm');
    if (buscarForm) {
        buscarForm.addEventListener('submit', async function (event) {
            event.preventDefault();

            const username = document.querySelector('input[name="username"]').value;

            try {
                // Enviar solicitud de búsqueda al servidor
                const response = await fetch(`/buscar-comentarios?username=${username}`);

                if (response.ok) {
                    const comments = await response.json();
                    if (comments.length === 0) {
                        alert('Lo siento, pero este usuario no existe');
                    } else {
                        mostrarComentarios(comments, username);
                    }
                } else {
                    alert('Error al buscar comentarios');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }

    // Cargar comentarios existentes al cargar la página
    cargarComentarios();
});

// Función para cargar comentarios desde el servidor
async function cargarComentarios() {
    try {
        const response = await fetch('/obtener-comentarios');
        if (response.ok) {
            const comentarios = await response.json();
            mostrarComentarios(comentarios);
        } else {
            console.error('Error al cargar comentarios');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Función para mostrar comentarios en la página
function mostrarComentarios(comentarios, username = '') {
    const comentariosLista = document.getElementById('comentarios-lista');
    comentariosLista.innerHTML = '';

    // Mostrar título con el nombre de usuario (si se proporciona)
    if (username) {
        const titulo = document.createElement('h2');
        titulo.textContent = `Comentarios de ${username}`;
        comentariosLista.appendChild(titulo);
    }

    // Mostrar cada comentario en la lista
    comentarios.forEach(comentario => {
        const comentarioDiv = document.createElement('div');
        comentarioDiv.classList.add('comentario');
        comentarioDiv.innerHTML = `
            <p><strong>${comentario.username}:</strong> ${comentario.comment}</p>
        `;
        comentariosLista.appendChild(comentarioDiv);
    });
}
