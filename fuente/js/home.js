let contenedor_productos = document.getElementById('productos');
let contenedor_botones = document.getElementById('botones');
let listaBtn = document.getElementById('listaBtn');
let tablaBtn = document.getElementById('tablaBtn');
let cerrarSesion = document.getElementById('cerrar_sesion');
let asc = document.getElementById('asc');
let desc = document.getElementById('desc');
let electronica = document.getElementById('electronica');
let joyeria = document.getElementById('joyeria');
let ropaM = document.getElementById('ropaM');
let ropaH = document.getElementById('ropaH');
let titulo = document.getElementById("titulo");
let carrito = document.querySelector('.carrito');



let url_productos = 'https://fakestoreapi.com/products';
let ordenar = false;
let tipoOrden = "";
let ul;
let table;
let tbody;
let vistaActual = "lista";
let categoria = false;
let categoriaSelecionada = "";
let masProductos = false;
// Definir una variable para el número máximo de productos a cargar en cada llamada
const productosPorPagina = 20;

// Variable para el número total de productos cargados
let totalProductosCargados = 0;

//Evento para poder cerrar sesion, y guardar el carrito actual y los favoritos del usuario en una sesion local propia por usuario
cerrarSesion.addEventListener('click', (evento) => {
    evento.preventDefault();

    // Obtener la sesión actual del usuario
    let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada'));

    if (sesionIniciada) {
        // Obtener el nombre de usuario
        let nombreUsuario = sesionIniciada.nombreUsuario;

        // Obtener los favoritos del usuario actual
        let usuario = JSON.parse(localStorage.getItem(nombreUsuario));
        let nuevosFavoritos = sesionIniciada.favoritos || [];
        let nuevoCarrito = sesionIniciada.carrito || [];
        if (!usuario) {
            usuario = {
                nombreUsuario: nombreUsuario,
                favoritos: [],
                carrito: []
            };
        }

        usuario.favoritos = [];
        usuario.carrito = [];

        // Agregar los nuevos favoritos a la lista existente de favoritos del usuario
        usuario.favoritos.push(...nuevosFavoritos);
        usuario.carrito.push(...nuevoCarrito);

        // Guardar los cambios en el localStorage
        localStorage.setItem(nombreUsuario, JSON.stringify(usuario));

        // Eliminar la sesión actual
        localStorage.removeItem('sesion_iniciada');

        alert("Hasta la próxima");
        location.reload();
    } else {
        // Si no hay sesión iniciada, simplemente redirige al usuario
        alert("No hay sesión iniciada");
    }
});

// Evento para cambiar a la vista de lista
listaBtn.addEventListener('click', () => {
    vistaActual = 'lista';
    renderizarLista();
});

// Evento para cambiar a la vista de tabla
tablaBtn.addEventListener('click', () => {
    vistaActual = 'tabla';
    renderizarTabla();
});

//Evento que realiza el orden ascendente de los productos
asc.addEventListener('click', () => {
    ordenar = true;
    tipoOrden = "asc";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }

});

//Evento que realiza el orden descendente de los productos
desc.addEventListener('click', () => {
    ordenar = true;
    tipoOrden = "desc";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }
});

//Evento que cambia el contenedor y muestra solo la seccion joyeria
joyeria.addEventListener("click", (evento) =>{
    evento.preventDefault();
    titulo.innerHTML = "Seccion Joyeria";
    categoria = true;
    categoriaSelecionada = "category/jewelery";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }
});

//Evento que cambia el contenedor y muestra solo la seccion electronica
electronica.addEventListener("click", (evento) =>{
    evento.preventDefault();
    titulo.innerHTML = "Seccion Electronica";
    categoria = true;
    categoriaSelecionada = "category/electronics";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }
});

//Evento que cambia el contenedor y muestra solo la seccion ropa hombre
ropaH.addEventListener("click", (evento) =>{
    evento.preventDefault();
    titulo.innerHTML = "Secccion Hombres";
    categoria = true;
    categoriaSelecionada = "category/men's clothing";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }
});

//Evento que cambia el contenedor y muestra solo la seccion ropa mujer
ropaM.addEventListener("click", (evento) =>{
    evento.preventDefault();
    titulo.innerHTML = "Seccion Mujeres";
    categoria = true;
    categoriaSelecionada = "category/women's clothing";
    if (vistaActual == "lista") {
        renderizarLista();
    } else {
        renderizarTabla();
    }
});


//Evento que controla el escroll infinito de la pagina
window.addEventListener('scroll', async () => {
    if (!masProductos && (window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
        masProductos = true;
        await cargarMasProductos();
        masProductos = false;
    }
});


///Funciones para obtener los productos y crear las vistas
async function obtenerProductos(offset) {
    try {
        let response;
        let url;
        //  URL para obtener los productos con el offset y la cantidad de productos por página
        if (categoria) {
            url = `${url_productos}/${categoriaSelecionada}?limit=${productosPorPagina}&offset=${offset}`
        }else{
            url = `${url_productos}?limit=${productosPorPagina}&offset=${offset}`;
        }
        
        // Si se le da a ordenar se cambia la url
        if (ordenar && tipoOrden) {
            url += `&sort=${tipoOrden}`;
        }

        response = await fetch(url);
        let nuevosProductos = await response.json();
        
        return nuevosProductos;
    } catch (error) {
        console.error('Error al obtener productos:', error);
        throw error;
    }
}

//Funcion que se encarga de add productos al carrito al dar al boton add al carrito
function addProductoAlCarrito(producto) {
    let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada'));

    //Si no esta la sesion_iniciada no se puede ver el carrito
    if (!sesionIniciada) {
        alert("Debes iniciar sesion para add productos al carrito");
    }else{
        let unidadesProd = document.getElementById(`input-${producto.id}`)
        carrito.classList.add('animacion-carrito');
        setTimeout(() => {
            carrito.classList.remove('animacion-carrito');
        }, 1000);
    
        let producto_add = {
            id: producto.id,
            image: producto.image,
            title: producto.title,
            price: producto.price,
            unidades: parseInt(unidadesProd.value)
        };
    
    
        // Obtener el carrito del usuario
        let carritoUsuario = sesionIniciada.carrito;
    
        // Verificar si el producto ya está en el carrito
        let encontrado = false;
        carritoUsuario.forEach((articulo) => {
            if (producto.id == articulo.id) {
                articulo.unidades += producto_add.unidades;
                encontrado = true;
            }
        });
    
        // Si el producto no se encontró en el carrito, agregarlo
        if (!encontrado) {
            carritoUsuario.push(producto_add);
        }
    
        // Actualizar el carrito en el localStorage
        sesionIniciada.carrito = carritoUsuario;
        localStorage.setItem('sesion_iniciada', JSON.stringify(sesionIniciada));
    }
}

/*
    Funcion que crea los botones de: 
        -add a favoritos con su evento
        -Boton me gusta y no me gusta con sus eventos
        -Boton de add al carrito con su evento
*/
function crearBotonesDeAccion(producto) {

    // Botón "add al carrito"
    const botonAgregar = document.createElement('button');
    botonAgregar.textContent = 'Añadir al carrito';
    botonAgregar.addEventListener('click', (evento) => {
        evento.stopPropagation();
        addProductoAlCarrito(producto);
    });

    // Botón de favorito
    const botonFavorito = document.createElement('button');
    botonFavorito.innerHTML = '<i class="fas fa-heart"></i>';
    botonFavorito.classList.add('boton-favorito');
    let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada')) || {};
    let favoritos = sesionIniciada.favoritos || [];
    if (favoritos.includes(producto.id)) {
        // Si el ID del producto está en la lista de favoritos, aplicar un estilo diferente
        botonFavorito.classList.add('favorito-activo');
    }
    botonFavorito.addEventListener('click', (evento) => {
        evento.stopPropagation();

        // Obtener el objeto sesion_iniciada del localStorage
        let sesionIniciada = JSON.parse(localStorage.getItem('sesion_iniciada'));

        if (!sesionIniciada) {
            alert("Debes iniciar sesion para agregar productos a favoritos");
        }else{
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
        }
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
        let response = await fetch(`${url_productos}/${id}`);
        let producto = await response.json();

        titulo.innerHTML = producto.title;
        // Crear un div para mostrar los detalles del producto
        const detalleProductoDiv = document.createElement('div');
        detalleProductoDiv.classList.add('detalle-producto');

        // Crear elementos para mostrar la información del producto
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
        let botonesDeAccion = crearBotonesDeAccion(producto);

        //Unidades del producto
        let inputUnidades = document.createElement('input');
        inputUnidades.type = 'number';
        inputUnidades.id = `input-${producto.id}`;
        inputUnidades.value = 1; // Valor por defecto
        inputUnidades.min = 1; // Mínimo permitido
        inputUnidades.style.width = '40px'; // Ajustar el tamaño si es necesario
        inputUnidades.addEventListener('click', (evento) => {
            evento.stopPropagation();
        });

        // Botón para volver atrás
        const botonVolver = document.createElement('button');
        botonVolver.textContent = 'Volver';
        botonVolver.addEventListener('click', () => {
            contenedor_botones.classList.remove('oculto');
            if (vistaActual == "lista") {
                renderizarLista();
            }else{
                renderizarTabla();
            }
            
        });

        // Agregar elementos al div de detalles del producto
        contenedor_botones.classList.add('oculto');
        detalleProductoDiv.appendChild(imagenProducto);
        detalleProductoDiv.appendChild(precioProducto);
        detalleProductoDiv.appendChild(inputUnidades);
        detalleProductoDiv.appendChild(categoriaProducto);
        detalleProductoDiv.appendChild(descripcionProducto);

        // Agregar botones de acción al div de detalles del producto
        detalleProductoDiv.appendChild(botonesDeAccion.botonAgregar);
        detalleProductoDiv.appendChild(botonesDeAccion.botonFavorito);
        detalleProductoDiv.appendChild(botonVolver);

        // Agregar el div de detalles del producto al cuerpo del documento
        contenedor_productos.innerHTML = "";
        contenedor_productos.appendChild(detalleProductoDiv);
    } catch (error) {
        console.error('Error al obtener detalles del producto:', error);
    }
}

//Funcion que crea los elementos de la tabla
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

    // Celda para las unidades
    let celdaUnidades = document.createElement('td');
    let inputUnidades = document.createElement('input');
    inputUnidades.type = 'number';
    inputUnidades.id = `input-${producto.id}`;
    inputUnidades.value = 1; // Valor por defecto
    inputUnidades.min = 1; // Mínimo permitido
    inputUnidades.style.width = '40px'; // Ajustar el tamaño si es necesario
    inputUnidades.addEventListener('click', (evento) => {
        evento.stopPropagation();
    });
    celdaUnidades.appendChild(inputUnidades);

    // Celda para los botones de acción
    let celdaAcciones = document.createElement('td');
    celdaAcciones.classList.add("botonera");

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
    fila.appendChild(celdaUnidades);
    fila.appendChild(celdaAcciones);

    // Agregar el evento de clic a la fila para obtener detalles del producto
    fila.addEventListener('click', () => {
        obtenerDetallesProducto(producto.id);
    });

    return fila;
}

//Funcion que crea los elementos de la lista
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
    let textoProducto = document.createElement('p');
    textoProducto.textContent = `${producto.title} - $${producto.price}`
    li.appendChild(textoProducto);

    //Crear el campo de las unidades
    let inputUnidades = document.createElement('input');
    inputUnidades.type = 'number';
    inputUnidades.id = `input-${producto.id}`;
    inputUnidades.value = 1; // Valor por defecto
    inputUnidades.min = 1; // Mínimo permitido
    inputUnidades.style.width = '40px'; // Ajustar el tamaño si es necesario
    inputUnidades.addEventListener('click', (evento) => {
        evento.stopPropagation();
    });
    li.appendChild(inputUnidades);

    // Crear los botones de acción
    const botones = crearBotonesDeAccion(producto);
    let botonera = document.createElement('div');
    botonera.classList.add('botonera');
    botonera.appendChild(botones.botonAgregar);
    botonera.appendChild(botones.botonFavorito);
    botonera.appendChild(botones.botonMeGusta);
    botonera.appendChild(botones.botonNoMeGusta);

    li.appendChild(botonera);

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
let thUnidades = document.createElement('th');
thUnidades.textContent = 'Unidades';
let thboton = document.createElement('th');
thboton.textContent = 'Acciones';
encabezado.appendChild(thImg);
encabezado.appendChild(thProducto);
encabezado.appendChild(thPrecio);
encabezado.appendChild(thUnidades);
encabezado.appendChild(thboton);
thead.appendChild(encabezado);

function crearTablaHTML(productos) {
    table = document.createElement('table');
    table.classList.add('tabla-prod');
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
    ul.classList.add('lista-prod');
    productos.forEach(producto => {
        let li = crearElementoLista(producto);
        ul.appendChild(li);
    });
    return ul;
}

///FUNCION para añadir mas elementos a la lista al hacer scroll 
function addElementoALista(productos) {
    productos.forEach(producto => {
        let li = crearElementoLista(producto);
        ul.appendChild(li);
    });
}


//Funcion para añadir mas elementos a la tabla al hacer scroll
function addElementoATabla(productos) {
    productos.forEach((producto) => {
        let filas = crearFilasTabla(producto);
        tbody.appendChild(filas);
    })
}

// Función para renderizar la lista de productos
async function renderizarLista() {
    let nuevosProductos = await obtenerProductos(0); // Cargar los primeros productos
    // Eliminar cualquier contenido existente en el contenedor
    totalProductosCargados += nuevosProductos.length;
    contenedor_productos.innerHTML = "";
    // Agregar los nuevos productos como una lista
    contenedor_productos.appendChild(crearListaHTML(nuevosProductos));
}

// Función para renderizar la tabla de productos
async function renderizarTabla() {
    let nuevosProductos = await obtenerProductos(0); // Cargar los primeros productos
    // Eliminar cualquier contenido existente en el contenedor
    totalProductosCargados += nuevosProductos.length;
    contenedor_productos.innerHTML = "";
    // Agregar los nuevos productos como una tabla
    contenedor_productos.appendChild(crearTablaHTML(nuevosProductos));
}

//Funcion que carga mas productos al hacer scroll
async function cargarMasProductos() {
    try {
        // Realizar una solicitud para obtener más productos a partir del último producto cargado
        let nuevosProductos = await obtenerProductos(totalProductosCargados);

        if (nuevosProductos.length === 0) {
            console.log('No hay más productos para cargar.');
            return;
        }

        // Incrementar el contador de productos cargados
        totalProductosCargados += nuevosProductos.length;

        // Agregar los nuevos productos al final del contenedor
        if (vistaActual === 'lista') {
            addElementoALista(nuevosProductos);
        } else if (vistaActual === 'tabla') {
            addElementoATabla(nuevosProductos);
        }
    } catch (error) {
        console.error('Error al cargar más productos:', error);
    }
}

// Cargar los primeros productos cuando se carga la página
renderizarLista(); 
