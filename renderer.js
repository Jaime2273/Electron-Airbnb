const { ipcRenderer } = require("electron");

document.getElementById("buscar").addEventListener("click", () => {
    const localidad = document.getElementById("localidad").value;
    const fechaEntrada = document.getElementById("fecha-entrada").value;
    const fechaSalida = document.getElementById("fecha-salida").value;
    const adultos = document.getElementById("adultos").value;
    const ninos = document.getElementById("ninos").value;
    const bebes = document.getElementById("bebes").value;
    
    if (localidad && fechaEntrada && fechaSalida && adultos) {
        // Enviar localidad, fecha de entrada, fecha de salida y número de personas al proceso principal
        ipcRenderer.send("buscar-alojamientos", { localidad, fechaEntrada, fechaSalida, adultos, ninos, bebes });
    } else {
        alert("Por favor, introduce todos los campos obligatorios.");
    }
});

ipcRenderer.on("resultados-alojamientos", (event, alojamientos) => {
    const resultadosDiv = document.getElementById("resultados");
    resultadosDiv.innerHTML = ""; // Limpiar resultados anteriores
    
    alojamientos.forEach(alojamiento => {
        const li = document.createElement("li");
        
        // Imagen
        const imagen = document.createElement("img");
        imagen.src = alojamiento.imagen;
        imagen.alt = alojamiento.titulo;
        imagen.style.width = "100%";
        imagen.style.borderRadius = "5px";
        imagen.style.marginBottom = "10px";
        li.appendChild(imagen);

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