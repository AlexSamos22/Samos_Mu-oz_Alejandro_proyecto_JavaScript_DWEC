let nombre_usuario = document.getElementById("nombre_usuario");
let correo = document.getElementById("correo");
let asunto = document.getElementById("asunto");
let descripcion = document.getElementById("descripcion");
let enviar = document.getElementById("enviar");
let form = document.querySelector(".form-contacto");

// Deshabilitar todos los campos menos el de nombre de usuario
correo.disabled = true;
asunto.disabled = true;
descripcion.disabled = true;
enviar.disabled = true;

//Eveto para que al mandar el formulario no se recargue la pagina
form.addEventListener("submit", (evento) =>{
    evento.preventDefault();
});

//Evento para verificar el nombre del usuario
nombre_usuario.addEventListener('input', () => {
    let usuarioValor = nombre_usuario.value;
    let regexUsuario = /^[a-zA-Z0-9][a-zA-Z0-9_\-\.]*$/.test(usuarioValor);

    if (!regexUsuario || usuarioValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilita los campos demas campos
        correo.disabled = true;
        asunto.disabled = true;
        descripcion.disabled = true;
        enviar.disabled = true;
        nombre_usuario.setCustomValidity('El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
        mostrarMensajeError("usuario", 'El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        correo.disabled = false;
        nombre_usuario.setCustomValidity('');
        quitarMensajeError("usuario");
    }
});

//Evento para verificar el correo
correo.addEventListener('input', () => {
    let correoValor = correo.value;
    let regexCorreo = /[a-zA-Z0-9_.-]+@[a-z]+\.[a-z]{2,3}$/.test(correoValor);

    
    if (!regexCorreo || correoValor === "") {
        // Si el correo no es válido o está vacío, deshabilitar los campos que estan debajo de el
        asunto.disabled = true;
        descripcion.disabled = true;
        enviar.disabled = true;
        correo.setCustomValidity('El correo solo puede contener letras, numeros y - _ .');
        mostrarMensajeError("correo", "El correo solo puede contener letras, numeros y - _ .")
    } else {
        // Si el correo es válido, habilitar el campo de asunto
        asunto.disabled = false;
        correo.setCustomValidity('');
        quitarMensajeError("correo")

    }
});

//Evento para verificar el asunto
asunto.addEventListener('input', () => {
    let asuntoValor = asunto.value;
    let regexAsunto = /^[a-zA-Z0-9]+[ a-zA-Z0-9]*$/.test(asuntoValor);

    
    if (!regexAsunto || asuntoValor === "") {
        // Si el asunto no es válido o está vacío, deshabilitar los campos de debajo
        descripcion.disabled = true;
        enviar.disabled = true;
        asunto.setCustomValidity('El asunto solo puede contener letras, numeros y espacios');
        mostrarMensajeError("asunto", 'El asunto solo puede contener letras, numeros y espacios');
    } else {
        // Si el asunto es válido, habilitar el campo de descripcion
        descripcion.disabled = false;
        asunto.setCustomValidity('');
        quitarMensajeError("asunto");
    }
});

//Evento para verificar la descripcion
descripcion.addEventListener('input', () => {
    let descripcionValor = descripcion.value;
    let regexDescripcion = /^[a-zA-Z0-9,. ]*$/.test(descripcionValor);
    if (!regexDescripcion || descripcionValor === "") {
        // Si la descripcion no es válida o está vacía, deshabilitar el campo de abajo
        enviar.disabled = true;
        descripcion.setCustomValidity('La descripcion solo puede contener letras, numeros, espacios y comas');
        mostrarMensajeError("descripcion", 'La descripcion solo puede contener letras, numeros, espacios y comas')
    } else {
        // Si la descripcion es válida, habilitar el boton de enviar
        enviar.disabled = false;
        descripcion.setCustomValidity('');
        quitarMensajeError("descripcion");
    }
});

//Evento que se lanza al mandar el formulario
enviar.addEventListener('click', (evento) => {
    evento.preventDefault(); 
    alert("Gracias por su mensaje, nos pondremos en contacto en breves momentos");
    nombre_usuario.value = "";
    correo.value = "";
    asunto.value = "";
    descripcion.value = "";
});

//Funcion para mostrar el mensaje de error al escribir mal un campo
function mostrarMensajeError(campoError, mensaje) {
   let parrafo = document.getElementById(`error_${campoError}`);
   parrafo.classList.add('mensaje-error');
   parrafo.textContent = mensaje;
}

//Fucion para quitar el mensaje de error al escribir bien un campo
function quitarMensajeError(campoError) {
    let parrafo = document.getElementById(`error_${campoError}`);
    parrafo.classList.remove('mensaje-error');
    parrafo.textContent = "";
}