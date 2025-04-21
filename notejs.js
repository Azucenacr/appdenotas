// Esperamos que el documento esté completamente cargado
document.addEventListener('DOMContentLoaded', () => {

    // Referencias a los elementos del HTML 
    const tituloInput = document.getElementById('titulo');
    const descripcionInput = document.getElementById('descripcion');
    const categoriaInput = document.getElementById('categoria');
    const tablaNotas = document.getElementById('tablaNotas');
    const agregarBtn = document.getElementById('agregarNota');
    const eliminarTodoBtn = document.getElementById('eliminarTodo');

    // Cargo las notas guardadas en el almacenamiento local o creo un array vacío
    let notas = JSON.parse(localStorage.getItem('notas')) || [];

    // Variables para controlar la paginación de la tabla
    let paginaActual = 1;
    const notasPorPagina = 5;

    // Esta función guarda las notas en localStorage
    function guardarNotas() {
        localStorage.setItem('notas', JSON.stringify(notas));
    }

    // Limpia los campos del formulario
    function limpiarFormulario() {
        tituloInput.value = '';
        descripcionInput.value = '';
        categoriaInput.value = '';
    }

    // Muestra las notas en la tabla, según la página actual
    function mostrarNotas() {
        tablaNotas.innerHTML = ''; // Borro el contenido anterior de la tabla

        // Calculo qué notas mostrar
        const inicio = (paginaActual - 1) * notasPorPagina;
        const fin = inicio + notasPorPagina;
        const notasPaginadas = notas.slice(inicio, fin);

        // Agrego cada nota como una fila en la tabla
        notasPaginadas.forEach((nota, index) => {
            const fila = document.createElement('tr');
            fila.innerHTML = `
                <td>${nota.titulo}</td>
                <td>${nota.descripcion}</td>
                <td>${nota.categoria}</td>
                <td>${nota.fecha}</td>
                <td>
                    <button class="btn btn-success btn-sm me-1" onclick="editarNota(${inicio + index})">Editar</button>
                    <button class="btn btn-danger btn-sm" onclick="eliminarNota(${inicio + index})">Eliminar</button>
                </td>
            `;
            tablaNotas.appendChild(fila);
        });
    }

    // Función para editar una nota (la preparo en el formulario)
    window.editarNota = function (index) {
        if (confirm('¿Seguro que quieres editar esta nota?')) {
            const nota = notas[index];

            // Lleno el formulario con los datos de la nota
            tituloInput.value = nota.titulo;
            descripcionInput.value = nota.descripcion;
            categoriaInput.value = nota.categoria;

            // Quito la nota actual para poder editarla después como nueva
            notas.splice(index, 1);
            guardarNotas();
            mostrarNotas();
        }
    };

    // Función para eliminar una nota específica
    window.eliminarNota = function (index) {
        if (confirm('¿Seguro que deseas eliminar esta nota?')) {
            notas.splice(index, 1); // La borro del array
            guardarNotas();         // Actualizo el almacenamiento
            mostrarNotas();         // Refresco la tabla
        }
    };

    // Función para agregar una nueva nota
    function agregarNota() {
        const titulo = tituloInput.value.trim();
        const descripcion = descripcionInput.value.trim();
        const categoria = categoriaInput.value;

        // Verifica que todos los campos estén llenos
        if (!titulo || !descripcion || !categoria) {
            alert('Por favor llena todos los campos antes de guardar la nota.');
            return;
        }

        // Crea una nueva nota con fecha actual
        const fecha = new Date().toLocaleDateString();
        notas.push({ titulo, descripcion, categoria, fecha });

        guardarNotas();       // Guardo la nota nueva
        limpiarFormulario();  // Limpio el formulario
        mostrarNotas();       // Actualizo la tabla
    }

    // Elimina todas las notas de una vez
    function eliminarTodasLasNotas() {
        if (confirm('¿De verdad quieres eliminar todas las notas?')) {
            notas = [];           // Borro todas las notas
            guardarNotas();       // Actualizo localStorage
            mostrarNotas();       // Limpio la tabla visualmente
        }
    }

    // Botón para ir a la página anterior en la tabla
    document.getElementById('anterior').addEventListener('click', () => {
        if (paginaActual > 1) {
            paginaActual--;
            mostrarNotas();
        }
    });

    // Botón para ir a la página siguiente en la tabla
    document.getElementById('siguiente').addEventListener('click', () => {
        const totalPaginas = Math.ceil(notas.length / notasPorPagina);
        if (paginaActual < totalPaginas) {
            paginaActual++;
            mostrarNotas();
        }
    });

    // espera el clic en el botón para agregar notas
    agregarBtn.addEventListener('click', agregarNota);

    // espera el clic en el botón para borrar todo
    eliminarTodoBtn.addEventListener('click', eliminarTodasLasNotas);

    // Muestro las notas al cargar la página
    mostrarNotas();
});
