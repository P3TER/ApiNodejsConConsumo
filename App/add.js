document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = 'http://localhost:3000/api/cursos';
    const addForm = document.getElementById('addForm');
    const categoryInput = document.getElementById('category');

    // Función para obtener el nombre del equipo del cliente
    function getHostName(callback) {
        // Realizar una solicitud HTTP al servidor local que proporciona el nombre del equipo
        fetch('http://localhost:3000/api/equipo')
            .then(response => response.json()) // Parsear la respuesta como JSON
            .then(data => {
                callback(data.equipo); // Obtener solo el nombre del equipo del objeto JSON
            })
            .catch(error => {
                console.error('Error obtaining hostname:', error);
                // Si hay un error al obtener el nombre del equipo, proporcionar un valor predeterminado
                callback('Equipo Desconocido');
            });
    }

    function getCategoryFromUrl() {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get('category');
    }

    function addCurso(event) {
        event.preventDefault();

        // Obtener el nombre del equipo
        getHostName(function(hostname) {
            const newCurso = {
                titulo: document.getElementById('courseTitle').value,
                lenguaje: document.getElementById('courseLenguaje').value,
                vistas: parseInt(document.getElementById('courseViews').value, 10),
                nivel: document.getElementById('courseLevel').value,
                estado: true,
                equipo: hostname // Usar el nombre del equipo obtenido
            };

            const category = getCategoryFromUrl();

            axios.post(`${apiBaseUrl}/${category}`, newCurso)
                .then(response => {
                    window.location.href = 'index.html';
                })
                .catch(error => console.error('Error adding course:', error));
        });
    }

    addForm.addEventListener('submit', addCurso);

    categoryInput.value = getCategoryFromUrl();
});
