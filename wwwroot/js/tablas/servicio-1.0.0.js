window.onload = BuscarServicios();


function BuscarServicios(){
    console.log("prueba uno")

$("#tbody-servicios").empty();

    $.ajax({
        // la URL para la petición
        url : '../../Servicios/BuscarServicios',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : {},    
        // especifica si será una petición POST o GET
        type : 'GET',
        // el tipo de información que se espera de respuesta
        dataType : 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        
        success : function(servicios) { 
            $("#tbody-servicios").empty();
            let BotonDeshabilitado = '';
            $.each(servicios, function(index, servicio) {
                if(servicio.eliminado == true){
                    BotonDeshabilitado = `
                    <tr class="table-danger" >
                        <td> ${servicio.descripcion}</td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-habilitar" onClick="DeshabilitarServicio('${servicio.servicioID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                else{
                    BotonDeshabilitado = `
                    <tr>
                        <td class=" danger" >${servicio.descripcion} </td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-editar" onClick="BuscarServicio(${servicio.servicioID})" role="button"></a>
                            <a class="btn btn-eliminar" onClick="DeshabilitarServicio('${servicio.servicioID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                $("#tbody-servicios").append(`
                    ${BotonDeshabilitado}
                `);      
            });
        },
   
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error : function(xhr, status) {
            alert('Error al cargar servicios');
        },
   
        // código a ejecutar sin importar si la petición falló o no
        complete : function(xhr, status) {
            //alert('Petición realizada');
        }
    });
}


function VaciarFormulario(){
    $("#Nombre").val('');
    $("#ServicioID").val(0);
    document.getElementById("tituloModal").innerHTML = "Agregar Servicio";
}


function BuscarServicio(servicioID){
    $.ajax({
    // la URL para la petición
    url : '../../Servicios/BuscarServicios',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data : { servicioID: servicioID },    
    // especifica si será una petición POST o GET
    type : 'GET',
    // el tipo de información que se espera de respuesta
    dataType : 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(servicios) {
       
        if (servicios.length == 1){
            let servicio = servicios[0];
            $("#Nombre").val(servicio.descripcion);
            $("#ServicioID").val(servicio.servicioID);
            document.getElementById("tituloModal").innerHTML = "Editar Servicio";
            $("#ModalServicio").modal("show");
        }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error : function(xhr, status) {
        alert('Error al cargar servicios');
        document.getElementById("alerta").innerHTML = "Error al cargar servicios";
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(xhr, status) {
        //alert('Petición realizada');
    }
});
}


function GuardarServicio(){
    //JAVASCRIPT
    let descripcion = $("#descripcion").val();
    let servicioID = $("#ServicioID").val();
    console.log(descripcion+" "+servicioID)
    $.ajax({
        // la URL para la petición
        url : '../../Servicios/GuardarServicio',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : { servicioID : servicioID, descripcion : descripcion },    
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
                title: 'La Servicio ya existe'
                })
            }
            if(resultado == "Crear"){
                
                $("#ModalServicio").modal("hide");
                BuscarServicios();
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

function DeshabilitarServicio(servicioID){
    console.log("hola")

    $.ajax({
    // la URL para la petición
    url : '../../Servicios/Deshabilitar',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data : { servicioID: servicioID},    
    // especifica si será una petición POST o GET
    type : 'GET',
    // el tipo de información que se espera de respuesta
    dataType : 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(resultado) {
        console.log(resultado);
       if(resultado == "error"){
        alert("Imposible Habilitar una servicio con categorias deshabilitadas")
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
        BuscarServicios();
       }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error : function(xhr, status) {
        alert('Error al cargar servicios');
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(xhr, status) {
        //alert('Petición realizada');
    }
});
}

