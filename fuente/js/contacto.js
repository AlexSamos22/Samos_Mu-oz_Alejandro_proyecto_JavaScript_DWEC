let nombre_usuario = document.getElementById("nombre_usuario");
let correo = document.getElementById("correo");
let asunto = document.getElementById("asunto");
let descripcion = document.getElementById("descripcion");
let enviar = document.getElementById("enviar");
// Deshabilitar el campo de correo electrónico al cargar la página
correo.disabled = true;
asunto.disabled = true;
descripcion.disabled = true;
enviar.disabled = true;

nombre_usuario.addEventListener('input', () => {
    let usuarioValor = nombre_usuario.value;
    let regexUsuario = /^[a-zA-Z0-9][a-zA-Z0-9_\-\.]*$/.test(usuarioValor);

    
    if (!regexUsuario || usuarioValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        correo.disabled = true;
        asunto.disabled = true;
        descripcion.disabled = true;
        enviar.disabled = true;
        nombre_usuario.setCustomValidity('El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
        mostrarMensajeError(nombre_usuario, 'El nombre de usuario debe contener al menos una letra y un número y solo puede tener los caracteres _ - .');
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        correo.disabled = false;
        nombre_usuario.setCustomValidity('');
        quitarMensajeError(nombre_usuario);
    }
});

correo.addEventListener('input', () => {
    let correoValor = correo.value;
    let regexCorreo = /[a-zA-Z0-9_.-]+@[a-z]+\.[a-z]{2,3}$/.test(correoValor);

    
    if (!regexCorreo || correoValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        asunto.disabled = true;
        descripcion.disabled = true;
        enviar.disabled = true;
        correo.setCustomValidity('El correo solo puede contener letras, numeros y - _ .');
        mostrarMensajeError(correo, "El correo solo puede contener letras, numeros y - _ .")
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        asunto.disabled = false;
        correo.setCustomValidity('');
        quitarMensajeError(correo)
    }
});

asunto.addEventListener('input', () => {
    let asuntoValor = asunto.value;
    let regexAsunto = /^[a-zA-Z0-9]+[ a-zA-Z0-9]*$/.test(asuntoValor);

    
    if (!regexAsunto || asuntoValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        descripcion.disabled = true;
        enviar.disabled = true;
        asunto.setCustomValidity('El asunto solo puede contener letras, numeros y espacios');
        mostrarMensajeError(asunto, 'El asunto solo puede contener letras, numeros y espacios');
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        descripcion.disabled = false;
        asunto.setCustomValidity('');
        quitarMensajeError(asunto);
    }
});

descripcion.addEventListener('input', () => {
    let descripcionValor = descripcion.value;
    let regexDescripcion = /^[a-zA-Z0-9,. ]*$/.test(descripcionValor);
    if (!regexDescripcion || descripcionValor === "") {
        // Si el nombre de usuario no es válido o está vacío, deshabilitar el campo de correo electrónico
        enviar.disabled = true;
        descripcion.setCustomValidity('La descripcion solo puede contener letras, numeros, espacios y comas');
        mostrarMensajeError(descripcion, 'La descripcion solo puede contener letras, numeros, espacios y comas')
    } else {
        // Si el nombre de usuario es válido, habilitar el campo de correo electrónico
        enviar.disabled = false;
        descripcion.setCustomValidity('');
        quitarMensajeError(descripcion);
    }
});

function mostrarMensajeError(elemento, mensaje) {
    let mensajeError = elemento.nextElementSibling;
    if (!mensajeError || !mensajeError.classList.contains('mensaje-error')) {
        mensajeError = document.createElement('div');
        mensajeError.classList.add('mensaje-error');
        elemento.parentNode.insertBefore(mensajeError, elemento.nextSibling);
    }
    mensajeError.textContent = mensaje;
}

function quitarMensajeError(elemento) {
    let mensajeError = elemento.nextElementSibling;
    if (mensajeError && mensajeError.classList.contains('mensaje-error')) {
        mensajeError.remove();
    }
}