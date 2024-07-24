document.addEventListener('DOMContentLoaded', (event) => {
    // Verificar si el usuario está autenticado
    fetch('/verificar-autenticacion')
        .then(response => response.json())
        .then(data => {
            if (!data.autenticado) {
                const userResponse = alert("No tienes una cuenta, te vamos a redirigir a crear un usuario");
                window.location.href = '/usuario.html'; 
            }
        })
        .catch(error => {
            console.error('Error al verificar autenticación:', error);
            // En caso de error en la verificación, podrías redirigir también si lo deseas
            window.location.href = '/usuario.html';
        });

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

    // Manejar el envío de comentarios y cargar los comentarios existentes
    const form = document.querySelector('form[action="/enviar-comentario"]');
    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();

            const commentInput = document.querySelector('input[name="comment"]');
            const comment = commentInput.value;

            try {
                const response = await fetch('/enviar-comentario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ comment })
                });

                if (response.ok) {
                    commentInput.value = '';
                    cargarComentarios(); // Carga los comentarios después de enviar uno nuevo
                } else {
                    alert('Error al enviar comentario');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }

    cargarComentarios();
});

async function cargarComentarios() {
    try {
        const response = await fetch('/obtener-comentarios');
        if (response.ok) {
            const comentarios = await response.json();
            const comentariosLista = document.getElementById('comentarios-lista');
            comentariosLista.innerHTML = '';

            comentarios.forEach(comentario => {
                const comentarioDiv = document.createElement('div');
                comentarioDiv.classList.add('comentario');
                comentarioDiv.innerHTML = `
                    <p><strong>${comentario.username}:</strong> ${comentario.comment}</p>
                `;
                comentariosLista.appendChild(comentarioDiv);
            });
        } else {
            console.error('Error al cargar comentarios');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}
