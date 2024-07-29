document.addEventListener('DOMContentLoaded', (event) => {
    fetch('/verificar-autenticacion')
        .then(response => response.json())
        .then(data => {
            if (!data.autenticado) {
                alert("No tienes una cuenta, te vamos a redirigir a crear un usuario");
                window.location.href = '/usuario.html'; 
            }
        })
        .catch(error => {
            console.error('Error al verificar autenticación:', error);
            window.location.href = '/usuario.html';
        });

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

        if (window.innerWidth < 600) {
            nav.style.display = 'none';
        } else {
            nav.style.display = 'flex';
        }
    }

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
                    cargarComentarios();
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
