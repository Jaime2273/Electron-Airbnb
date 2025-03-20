const { ipcRenderer } = require("electron");

document.getElementById("buscar").addEventListener("click", () => {
    const localidad = document.getElementById("localidad").value;
    
    if (localidad) {
        ipcRenderer.send("buscar-alojamientos", localidad);
    } else {
        alert("Por favor, introduce una localidad.");
    }
});

ipcRenderer.on("resultados-alojamientos", (event, alojamientos) => {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores
    
    alojamientos.forEach(alojamiento => {
        const li = document.createElement("li");
        
        // Título
        const titulo = document.createElement("h2");
        titulo.textContent = alojamiento.titulo;
        li.appendChild(titulo);
        
        // Precio
        const precio = document.createElement("p");
        precio.textContent = `Precio: ${alojamiento.precio}`;
        li.appendChild(precio);
        
        // Valoración
        const valoracion = document.createElement("p");
        valoracion.classList.add("valoracion");
        valoracion.textContent = `Valoración: ${alojamiento.valoracion}`;
        li.appendChild(valoracion);
        
        // Enlace
        const enlace = document.createElement("a");
        enlace.href = alojamiento.enlace;
        enlace.textContent = "Ver más detalles";
        enlace.target = "_blank"; // Abrir en una nueva pestaña
        li.appendChild(enlace);
        
        // Agregar el elemento al listado de resultados
        resultadosDiv.appendChild(li);
    });
});
