let carrito = JSON.parse(localStorage.getItem("sesion_iniciada"));
let contenedorCarrito = document.getElementById("carrito");
console.log(carrito);
let tabla = document.createElement("table");
let tbody = document.createElement("tbody");
let productosCarrito = carrito.carrito;

productosCarrito.forEach(element => {
    console.log(element);
});

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
    tdPrecio.textContent = "$" + producto.price * producto.unidades;
    fila.appendChild(tdPrecio);

    let tdUnidades = document.createElement("td");
    tdUnidades.textContent = producto.unidades;
    fila.appendChild(tdUnidades);

    let tdAddUnidades = document.createElement("button");
    tdAddUnidades.textContent = "+";
    fila.appendChild(tdAddUnidades);

    let tddelUnidades = document.createElement("button");
    tddelUnidades.textContent = "-";
    fila.appendChild(tddelUnidades);

    let tdEliminar = document.createElement("button");
    tdEliminar.textContent = "Eliminar";
    fila.appendChild(tdEliminar);

    tbody.appendChild(fila);
});

tabla.appendChild(tbody);
contenedorCarrito.appendChild(tabla);
