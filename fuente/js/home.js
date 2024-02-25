let contenedor_productos = document.getElementById('productos');
let listaBtn = document.getElementById('listaBtn');
let tablaBtn = document.getElementById('tablaBtn');
let url_productos = 'https://fakestoreapi.com/products';
let asc = document.getElementById('asc');
let desc = document.getElementById('desc');
let ordenar = false;
let tipoOrden = "";
let ul;
let table;
let tbody;
let vistaActual = "lista";

// Función para cambiar a la vista de lista
listaBtn.addEventListener('click', () => {
    vistaActual = 'lista';
    console.log(vistaActual);
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
    console.log(vistaActual);
    if (vistaActual == "lista") {
        renderizarLista();
    }else{
        renderizarTabla();
    }
    
});

desc.addEventListener('click', () => {
    ordenar = true;
    tipoOrden = "desc";
    console.log(vistaActual);
    if (vistaActual == "lista") {
        renderizarLista();
    }else{
        renderizarTabla();
    }
});

async function obtenerProductos(){
    try {
        let response;
        if (ordenar && tipoOrden == "asc") {
            response = await fetch(`${url_productos}?sort=${tipoOrden}`);
        }else if (ordenar && tipoOrden == "desc"){
            response = await fetch(`${url_productos}?sort=${tipoOrden}`);
        }else{
           response = await fetch(url_productos);
        }

       let productos = await response.json(); 
        return productos;
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}


let thead = document.createElement('thead');
let encabezado = document.createElement('tr');
let thImg = document.createElement('th');
thImg.textContent = "Imagen";
let thProducto = document.createElement('th');
thProducto.textContent = 'Producto';
let thPrecio = document.createElement('th');
thPrecio.textContent = 'Precio';
encabezado.appendChild(thImg);
encabezado.appendChild(thProducto);
encabezado.appendChild(thPrecio);
thead.appendChild(encabezado);

function crearTablaHTML(productos) {
    table = document.createElement('table');
    tbody = document.createElement('tbody');
    
    productos.forEach(producto => {
        let fila = document.createElement('tr');

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

        // Agregar las celdas a la fila
        fila.appendChild(celdaImagen);
        fila.appendChild(celdaTitulo);
        fila.appendChild(celdaPrecio);

        // Agregar la fila al tbody
        tbody.appendChild(fila);
    });
    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function crearListaHTML(productos) {
    ul = document.createElement('ul');
    productos.forEach(producto => {
        let li = document.createElement('li');
        let imagen = document.createElement('img');
        imagen.src = producto.image;
        imagen.alt = producto.title;
        imagen.style.width = '50px';
        imagen.style.height = 'auto';
        li.appendChild(imagen);
        li.appendChild(document.createTextNode(`${producto.title} - $${producto.price}`));
        ul.appendChild(li);
    });
    return ul;
}

function añadirElementoALista(productos) {
    productos.forEach(producto => {
        let li = document.createElement('li');
        let imagen = document.createElement('img');
        imagen.src = producto.image;
        imagen.alt = producto.title;
        imagen.style.width = '50px';
        imagen.style.height = 'auto';
        li.appendChild(imagen);
        li.appendChild(document.createTextNode(`${producto.title} - $${producto.price}`));
        ul.appendChild(li);
    });
}

function añadirElementoATabla(productos) {
    productos.forEach(producto => {
        let fila = document.createElement('tr');

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

        // Agregar las celdas a la fila
        fila.appendChild(celdaImagen);
        fila.appendChild(celdaTitulo);
        fila.appendChild(celdaPrecio);

        // Agregar la fila al tbody
        tbody.appendChild(fila);
    });
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

window.addEventListener('scroll', async () => {
    if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight) {
        // Si el usuario ha llegado al final de la página, carga más productos
        await cargarMasProductos();
    }
});
// Cargar los primeros productos cuando se carga la página
renderizarLista(); 
