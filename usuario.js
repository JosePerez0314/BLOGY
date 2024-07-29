document.addEventListener('DOMContentLoaded', (event) => {
    const form = document.getElementById('createUserForm');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault();
            const username = document.querySelector('input[name="username"]').value;

            try {
                const response = await fetch('/crear-usuario', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ username })
                });

                if (response.ok) {
                    window.location.href = '/comentario.html';
                } else {
                    alert('Error al crear usuario');
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Error al conectar con el servidor');
            }
        });
    }
});
