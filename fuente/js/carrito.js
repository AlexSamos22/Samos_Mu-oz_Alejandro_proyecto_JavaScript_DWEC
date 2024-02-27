let carrito = JSON.parse(localStorage.getItem("sesion_iniciada"));
let contenedorCarrito = document.getElementById("carrito");
let realizarCompra = document.createElement("button");
realizarCompra.textContent = "Realizar Compra";

if (!carrito) {
    let parrafo = document.createElement("p");
    parrafo.innerHTML = "No hay una sesion iniciada, por favor inicia sesion para continuar";
    contenedorCarrito.appendChild(parrafo);

}else{
    
    let productosCarrito = carrito.carrito;

    realizarCompra.addEventListener("click", ()=>{
        alert("Gracias por su compra");
        carrito.carrito = [];
        localStorage.setItem("sesion_iniciada", JSON.stringify(carrito));
        window.location.href = "../index.html";
    });
    
    
    if (productosCarrito.length == 0) {
        let parrafo = document.createElement("p");
        let boton = document.createElement("button");
        parrafo.innerHTML = "Aun no tienes articulos en tu carrito";
        boton.innerHTML = "Ver articulos";
        boton.addEventListener("click", () =>{
            window.location.href = "../index.html";
        });
        contenedorCarrito.appendChild(parrafo);
        contenedorCarrito.appendChild(boton);
    
    }else{
        contenedorCarrito.appendChild(crearTablaCarrito(productosCarrito));
        contenedorCarrito.appendChild(realizarCompra);
    }
}


function crearTablaCarrito(productosCarrito) {
    let tabla = document.createElement("table");
    let tbody = document.createElement("tbody");
    let encabezado = document.createElement("thead");
    let encabezadoFila = document.createElement("tr");
    let thImagen = document.createElement("th");
    thImagen.textContent = "Imagen";
    let thNombre = document.createElement("th");
    thNombre.textContent = "Nombre";
    let thPrecio = document.createElement("th");
    thPrecio.textContent = "Precio";
    let thUnidades = document.createElement("th");
    thUnidades.textContent = "Unidades";
    let thAcciones = document.createElement("th");
    thAcciones.textContent = "Acciones";

    encabezadoFila.appendChild(thImagen);
    encabezadoFila.appendChild(thNombre);
    encabezadoFila.appendChild(thPrecio);
    encabezadoFila.appendChild(thUnidades);
    encabezadoFila.appendChild(thAcciones);

    encabezado.appendChild(encabezadoFila);
    tabla.appendChild(encabezado);

    productosCarrito.forEach(producto => {
        let fila = document.createElement("tr");
        fila.id = producto.id;
        let tdImagen = document.createElement("td");
        let imagen = document.createElement("img");
        imagen.src = producto.image;
        imagen.alt = producto.title;
        imagen.style.width = "100px";
        imagen.style.height = "auto";
        tdImagen.appendChild(imagen);
        fila.appendChild(tdImagen);

        let tdNombre = document.createElement("td");
        tdNombre.textContent = producto.title;
        fila.appendChild(tdNombre);

        let tdPrecio = document.createElement("td");
        tdPrecio.textContent = producto.price * producto.unidades;
        fila.appendChild(tdPrecio);

        let tdUnidades = document.createElement("td");
        tdUnidades.textContent = producto.unidades;
        fila.appendChild(tdUnidades);

        let tdAddUnidades = document.createElement("button");
        tdAddUnidades.textContent = "+";
        tdAddUnidades.addEventListener("click", () => {
            let precioActual = parseFloat(tdPrecio.innerHTML);
            let unidadesActuales = parseInt(tdUnidades.innerHTML);
            precioActual += parseFloat(producto.price);
            unidadesActuales += 1;
            tdPrecio.textContent = precioActual.toFixed(2);
            tdUnidades.textContent = unidadesActuales;
            actualizarCarrito(producto.id, unidadesActuales);
            
        });
        fila.appendChild(tdAddUnidades);

        let tddelUnidades = document.createElement("button");
        tddelUnidades.textContent = "-";
        tddelUnidades.addEventListener("click", () => {
            let precioActual = parseFloat(tdPrecio.innerHTML);
            let unidadesActuales = parseInt(tdUnidades.innerHTML);
            if (unidadesActuales > 0) {
                precioActual -= parseFloat(producto.price);
                unidadesActuales -= 1;
                tdPrecio.textContent = precioActual.toFixed(2);
                tdUnidades.textContent = unidadesActuales;
                if (unidadesActuales == 0) {
                    actualizarCarrito(producto.id, 0, true);
                    let tr = document.getElementById(producto.id);
                    tr.parentNode.removeChild(tr);
                }else{
                     actualizarCarrito(producto.id, unidadesActuales);
                }
               
            }
        });
        fila.appendChild(tddelUnidades);

        let tdEliminar = document.createElement("button");
        tdEliminar.textContent = "Eliminar";
        tdEliminar.addEventListener("click", () => {
            let tr = document.getElementById(producto.id);
            tr.parentNode.removeChild(tr);
            actualizarCarrito(producto.id, 0, true);

        });
        fila.appendChild(tdEliminar);

        tbody.appendChild(fila);
    });

    tabla.appendChild(tbody);

    return tabla;
}

function actualizarCarrito(idProducto, nuevasUnidades = 0, eliminar = false) {
    // Obtener el carrito del localStorage
    let datosLocalStorage = JSON.parse(localStorage.getItem("sesion_iniciada"));
    let carrito = datosLocalStorage.carrito;

    // Buscar el índice del producto en el carrito
    let indiceProducto = carrito.findIndex(producto => producto.id === idProducto);

    if (indiceProducto !== -1) {
        if (eliminar) {
            // Eliminar el producto del carrito usando splice
            carrito.splice(indiceProducto, 1);
        } else {
            // Actualizar las unidades del producto si nuevasUnidades no es null
            if (nuevasUnidades != 0) {
                carrito[indiceProducto].unidades = nuevasUnidades;
            }
        }

        // Actualizar el carrito en el localStorage
        datosLocalStorage.carrito = carrito;
        localStorage.setItem("sesion_iniciada", JSON.stringify(datosLocalStorage));
    }
}