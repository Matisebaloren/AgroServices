window.onload = BuscarLocalidades();


function BuscarLocalidades(){

$("#tbody-localidades").empty();

    $.ajax({
        // la URL para la petición
        url : '../../Localidades/BuscarLocalidades',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : {},    
        // especifica si será una petición POST o GET
        type : 'GET',
        // el tipo de información que se espera de respuesta
        dataType : 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        
        success : function(localidades) { 
            $("#tbody-localidades").empty();
            let BotonDeshabilitado = '';
            $.each(localidades, function(index, localidad) {
                if(localidad.eliminado == true){
                    BotonDeshabilitado = `
                    <tr class="table-danger" >
                        <td> ${localidad.nombre}</td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-habilitar" onClick="DeshabilitarLocalidad('${localidad.localidadID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                else{
                    BotonDeshabilitado = `
                    <tr>
                        <td class=" danger" >${localidad.nombre} </td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-editar" onClick="BuscarLocalidad(${localidad.localidadID})" role="button"></a>
                            <a class="btn btn-eliminar" onClick="DeshabilitarLocalidad('${localidad.localidadID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                $("#tbody-localidades").append(`
                    ${BotonDeshabilitado}
                `);      
            });
        },
   
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error : function(xhr, status) {
            alert('Error al cargar localidades');
        },
   
        // código a ejecutar sin importar si la petición falló o no
        complete : function(xhr, status) {
            //alert('Petición realizada');
        }
    });
}


function VaciarFormulario(){
    $("#Nombre").val('');
    $("#LocalidadID").val(0);
    document.getElementById("tituloModal").innerHTML = "Agregar Localidad";
}


function BuscarLocalidad(localidadID){
    $.ajax({
    // la URL para la petición
    url : '../../Localidades/BuscarLocalidades',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data : { localidadID: localidadID },    
    // especifica si será una petición POST o GET
    type : 'GET',
    // el tipo de información que se espera de respuesta
    dataType : 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(localidades) {
       
        if (localidades.length == 1){
            let localidad = localidades[0];
            $("#Nombre").val(localidad.nombre);
            $("#LocalidadID").val(localidad.localidadID);
            $("#ProvinciaID").val(localidad.provinciaID);
            document.getElementById("tituloModal").innerHTML = "Editar Localidad";
            $("#ModalLocalidad").modal("show");
        }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error : function(xhr, status) {
        alert('Error al cargar localidades');
        document.getElementById("alerta").innerHTML = "Error al cargar localidades";
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(xhr, status) {
        //alert('Petición realizada');
    }
});
}


function GuardarLocalidad(){
    //JAVASCRIPT
    let nombre = $("#Nombre").val();
    let localidadID = $("#LocalidadID").val();
    let provinciaID = $("#ProvinciaID").val();
    console.log(nombre+" "+localidadID)
    $.ajax({
        // la URL para la petición
        url : '../../Localidades/GuardarLocalidad',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : { localidadID : localidadID, nombre : nombre, provinciaID : provinciaID },    
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
                title: 'La Localidad ya existe'
                })
            }
            if(resultado == "Crear"){
                
                $("#ModalLocalidad").modal("hide");
                BuscarLocalidades();
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

function DeshabilitarLocalidad(localidadID){
    console.log("hola")

    $.ajax({
    // la URL para la petición
    url : '../../Localidades/Deshabilitar',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data : { localidadID: localidadID},    
    // especifica si será una petición POST o GET
    type : 'GET',
    // el tipo de información que se espera de respuesta
    dataType : 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(resultado) {
        console.log(resultado);
       if(resultado == "error"){
        alert("Imposible Habilitar una localidad con categorias deshabilitadas")
       }
       if(resultado == "serviciosHabilitados"){
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
                Toast.fire({
                icon: 'error',
                title: 'Aún se encuentran servicios asociados habilitados'
            })
            
       }
       if(resultado == "cambiar"){
        BuscarLocalidades();
       }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error : function(xhr, status) {
        alert('Error al cargar localidades');
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(xhr, status) {
        //alert('Petición realizada');
    }
});
}

