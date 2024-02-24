let contenedor_productos = document.getElementById('productos');
let listaBtn = document.getElementById('listaBtn');
let tablaBtn = document.getElementById('tablaBtn');
let url_productos = 'https://fakestoreapi.com/products';
let asc = document.getElementById('asc');
let desc = document.getElementById('desc');

let productosPorPagina = 15; // Cantidad de productos a cargar en cada carga
let vistaActual = "lista";

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
    
});

let table = document.createElement('table');
let thead = document.createElement('thead');
let tbody = document.createElement('tbody');

let encabezado = document.createElement('tr');
let thProducto = document.createElement('th');
thProducto.textContent = 'Producto';
let thPrecio = document.createElement('th');
thPrecio.textContent = 'Precio';
encabezado.appendChild(thProducto);
encabezado.appendChild(thPrecio);
thead.appendChild(encabezado);

function crearTablaHTML(productos) {

    productos.forEach(producto => {
        let fila = document.createElement('tr');
        let celdaProducto = document.createElement('td');
        let imagen = document.createElement('img');
        imagen.src = producto.image;
        imagen.alt = producto.title;
        imagen.style.width = '50px';
        imagen.style.height = 'auto';
        celdaProducto.appendChild(imagen);
        celdaProducto.appendChild(document.createTextNode(producto.title));
        let celdaPrecio = document.createElement('td');
        celdaPrecio.textContent = `$${producto.price}`;
        fila.appendChild(celdaProducto);
        fila.appendChild(celdaPrecio);
        tbody.appendChild(fila);
    });

    table.appendChild(thead);
    table.appendChild(tbody);
    return table;
}

function crearListaHTML(productos) {
    let ul = document.createElement('ul');
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


async function obtenerProductos(){
    try {
        let response = await fetch(url_productos);
        let productos = await response.json();
        return productos;
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
}

// Función para renderizar la lista de productos
async function renderizarLista() {
    let nuevosProductos = await obtenerProductos();
    // Eliminar cualquier contenido existente en el contenedor
    contenedor_productos.innerHTML = '';
    // Agregar los nuevos productos como una tabla
    contenedor_productos.appendChild(crearListaHTML(nuevosProductos));

}

// Función para renderizar la tabla de productos
async function renderizarTabla() {
    let nuevosProductos = await obtenerProductos();
    // Eliminar cualquier contenido existente en el contenedor
    contenedor_productos.innerHTML = '';
    // Agregar los nuevos productos como una tabla
    contenedor_productos.appendChild(crearTablaHTML(nuevosProductos));
}

async function cargarMasProductos() {
    try {
        // Realizar una solicitud para obtener más productos
        let nuevosProductos = await obtenerProductos();

        // Agregar los nuevos productos al final del contenedor
        if (vistaActual === 'lista') {
            contenedor_productos.appendChild(crearListaHTML(nuevosProductos));
        } else if (vistaActual === 'tabla') {
            contenedor_productos.appendChild(crearTablaHTML(nuevosProductos));
        }
    } catch (error) {
        console.error('Error al cargar más productos:', error);
    }
}

window.addEventListener('scroll', async () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 100) {
        // Si el usuario ha llegado al final de la página, carga más productos
        await cargarMasProductos();
    }
});
// Cargar los primeros productos cuando se carga la página
renderizarLista(); 
