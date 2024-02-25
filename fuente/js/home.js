let contenedor_productos = document.getElementById('productos');
let contenedor_botones = document.getElementById('botones');
let listaBtn = document.getElementById('listaBtn');
let tablaBtn = document.getElementById('tablaBtn');
let cerrarSesion = document.getElementById('cerrar_sesion');
let carrito = document.querySelector('.carrito');
let url_productos = 'https://fakestoreapi.com/products';
let asc = document.getElementById('asc');
let desc = document.getElementById('desc');
let ordenar = false;
let tipoOrden = "";
let ul;
let table;
let tbody;
let vistaActual = "lista";

///EVENT LISENERS
//Evento para poder cerrar sesion
cerrarSesion.addEventListener('click', (evento) => {
    evento.preventDefault();

    // Obtener la sesión actual del usuario
    let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada'));

    if (sesionIniciada) {
        // Obtener el nombre de usuario
        let nombreUsuario = sesionIniciada.nombreUsuario;

        // Obtener los favoritos del usuario actual
        let favoritosUsuario = JSON.parse(localStorage.getItem(nombreUsuario));
        let nuevosFavoritos = sesionIniciada.favoritos || [];
        if (!favoritosUsuario) {
            favoritosUsuario = {
                nombreUsuario: nombreUsuario,
                favoritos: []
            };
        }

        favoritosUsuario.favoritos = [];

        // Agregar los nuevos favoritos a la lista existente de favoritos del usuario
        favoritosUsuario.favoritos.push(...nuevosFavoritos);

        // Guardar los cambios en el localStorage
        localStorage.setItem(nombreUsuario, JSON.stringify(favoritosUsuario));

        // Eliminar la sesión actual
        localStorage.removeItem('sesion_iniciada');

        alert("Hasta la próxima");
        // Redirigir al usuario a la página de inicio de sesión o a donde desees
        window.location.href = "../fuente/html/login.html";
    } else {
        // Si no hay sesión iniciada, simplemente redirige al usuario
        alert("No hay sesión iniciada");
        // Redirigir al usuario a la página de inicio de sesión o a donde desees
        window.location.href = "../fuente/html/login.html";
    }
});

// Función para cambiar a la vista de lista
listaBtn.addEventListener('click', () => {
    vistaActual = 'lista';
    renderizarLista();
});

// Función para cambiar a la vista de tabla
tablaBtn.addEventListener('click', () => {
    vistaActual = 'tabla';
    renderizarTabla();
});

asc.addEventListener('click', () => {
    ordenar = true;
    tipoOrden = "asc";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }

});

desc.addEventListener('click', () => {
    ordenar = true;
    tipoOrden = "desc";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }
});

window.addEventListener('scroll', async () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // Si el usuario ha llegado al final de la página, carga más productos
        await cargarMasProductos();
    }
});
///////

///Funciones para obtener los productos y crear las vistas
async function obtenerProductos() {
    try {
        let response;
        if (ordenar && tipoOrden == "asc") {
            response = await fetch(`${url_productos}?sort=${tipoOrden}`);
        } else if (ordenar && tipoOrden == "desc") {
            response = await fetch(`${url_productos}?sort=${tipoOrden}`);
        } else {
            response = await fetch(url_productos);
        }

        let productos = await response.json();
        return productos;
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

function añadirProductoAlCarrito(producto) {
    carrito.classList.add('animacion-carrito');
    setTimeout(() => {
        carrito.classList.remove('animacion-carrito');
    }, 1000);
    const producto_añadido = {
        image: producto.image,
        title: producto.title,
        price: producto.price
    };

    const sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada'));

    // Obtener el carrito del usuario
    let carritoUsuario = sesionIniciada.carrito;

    // Agregar el producto al carrito del usuario
    carritoUsuario.push(producto_añadido);

    // Actualizar el carrito en el localStorage
    sesionIniciada.carrito = carritoUsuario;
    localStorage.setItem('sesion_iniciada', JSON.stringify(sesionIniciada));
}

function crearBotonesDeAccion(producto) {
    // Botón "Añadir al carrito"
    const botonAgregar = document.createElement('button');
    botonAgregar.textContent = 'Añadir al carrito';
    botonAgregar.addEventListener('click', (evento) => {
        evento.stopPropagation();
        añadirProductoAlCarrito(producto);
    });

    // Botón de favorito
    const botonFavorito = document.createElement('button');
    botonFavorito.innerHTML = '<i class="fas fa-heart"></i>';
    botonFavorito.classList.add('boton-favorito');
    const sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada')) || {};
    const favoritos = sesionIniciada.favoritos || [];
    if (favoritos.includes(producto.id)) {
        // Si el ID del producto está en la lista de favoritos, aplicar un estilo diferente
        botonFavorito.classList.add('favorito-activo');
    }
    botonFavorito.addEventListener('click', (evento) => {
        evento.stopPropagation();

        // Obtener el objeto sesion_iniciada del localStorage
        let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada')) || {};

        // Verificar si ya existe un array de favoritos, si no, crear uno vacío
        let favoritos = sesionIniciada.favoritos || [];

        // Obtener el ID del producto al que se le ha dado favorito
        let idProducto = producto.id;

        // Verificar si el producto ya está en la lista de favoritos
        if (!favoritos.includes(idProducto)) {
            // Agregar el ID del producto a la lista de favoritos
            favoritos.push(idProducto);
            // Agregar el estilo de favorito activo al botón
            botonFavorito.classList.add('favorito-activo');
        } else {
            // Si el producto ya está en la lista de favoritos, quitarlo de la lista y el estilo de favorito activo del botón
            favoritos.forEach((item, index) => {
                if (item === idProducto) {
                    favoritos.splice(index, 1); // Eliminar el elemento de la lista de favoritos
                    botonFavorito.classList.remove('favorito-activo'); // Quitar el estilo de favorito activo del botón
                }
            });
        }

        // Actualizar el objeto sesion_iniciada en el localStorage con la lista de favoritos actualizada
        sesionIniciada.favoritos = favoritos;
        localStorage.setItem('sesion_iniciada', JSON.stringify(sesionIniciada));
    });

    // Botón de me gusta
    let meGustaCount = localStorage.getItem(`MeGustaCount-${producto.id}`) || 0;
    const botonMeGusta = document.createElement('button');
    botonMeGusta.innerHTML = '<i class="fas fa-thumbs-up"></i>';
    botonMeGusta.classList.add('boton-me-gusta');
    botonMeGusta.id = `boton-me-gusta-${producto.id}`;
    botonMeGusta.textContent = "Me gusta (" + meGustaCount + ")";
    botonMeGusta.addEventListener('click', (evento) => {
        evento.stopPropagation();
        meGustaCount = localStorage.getItem(`MeGustaCount-${producto.id}`) || 0;
        meGustaCount++;
        localStorage.setItem(`MeGustaCount-${producto.id}`, meGustaCount);
        botonMeGusta.textContent = `Me gusta (${meGustaCount})`;
    });

    // Botón de no me gusta
    let noMeGustaCount = localStorage.getItem(`NoMeGustaCount-${producto.id}`) || 0;
    const botonNoMeGusta = document.createElement('button');
    botonNoMeGusta.innerHTML = '<i class="fas fa-thumbs-down"></i>';
    botonNoMeGusta.classList.add('boton-no-me-gusta');
    botonNoMeGusta.id = `boton-no-me-gusta-${producto.id}`;
    botonNoMeGusta.textContent = "No me gusta (" + noMeGustaCount + ")";
    botonNoMeGusta.addEventListener('click', (evento) => {
        evento.stopPropagation();
        noMeGustaCount = localStorage.getItem(`NoMeGustaCount-${producto.id}`) || 0;
        noMeGustaCount++;
        localStorage.setItem(`NoMeGustaCount-${producto.id}`, noMeGustaCount);
        botonNoMeGusta.textContent = `No me gusta (${noMeGustaCount})`;
    });

    return {
        botonAgregar,
        botonFavorito,
        botonMeGusta,
        botonNoMeGusta
    };
}

//Funcion para obtener los detalles de cada producto al hacer click en el
async function obtenerDetallesProducto(id) {
    try {
        // Realizar una solicitud para obtener los detalles del producto por ID
        const response = await fetch(`${url_productos}/${id}`);
        const producto = await response.json();

        // Crear un div para mostrar los detalles del producto
        const detalleProductoDiv = document.createElement('div');
        detalleProductoDiv.classList.add('detalle-producto');

        // Crear elementos para mostrar la información del producto
        const tituloProducto = document.createElement('h2');
        tituloProducto.textContent = producto.title;

        const precioProducto = document.createElement('p');
        precioProducto.textContent = `Precio: $${producto.price}`;

        const categoriaProducto = document.createElement('p');
        categoriaProducto.textContent = `Categoría: ${producto.category}`;

        const descripcionProducto = document.createElement('p');
        descripcionProducto.textContent = `Descripción: ${producto.description}`;

        const imagenProducto = document.createElement('img');
        imagenProducto.src = producto.image;
        imagenProducto.alt = producto.title;

        // Crear botones de acción
        const botonesDeAccion = crearBotonesDeAccion(producto);

        // Botón para volver atrás
        const botonVolver = document.createElement('button');
        botonVolver.textContent = 'Volver';
        botonVolver.addEventListener('click', () => {
            contenedor_botones.classList.remove('oculto');
            // Eliminar el div de detalles del producto al hacer clic en Volver
            renderizarLista();
        });

        // Agregar elementos al div de detalles del producto
        contenedor_botones.classList.add('oculto');
        detalleProductoDiv.appendChild(tituloProducto);
        detalleProductoDiv.appendChild(imagenProducto);
        detalleProductoDiv.appendChild(precioProducto);
        detalleProductoDiv.appendChild(categoriaProducto);
        detalleProductoDiv.appendChild(descripcionProducto);

        // Agregar botones de acción al div de detalles del producto
        detalleProductoDiv.appendChild(botonesDeAccion.botonAgregar);
        detalleProductoDiv.appendChild(botonVolver);

        // Agregar el div de detalles del producto al cuerpo del documento
        contenedor_productos.innerHTML = "";
        contenedor_productos.appendChild(detalleProductoDiv);
    } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
    }
}

function crearFilasTabla(producto) {
    let fila = document.createElement('tr');
    fila.classList.add('tarjeta');

    // Celda para la imagen
    let celdaImagen = document.createElement('td');
    let imagen = document.createElement('img');
    imagen.src = producto.image;
    imagen.alt = producto.title;
    imagen.style.width = '50px';
    imagen.style.height = 'auto';
    celdaImagen.appendChild(imagen);

    // Celda para el título
    let celdaTitulo = document.createElement('td');
    celdaTitulo.textContent = producto.title;

    // Celda para el precio
    let celdaPrecio = document.createElement('td');
    celdaPrecio.textContent = `$${producto.price}`;

    // Celda para los botones de acción
    let celdaAcciones = document.createElement('td');

    // Botones de acción
    let botones = crearBotonesDeAccion(producto);

    // Agregar los botones de acción a la celda de acciones
    celdaAcciones.appendChild(botones.botonAgregar);
    celdaAcciones.appendChild(botones.botonFavorito);
    celdaAcciones.appendChild(botones.botonMeGusta);
    celdaAcciones.appendChild(botones.botonNoMeGusta);

    // Agregar las celdas a la fila
    fila.appendChild(celdaImagen);
    fila.appendChild(celdaTitulo);
    fila.appendChild(celdaPrecio);
    fila.appendChild(celdaAcciones);

    // Agregar el evento de clic a la fila para obtener detalles del producto
    fila.addEventListener('click', () => {
        obtenerDetallesProducto(producto.id);
    });

    return fila;
}

function crearElementoLista(producto) {
    let li = document.createElement('li');
    li.classList.add('tarjeta');

    // Crear la imagen
    let imagen = document.createElement('img');
    imagen.src = producto.image;
    imagen.alt = producto.title;
    imagen.style.width = '50px';
    imagen.style.height = 'auto';
    li.appendChild(imagen);

    // Crear el texto con el título y el precio
    let textoProducto = document.createTextNode(`${producto.title} - $${producto.price}`);
    li.appendChild(textoProducto);

    // Crear los botones de acción
    const botones = crearBotonesDeAccion(producto);
    li.appendChild(botones.botonAgregar);
    li.appendChild(botones.botonFavorito);
    li.appendChild(botones.botonMeGusta);
    li.appendChild(botones.botonNoMeGusta);

    // Agregar el evento de clic para obtener detalles del producto
    li.addEventListener('click', () => {
        obtenerDetallesProducto(producto.id);
    });

    return li;
}



///CREACION DE LA VISTA TABLA
let thead = document.createElement('thead');
let encabezado = document.createElement('tr');
let thImg = document.createElement('th');
thImg.textContent = "Imagen";
let thProducto = document.createElement('th');
thProducto.textContent = 'Producto';
let thPrecio = document.createElement('th');
thPrecio.textContent = 'Precio';
let thboton = document.createElement('th');
thboton.textContent = 'Añadir';
encabezado.appendChild(thImg);
encabezado.appendChild(thProducto);
encabezado.appendChild(thPrecio);
encabezado.appendChild(thboton);
thead.appendChild(encabezado);

function crearTablaHTML(productos) {
    table = document.createElement('table');
    tbody = document.createElement('tbody');

    productos.forEach((producto) => {
        let filas = crearFilasTabla(producto);
        tbody.appendChild(filas);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}


/////CREACION DE LA VISTA LISTA
function crearListaHTML(productos) {
    ul = document.createElement('ul');
    productos.forEach(producto => {
        let li = crearElementoLista(producto);
        ul.appendChild(li);
    });
    return ul;
}

///FUNCION para añadir mas elementos a la lista al hacer scroll 
function añadirElementoALista(productos) {
    productos.forEach(producto => {
        let li = crearElementoLista(producto);
        ul.appendChild(li);
    });
}


//Funcion para añadir mas elementos a la tabla al hacer scroll
function añadirElementoATabla(productos) {
    productos.forEach((producto) => {
        let filas = crearFilasTabla(producto);
        tbody.appendChild(filas);
    })
}

// Función para renderizar la lista de productos
async function renderizarLista() {
    let nuevosProductos = await obtenerProductos();
    // Eliminar cualquier contenido existente en el contenedor
    contenedor_productos.innerHTML = "";
    // Agregar los nuevos productos como una tabla
    contenedor_productos.appendChild(crearListaHTML(nuevosProductos));

}

// Función para renderizar la tabla de productos
async function renderizarTabla() {
    let nuevosProductos = await obtenerProductos();
    // Eliminar cualquier contenido existente en el contenedor
    contenedor_productos.innerHTML = "";
    // Agregar los nuevos productos como una tabla
    contenedor_productos.appendChild(crearTablaHTML(nuevosProductos));
}

//Funcion que carga mas productos al hacer scroll
async function cargarMasProductos() {
    try {
        // Realizar una solicitud para obtener más productos
        let nuevosProductos = await obtenerProductos();

        // Agregar los nuevos productos al final del contenedor
        if (vistaActual === 'lista') {
            contenedor_productos.appendChild(añadirElementoALista(nuevosProductos));
        } else if (vistaActual === 'tabla') {
            contenedor_productos.appendChild(añadirElementoATabla(nuevosProductos));
        }
    } catch (error) {
        console.error('Error al cargar más productos:', error);
    }
}

// Cargar los primeros productos cuando se carga la página
renderizarLista(); 
