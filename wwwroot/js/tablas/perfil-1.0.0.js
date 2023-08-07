window.onload = BuscarPerfil();



function BuscarPerfil(usuarioID){
    /* $.ajax({
    // la URL para la petición
    url : '../../Usuarios/BuscarUsuarios',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data : { usuarioID: usuarioID },    
    // especifica si será una petición POST o GET
    type : 'GET',
    // el tipo de información que se espera de respuesta
    dataType : 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(usuario) {
        if (usuario){
            let usuario = usuarios[0];
            console.log(usuario);
            $("#age").val(usuario.usuarioID);
            $("#userName").val(usuario.nombre);
            $("#ubication").val(usuario.apellido);            
        }
    },
    error : function(xhr, status) {
        alert('Error al cargar servicios');
        document.getElementById("alerta").innerHTML = "Error al cargar usuario";
    }
}); */
}


