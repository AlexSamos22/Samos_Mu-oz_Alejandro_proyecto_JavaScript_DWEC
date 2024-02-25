let abrir_registro = document.getElementById('abrir_registro');
let registro = document.getElementById('registro');
let login = document.getElementById('login');
let abrir_login = document.getElementById('abrir_login');
let iniciar_session = document.getElementById('inciar_sesion');
let registrarse = document.getElementById('registarse');

const url_usuarios = 'https://fakestoreapi.com/users';



async function obtener_usuarios_api_y_comprobar(url_usuarios, nombre, clave) {
   try {
     let respuesta = await fetch(url_usuarios);
     if (!respuesta.ok){
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

iniciar_session.addEventListener('click', async (evento)=>{
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

            if (sesionNombreUsuario) {
                listaFavoritos = sesionNombreUsuario.favoritos;
            }

            let carrito = [];
            let sesionIniciada = {
                nombreUsuario: nombre_usuario,
                carrito: carrito,
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


registrarse.addEventListener('click', (evento) =>{
    evento.preventDefault();
    let usuarioInput = document.getElementById('usuario');
    let claveInput = document.getElementById('Clave');
    let nombreInput = document.getElementById('Nombre');
    let apellidosInput = document.getElementById('apellidos');
    let telefonoInput = document.getElementById('telefono');
    let edadInput = document.getElementById('edad');
    let dniInput = document.getElementById('dni');

    let usuarios = {
        nombreUsuario: usuarioInput.value,
        contraseña: claveInput.value,
        nombre: {
            nombre: nombreInput.value,
            apellidos: apellidosInput.value
        },
        telefono: telefonoInput.value,
        edad: edadInput.value,
        DNI: dniInput.value,
        favoritos: [],
    };

    localStorage.setItem(usuarioInput.value,  JSON.stringify(usuarios));

    alert("Usuario creado con exito");
    login.classList.remove('oculto');
    registro.classList.add('oculto');
});


abrir_registro.addEventListener('click', (evento)=>{
    evento.preventDefault();
    registro.classList.remove('oculto');
    login.classList.add('oculto');
});

abrir_login.addEventListener('click', (evento)=>{
    evento.preventDefault();
    login.classList.remove('oculto');
    registro.classList.add('oculto');
});

