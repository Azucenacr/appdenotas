document.addEventListener('DOMContentLoaded', () => {
    const tituloInput = document.getElementById('titulo');
    const descripcionInput = document.getElementById('descripcion');
    const categoriaInput = document.getElementById('categoria');
    const tablaNotas = document.getElementById('tablaNotas');
    const agregarBtn = document.getElementById('agregarNota');
    const eliminarTodoBtn = document.getElementById('eliminarTodo');
  
    let notas = JSON.parse(localStorage.getItem('notas')) || [];
    let paginaActual = 1;
    const notasPorPagina = 5;
  
    function guardarNotas() {
      localStorage.setItem('notas', JSON.stringify(notas));
    }
  
    function limpiarFormulario() {
      tituloInput.value = '';
      descripcionInput.value = '';
      categoriaInput.value = '';
    }
  
    function mostrarNotas() {
      tablaNotas.innerHTML = '';
      const inicio = (paginaActual - 1) * notasPorPagina;
      const fin = inicio + notasPorPagina;
      const notasPaginadas = notas.slice(inicio, fin);
  
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
  
    window.editarNota = function (index) {
      if (confirm('¿Estás seguro de editar esta nota?')) {
        const nota = notas[index];
        tituloInput.value = nota.titulo;
        descripcionInput.value = nota.descripcion;
        categoriaInput.value = nota.categoria;
  
        notas.splice(index, 1);
        guardarNotas();
        mostrarNotas();
      }
    };
  
    window.eliminarNota = function (index) {
      if (confirm('¿Estás seguro de eliminar esta nota?')) {
        notas.splice(index, 1);
        guardarNotas();
        mostrarNotas();
      }
    };
  
    function agregarNota() {
      const titulo = tituloInput.value.trim();
      const descripcion = descripcionInput.value.trim();
      const categoria = categoriaInput.value;
  
      if (!titulo || !descripcion || !categoria) {
        alert('Por favor, complete todos los campos y seleccione una categoría.');
        return;
      }
  
      const fecha = new Date().toLocaleDateString();
      notas.push({ titulo, descripcion, categoria, fecha });
      guardarNotas();
      limpiarFormulario();
      mostrarNotas();
    }
  
    function eliminarTodasLasNotas() {
      if (confirm('¿Seguro que deseas eliminar todas las notas?')) {
        notas = [];
        guardarNotas();
        mostrarNotas();
      }
    }
  
    document.getElementById('anterior').addEventListener('click', () => {
      if (paginaActual > 1) {
        paginaActual--;
        mostrarNotas();
      }
    });
  
    document.getElementById('siguiente').addEventListener('click', () => {
      const totalPaginas = Math.ceil(notas.length / notasPorPagina);
      if (paginaActual < totalPaginas) {
        paginaActual++;
        mostrarNotas();
      }
    });
  
    agregarBtn.addEventListener('click', agregarNota);
    eliminarTodoBtn.addEventListener('click', eliminarTodasLasNotas);
  
    mostrarNotas();
  });
  