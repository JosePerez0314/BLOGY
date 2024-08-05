document.getElementById('submitButton').addEventListener('click', function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del botón

    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;

    fetch('/enviar-contacto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, message })
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {
            console.error('Error:', data.error);
            alert('Error al enviar el mensaje: ' + data.error);
        } else {
            console.log('Éxito:', data.message);
            alert('Mensaje enviado exitosamente');
        }
    })
    .catch((error) => {
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
});
