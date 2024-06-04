document.addEventListener('DOMContentLoaded', function() {
    const apiBaseUrl = 'http://localhost:3000/api/cursos';

    function fetchCursos(category) {
        axios.get(`${apiBaseUrl}/${category}`)
            .then(response => {
                const cursosActivos = response.data.filter(curso => curso.estado);
                renderCursos(cursosActivos, category);
            })
            .catch(error => console.error('Error fetching courses:', error));
    }

    function renderCursos(cursos, category) {
        const tableBody = document.getElementById(`${category}TableBody`);
        tableBody.innerHTML = '';

        cursos.forEach(curso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${curso.id}</td>
                <td>${curso.titulo}</td>
                <td>${curso.lenguaje || curso.tema}</td>
                <td>${curso.vistas}</td>
                <td>${curso.nivel}</td>
                <td>
                    <button class="edit-button" data-id="${curso.id}" data-category="${category}">Editar</button>
                    <button class="delete-button" data-id="${curso.id}" data-category="${category}">Eliminar</button>
                </td>
            `;
            tableBody.appendChild(row);
        });

        document.querySelectorAll('.edit-button').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const category = this.getAttribute('data-category');
                window.location.href = `edit.html?id=${id}&category=${category}`;
            });
        });

        document.querySelectorAll('.delete-button').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const category = this.getAttribute('data-category');
                deleteCurso(id, category);
            });
        });
    }

    function deleteCurso(id, category) {
        axios.patch(`${apiBaseUrl}/${category}/${id}`, { estado: false })
            .then(response => {
                fetchCursos(category);
            })
            .catch(error => console.error('Error deleting course:', error));
    }

    fetchCursos('programacion');
    fetchCursos('matematicas');

    document.getElementById('addProgramacion').addEventListener('click', function() {
        window.location.href = 'add.html?category=programacion';
    });

    document.getElementById('addMatematicas').addEventListener('click', function() {
        window.location.href = 'add.html?category=matematicas';
    });
});
