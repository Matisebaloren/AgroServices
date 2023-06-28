window.onload = BuscarPerfiles();


function BuscarPerfiles(){
    console.log("prueba uno")

$("#tbody-perfiles").empty();

    $.ajax({
        // la URL para la petición
        url : '../../Usuarios/BuscarPerfiles',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : {},    
        // especifica si será una petición POST o GET
        type : 'GET',
        // el tipo de información que se espera de respuesta
        dataType : 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        
        success : function(perfiles) { 
            $("#tbody-perfiles").empty();
            let BotonDeshabilitado = '';
            $.each(perfiles, function(index, perfil) {
                if(perfil.eliminado == true){
                    BotonDeshabilitado = `
                    <tr class="table-danger" >
                        <td> ${usuario.nombre}</td>
                        <td> ${usuario.apellido}</td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-habilitar" onClick="DeshabilitarUsuario('${usuario.usuarioID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                else{
                    BotonDeshabilitado = `
                    <tr>
                        <td class=" danger" >${usuario.nombre} </td>
                        <td class=" danger"> ${usuario.apellido}</td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-editar" onClick="BuscarUsuario(${usuario.usuarioID})" role="button"></a>
                            <a class="btn btn-eliminar" onClick="DeshabilitarUsuario('${usuario.usuarioID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                $("#tbody-perfiles").append(`
                    ${BotonDeshabilitado}
                `);      
            });
        },
   
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error : function(xhr, status) {
            alert('Error al cargar usuarios');
        },
   
        // código a ejecutar sin importar si la petición falló o no
        complete : function(xhr, status) {
            //alert('Petición realizada');
        }
    });
}





function VaciarFormulario(){
    $("#Nombre").val('');
    $("#UsuarioID").val(0);
    document.getElementById("tituloModal").innerHTML = "Agregar Usuario";
}



function BuscarUsuario(usuarioID){
    $.ajax({
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
    success : function(usuarios) {
       
        if (usuarios.length == 1){
            let usuario = usuarios[0];
            console.log(usuario);
            $("#UsuarioID").val(usuario.usuarioID);
            $("#Nombre").val(usuario.nombre);
            $("#Apellido").val(usuario.apellido);
            // $("#Telefono").val(usuario.telefono);
            $("#LocalidadID").val(usuario.localidadID);
            document.getElementById("tituloModal").innerHTML = "Editar Usuario";
            $("#ModalUsuario").modal("show");
        }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error : function(xhr, status) {
        alert('Error al cargar servicios');
        document.getElementById("alerta").innerHTML = "Error al cargar usuario";
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(xhr, status) {
        //alert('Petición realizada');
    }
});
}


// function DeshabilitarProvincia(provinciaID){
//     let Deshabilitar = true;
//     $.ajax({
//     // la URL para la petición
//     url : '../../Provincias/BuscarProvincias',
//     // la información a enviar
//     // (también es posible utilizar una cadena de datos)
//     data : { provinciaID: provinciaID, Deshabilitar: Deshabilitar},    
//     // especifica si será una petición POST o GET
//     type : 'GET',
//     // el tipo de información que se espera de respuesta
//     dataType : 'json',
//     // código a ejecutar si la petición es satisfactoria;
//     // la respuesta es pasada como argumento a la función
//     success : function(provincias) {
//         if(provincias == null){
//             alert("Nasatadas");
//         }
        
       
//         BuscarProvincias();
//     },

//     // código a ejecutar si la petición falla;
//     // son pasados como argumentos a la función
//     // el objeto de la petición en crudo y código de estatus de la petición
//     error : function(xhr, status) {
//         const Toast = Swal.mixin({
//             toast: true,
//             position: 'top-end',
//             showConfirmButton: false,
//             timer: 3000,
//             timerProgressBar: true,
//             didOpen: (toast) => {
//             toast.addEventListener('mouseenter', Swal.stopTimer)
//             toast.addEventListener('mouseleave', Swal.resumeTimer)
//         }
//         })
//             Toast.fire({
//             icon: 'error',
//             title: 'Aún se encuentran Subprovincias asociadas habilitadas'
//         })
//     },

//     // código a ejecutar sin importar si la petición falló o no
//     complete : function(xhr, status) {
//         //alert('Petición realizada');
//     }
// });
// }




function GuardarPerfil(){
    //JAVASCRIPT{}
    let usuarioID = $("#UsuarioID").val();
    let nombre = $("#Nombre").val();
    let apellido = $("#Apellido").val();
    // let telefono = $("#Telefono").val();
    let localidadID = $("#LocalidadID").val();
    console.log(nombre+" "+localidadID)
    $.ajax({
        // la URL para la petición
        url : '../../Usuarios/GuardarPerfil',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : {usuarioID:usuarioID, localidadID : localidadID, nombre : nombre, apellido : apellido},    
        // especifica si será una petición POST o GET
        type : 'POST',
        // el tipo de información que se espera de respuesta
        dataType : 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        success : function(resultado) {
            console.log(resultado);
            const Toast = Swal.mixin({
                toast: true,
                position: 'top-end',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                didOpen: (toast) => {
                toast.addEventListener('mouseenter', Swal.stopTimer)
                toast.addEventListener('mouseleave', Swal.resumeTimer)
            }
            })
            
            if(resultado == "faltas"){
                Toast.fire({
                icon: 'error',
                title: 'Complete todos los campos'
                })
            }
            if(resultado == "repetir"){
                Toast.fire({
                icon: 'error',
                title: 'El usuario ya existe'
                })
            }
            if(resultado == "Crear"){
                
                $("#ModalUsuario").modal("hide");
                BuscarUsuarios();
            }        

        },
   
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error : function(xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

