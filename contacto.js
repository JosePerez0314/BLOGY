// Agregar un event listener al botón de envío
document.getElementById('submitButton').addEventListener('click', function(event) {
    event.preventDefault(); // Evitar el comportamiento por defecto del botón

    // Obtener los valores de los campos de entrada
    const username = document.getElementById('username').value;
    const message = document.getElementById('message').value;

    // Enviar los datos del formulario al servidor
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
            // Manejo de errores en la respuesta del servidor
            console.error('Error:', data.error);
            alert('Error al enviar el mensaje: ' + data.error);
        } else {
            // Manejo de éxito en la respuesta del servidor
            console.log('Éxito:', data.message);
            alert('Mensaje enviado exitosamente');
        }
    })
    .catch((error) => {
        // Manejo de errores en la conexión con el servidor
        console.error('Error:', error);
        alert('Error al conectar con el servidor');
    });
});
