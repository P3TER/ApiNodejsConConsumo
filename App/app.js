const apiBaseUrl = 'http://localhost:3000/api/cursos';
const programacionTableBody = document.querySelector('#programmingCoursesTable tbody');
const matematicasTableBody = document.querySelector('#mathCoursesTable tbody');
const deletedCoursesTable = document.getElementById('deletedCoursesTable');
const deletedCoursesTableBody = deletedCoursesTable.querySelector('tbody');
const addProgramacionButton = document.getElementById('addProgramacion');
const addMatematicasButton = document.getElementById('addMatematicas');

function fetchCursos(category, tableBody, isDeleted = false) {
    axios.get(`${apiBaseUrl}/${category}`)
        .then(response => {
            const cursos = response.data.filter(curso => curso.estado === !isDeleted);
            renderCursos(cursos, category, tableBody, isDeleted);
        })
        .catch(error => console.error('Error fetching courses:', error));
}

function renderCursos(cursos, category, tableBody, isDeleted = false) {
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
                ${isDeleted 
                    ? `<button class="restore-button btn btn-outline-light" data-id="${curso.id}" data-category="${category}">Restaurar</button>`
                    : `<button class="edit-button btn btn-outline-light" data-id="${curso.id}" data-category="${category}">Editar</button>
                       <button class="delete-button btn btn-outline-light" data-id="${curso.id}" data-category="${category}">Eliminar</button>`
                }
            </td>
        `;
        tableBody.appendChild(row);
    });

    if (isDeleted) {
        document.querySelectorAll('.restore-button').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const category = this.getAttribute('data-category');
                restoreCurso(id, category);
            });
        });
    } else {
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
                deleteCurso(id, category, tableBody);
            });
        });
    }
}

function deleteCurso(id, category, tableBody) {
    axios.patch(`${apiBaseUrl}/${category}/${id}`, { estado: false })
        .then(response => {
            fetchCursos(category, tableBody);
            fetchDeletedCursos();
        })
        .catch(error => console.error('Error deleting course:', error));
}

function restoreCurso(id, category) {
    axios.patch(`${apiBaseUrl}/${category}/${id}`, { estado: true })
        .then(response => {
            fetchDeletedCursos();
            fetchCursos(category, category === 'programacion' ? programacionTableBody : matematicasTableBody);
        })
        .catch(error => console.error('Error restoring course:', error));
}

function fetchDeletedCursos() {
    let deletedCursos = [];
    ['programacion', 'matematicas'].forEach(category => {
        axios.get(`${apiBaseUrl}/${category}`)
            .then(response => {
                const cursosEliminados = response.data.filter(curso => !curso.estado);
                if (cursosEliminados.length > 0) {
                    deletedCursos = [...deletedCursos, ...cursosEliminados.map(curso => ({ ...curso, category }))];
                }
                renderDeletedCursos(deletedCursos);
            })
            .catch(error => console.error('Error fetching deleted courses:', error));
    });
}

function renderDeletedCursos(cursos) {
    if (cursos.length > 0) {
        deletedCoursesTable.style.display = 'table';
        deletedCoursesTableBody.innerHTML = '';

        cursos.forEach(curso => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${curso.id}</td>
                <td>${curso.titulo}</td>
                <td>${curso.category}</td>
                <td>${curso.lenguaje || curso.tema}</td>
                <td>${curso.vistas}</td>
                <td>${curso.nivel}</td>
                <td>
                    <button class="restore-button btn btn-outline-light" data-id="${curso.id}" data-category="${curso.category}">Restaurar</button>
                </td>
            `;
            deletedCoursesTableBody.appendChild(row);
        });

        document.querySelectorAll('.restore-button').forEach(button => {
            button.addEventListener('click', function() {
                const id = this.getAttribute('data-id');
                const category = this.getAttribute('data-category');
                restoreCurso(id, category);
            });
        });
    } else {
        deletedCoursesTable.style.display = 'none';
    }
}

fetchCursos('programacion', programacionTableBody);
fetchCursos('matematicas', matematicasTableBody);
fetchDeletedCursos();

if (addProgramacionButton) {
    addProgramacionButton.addEventListener('click', function() {
        window.location.href = 'add.html?category=programacion';
    });
}

if (addMatematicasButton) {
    addMatematicasButton.addEventListener('click', function() {
        window.location.href = 'add.html?category=matematicas';
    });
}
