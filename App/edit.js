document.addEventListener('DOMContentLoaded', function () {
    const apiBaseUrl = 'http://localhost:3000/api/cursos';
    const urlParams = new URLSearchParams(window.location.search);
    const courseId = urlParams.get('id');
    const category = urlParams.get('category');

    const courseIdField = document.getElementById('courseId');
    const courseTitle = document.getElementById('courseTitle');
    const courseLanguage = document.getElementById('courseLanguage');
    const courseLevel = document.getElementById('courseLevel');
    const courseViews = document.getElementById('courseViews');
    const editForm = document.getElementById('editForm');

    function fetchCurso() {
        axios.get(`${apiBaseUrl}/${category}/id/${courseId}`)
            .then(response => {
                const data = response.data;
                courseIdField.value = data.id;
                courseTitle.value = data.titulo;
                courseLanguage.value = category === 'programacion' ? data.lenguaje : data.tema;
                courseLevel.value = data.nivel;
                courseViews.value = data.vistas;
            })
            .catch(error => console.error('Error fetching course:', error));
    }

    function updateCurso(event) {
        event.preventDefault();

        const updatedCurso = {
            id: parseInt(courseIdField.value, 10),
            titulo: courseTitle.value,
            lenguaje: category === 'programacion' ? courseLanguage.value : undefined,
            tema: category === 'matematicas' ? courseLanguage.value : undefined,
            nivel: courseLevel.value,
            vistas: parseInt(courseViews.value, 10),
            estado: true
        };

        axios.put(`${apiBaseUrl}/${category}/${courseId}`, updatedCurso)
            .then(() => {
                window.location.href = 'index.html';
            })
            .catch(error => console.error('Error updating course:', error));
    }

    fetchCurso();

    editForm.addEventListener('submit', updateCurso);
});
