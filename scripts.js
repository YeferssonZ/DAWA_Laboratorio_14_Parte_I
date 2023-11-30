document.addEventListener('DOMContentLoaded', function () {
    const form = document.querySelector('.upload-form');
    const fileInfoDiv = document.querySelector('#file-info');
    const errorMessageDiv = document.querySelector('#error-message');

    form.addEventListener('submit', async (event) => {
        event.preventDefault();

        const formData = new FormData(form);

        if (form.elements['files'].files.length > 5) {
            showError('No puedes seleccionar más de 5 archivos.');
            return;
        }

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                const errorMessage = await response.text();
                throw new Error(errorMessage);
            }

            const fileDetails = await response.json();

            fileInfoDiv.innerHTML = '';

            fileDetails.forEach((file, index) => {
                const fileDetailsContainer = document.createElement('div');
                fileDetailsContainer.classList.add('file-details');

                if (file.mimetype.startsWith('image/')) {
                    const imgElement = document.createElement('img');
                    imgElement.src = `/uploads/${file.filename}`;
                    imgElement.alt = 'Imagen cargada';
                    imgElement.classList.add('uploaded-image');
                    fileDetailsContainer.appendChild(imgElement);
                }

                fileDetailsContainer.innerHTML += `
                    <p>Nombre: ${file.filename}</p>
                    <p>Nombre original: ${file.originalname}</p>
                    <p>Tamaño: ${file.size} bytes</p>
                    <p>Tipo MIME: ${file.mimetype}</p>
                    <hr />
                `;

                fileInfoDiv.appendChild(fileDetailsContainer);
            });

            // Limpiar mensajes de error
            hideError();
        } catch (error) {
            console.error(error);

            fileInfoDiv.innerHTML = '';

            showError(error.message || 'Error al procesar la solicitud. Por favor, inténtalo de nuevo.');
        }
    });

    function showError(message) {
        errorMessageDiv.textContent = message;
        errorMessageDiv.style.display = 'block';
    }

    function hideError() {
        errorMessageDiv.textContent = '';
        errorMessageDiv.style.display = 'none';
    }
});
