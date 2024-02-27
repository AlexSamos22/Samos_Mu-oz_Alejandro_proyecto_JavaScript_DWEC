let abrir_registro = document.getElementById('abrir_registro');
let registro = document.getElementById('registro');
let login = document.getElementById('login');
let abrir_login = document.getElementById('abrir_login');
let iniciar_session = document.getElementById('inciar_sesion');
let registrarse = document.getElementById('registarse');
let usuarioInput = document.getElementById('usuario');
let correoInput = document.getElementById('correo');
let claveInput = document.getElementById('Clave');
let nombreInput = document.getElementById('Nombre');
let apellidosInput = document.getElementById('apellidos');
let telefonoInput = document.getElementById('telefono');
let edadInput = document.getElementById('edad');
let dniInput = document.getElementById('dni');
const url_usuarios = 'https://fakestoreapi.com/users';

correoInput.disabled = true;
claveInput.disabled = true;
nombreInput.disabled = true;
apellidosInput.disabled = true;
telefonoInput.disabled = true;
edadInput.disabled = true;
dniInput.disabled = true;
registrarse.disabled = true;

async function obtener_usuarios_api_y_comprobar(url_usuarios, nombre, clave) {
    try {
        let respuesta = await fetch(url_usuarios);
        if (!respuesta.ok) {
            throw new Error('Error al obtener usuarios')
        }

        let json = await respuesta.json();
        for (let i = 0; i < json.length; i++) {
            if (json[i].username == nombre && json[i].password == clave) {
                return true;
            }
        }

        return false;
    } catch (error) {
        console.error('Error al obtener usuarios:', error);
    }
};

function comprobarUsuario_local(nombreUsuario, contraseña) {
    let usuarioGuardado = JSON.parse(localStorage.getItem(nombreUsuario));

    if (usuarioGuardado) {
        if (usuarioGuardado.contraseña === contraseña) {
            return true;
        } else {
            return false;
        }
    } else {
        return false;
    }
}

iniciar_session.addEventListener('click', async (evento) => {
    evento.preventDefault();
    let nombre_usuario = document.getElementById('nombre').value;
    let clave = document.getElementById('clave').value;

    try {
        let resultado = await obtener_usuarios_api_y_comprobar(url_usuarios, nombre_usuario, clave);
        let usuario_local = comprobarUsuario_local(nombre_usuario, clave);
        if (resultado || usuario_local) {
            alert("Sesion iniciada");

            let sesionNombreUsuario = JSON.parse(localStorage.getItem(nombre_usuario));
            let listaFavoritos = [];
            let articulosCarrito = [];

            if (sesionNombreUsuario) {
                listaFavoritos = sesionNombreUsuario.favoritos;
                articulosCarrito = sesionNombreUsuario.carrito;
            }

            let sesionIniciada = {
                nombreUsuario: nombre_usuario,
                carrito: articulosCarrito,
                favoritos: listaFavoritos
            };
            localStorage.setItem('sesion_iniciada', JSON.stringify(sesionIniciada));

            window.location.href = "../index.html";
        } else {
            alert("No se ha podido iniciar sesion");
        }
    } catch (error) {
        console.error('Error al comprobar usuario:', error);
    }
});


registrarse.addEventListener('click', (evento) => {
    evento.preventDefault();

    let usuarios = {
        nombreUsuario: usuarioInput.value,
        correo: correoInput.value,
        contraseña: claveInput.value,
        nombre: {
            nombre: nombreInput.value,
            apellidos: apellidosInput.value
        },
        telefono: telefonoInput.value,
        edad: edadInput.value,
        DNI: dniInput.value,
        favoritos: [],
        carrito: []
    };

    localStorage.setItem(usuarioInput.value, JSON.stringify(usuarios));

    alert("Usuario creado con exito");
    login.classList.remove('oculto');
    registro.classList.add('oculto');

    usuarioInput.value = "";
    correoInput.value= "";
    claveInput.value = "";
    nombreInput.value = "";
    apellidosInput.value = "";
    telefonoInput.value = "";
    edadInput.value = "";
    dniInput.value= "";
    registrarse.value = "";
});


abrir_registro.addEventListener('click', (evento) => {
    evento.preventDefault();
    registro.classList.remove('oculto');
    login.classList.add('oculto');
});

abrir_login.addEventListener('click', (evento) => {
    evento.preventDefault();
    login.classList.remove('oculto');
    registro.classList.add('oculto');
});


// Event Listener para el campo de Usuario
usuarioInput.addEventListener('input', function () {
    let usuarioValor = usuarioInput.value;
    let regexUsuario = /^[a-zA-Z0-9][a-zA-Z0-9_\-\.]*$/.test(usuarioValor);

    if (!regexUsuario || usuarioValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        correoInput.disabled = true;
        claveInput.disabled = true;
        nombreInput.disabled = true;
        apellidosInput.disabled = true;
        telefonoInput.disabled = true;
        edadInput.disabled = true;
        dniInput.disabled = true;
        registrarse.disabled = true;
        usuarioInput.setCustomValidity('El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
        mostrarMensajeError("usuario", 'El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        correoInput.disabled = false;
        usuarioInput.setCustomValidity('');
        quitarMensajeError("usuario");
    }
});

// Event Listener para el campo de Correo
correoInput.addEventListener('input', function () {
    let correoValor = correoInput.value;
    let regexCorreo = /[a-zA-Z0-9_.-]+@[a-z]+\.[a-z]{2,3}$/.test(correoValor);

    if (!regexCorreo || correoValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        claveInput.disabled = true;
        nombreInput.disabled = true;
        apellidosInput.disabled = true;
        telefonoInput.disabled = true;
        edadInput.disabled = true;
        dniInput.disabled = true;
        registrarse.disabled = true;
        correoInput.setCustomValidity('El correo solo puede contener letras, numeros y - _ .');
        mostrarMensajeError("correo", "El correo solo puede contener letras, numeros y - _ .");
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        claveInput.disabled = false;
        correoInput.setCustomValidity('');
        quitarMensajeError("correo");

    }
});

// Event Listener para el campo de Clave
claveInput.addEventListener('input', function () {
    let claveValor = claveInput.value;
    let regexClave = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[_\-.@])[A-Za-z\d_\-.@]*/.test(claveValor);

    if (!regexClave || claveValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        nombreInput.disabled = true;
        apellidosInput.disabled = true;
        telefonoInput.disabled = true;
        edadInput.disabled = true;
        dniInput.disabled = true;
        registrarse.disabled = true;
        claveInput.setCustomValidity('La contraseña debe contener al menos una minuscula, una mayuscula, un numero y un _ , - o .');
        mostrarMensajeError("contraseña", "La contraseña debe contener al menos una minuscula, una mayuscula, un numero y un _ , - o .");
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        nombreInput.disabled = false;
        claveInput.setCustomValidity('');
        quitarMensajeError("contraseña");
    }
});

// Event Listener para el campo de Nombre
nombreInput.addEventListener('input', function () {
    let nombreValor = nombreInput.value;
    let regexNombre = /^[a-zA-Z]+$/.test(nombreValor);

    if (!regexNombre || nombreValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        apellidosInput.disabled = true;
        telefonoInput.disabled = true;
        edadInput.disabled = true;
        dniInput.disabled = true;
        registrarse.disabled = true;
        nombreInput.setCustomValidity('El nombre solo puede contener letras');
        mostrarMensajeError("Nombre", "El nombre solo puede contener letras");
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        apellidosInput.disabled = false;
        nombreInput.setCustomValidity('');
        quitarMensajeError("Nombre");
    }
});

// Event Listener para el campo de Apellidos
apellidosInput.addEventListener('input', function () {
    let apellidosValor = apellidosInput.value;
    let regexApellidos = /^[A-Za-z]+ [A-Za-z]+$/.test(apellidosValor);

    if (!regexApellidos || apellidosValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        telefonoInput.disabled = true;
        edadInput.disabled = true;
        dniInput.disabled = true;
        registrarse.disabled = true;
        apellidosInput.setCustomValidity('Los apellidos deben contener solo letras y estar separados por un espacio');
        mostrarMensajeError("Apellidos", "Los apellidos deben contener solo letras y estar separados por un espacio");
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        telefonoInput.disabled = false;
        apellidosInput.setCustomValidity('');
        quitarMensajeError("Apellidos");
    }
});

// Event Listener para el campo de Teléfono
telefonoInput.addEventListener('input', function () {
    let telfValor = telefonoInput.value;
    let regexTelf = /^\d{9}$/.test(telfValor);

    if (!regexTelf || telfValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        edadInput.disabled = true;
        dniInput.disabled = true;
        registrarse.disabled = true;
        telefonoInput.setCustomValidity('Telefono no valido');
        mostrarMensajeError("Telf", "Telefono no valido");
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        edadInput.disabled = false;
        telefonoInput.setCustomValidity('');
        quitarMensajeError("Telf");
    }
});

// Event Listener para el campo de Edad
edadInput.addEventListener('input', function () {
    let edadfValor = edadInput.value;

    if (edadfValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        dniInput.disabled = true;
        registrarse.disabled = true;
        edadInput.setCustomValidity('La edad no puede estar vacia');
        mostrarMensajeError("Edad", "La edad no puede estar vacia");
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        dniInput.disabled = false;
        edadInput.setCustomValidity('');
        quitarMensajeError("Edad");
    }
});

// Event Listener para el campo de DNI
dniInput.addEventListener('input', function () {
    let dniValor = dniInput.value;
    let regexDNI = /^\d{8}[a-zA-Z]$/.test(dniValor);

    if (!regexDNI || dniValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        registrarse.disabled = true;
        telefonoInput.setCustomValidity('Formato de DNI no valido');
        mostrarMensajeError("DNI", "Formato de DNI no valido");
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        registrarse.disabled = false;
        telefonoInput.setCustomValidity('');
        quitarMensajeError("DNI");
    }
});

function mostrarMensajeError(campoError, mensaje) {
    let parrafo = document.getElementById(`error_${campoError}`);
    parrafo.classList.add('mensaje-error');
    parrafo.textContent = mensaje;
}

function quitarMensajeError(campoError) {
    let parrafo = document.getElementById(`error_${campoError}`);
    parrafo.classList.remove('mensaje-error');
    parrafo.textContent = "";
}