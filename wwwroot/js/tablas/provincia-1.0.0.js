window.onload = BuscarProvincias();


function BuscarProvincias(){
    console.log("prueba uno")

$("#tbody-provincias").empty();

    $.ajax({
        // la URL para la petición
        url : '../../Provincias/BuscarProvincias',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : {},    
        // especifica si será una petición POST o GET
        type : 'GET',
        // el tipo de información que se espera de respuesta
        dataType : 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        
        success : function(provincias) { 
            $("#tbody-provincias").empty();
            let BotonDeshabilitado = '';
            $.each(provincias, function(index, provincia) {
                if(provincia.eliminado == true){
                    BotonDeshabilitado = `
                    <tr>
                        <td class="text-danger"><b>${provincia.nombre}</b></td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-habilitar" onClick="DeshabilitarProvincia('${provincia.provinciaID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                else{
                    BotonDeshabilitado = `
                    <tr>
                        <td><b>${provincia.nombre}</b></td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-editar" onClick="BuscarProvincia(${provincia.provinciaID})" role="button"></a>
                            <a class="btn btn-eliminar" onClick="DeshabilitarProvincia('${provincia.provinciaID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                $("#tbody-provincias").append(`
                    ${BotonDeshabilitado}
                `);      
            });
        },
   
        // código a ejecutar si la petición falla;
        // son pasados como argumentos a la función
        // el objeto de la petición en crudo y código de estatus de la petición
        error : function(xhr, status) {
            alert('Error al cargar provincias');
        },
   
        // código a ejecutar sin importar si la petición falló o no
        complete : function(xhr, status) {
            //alert('Petición realizada');
        }
    });
}


function VaciarFormulario(){
    $("#Nombre").val('');
    $("#ProvinciaID").val(0);
    document.getElementById("tituloModal").innerHTML = "Agregar Provincia";
}


function BuscarProvincia(provinciaID){
    $.ajax({
    // la URL para la petición
    url : '../../Provincias/BuscarProvincias',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data : { provinciaID: provinciaID },    
    // especifica si será una petición POST o GET
    type : 'GET',
    // el tipo de información que se espera de respuesta
    dataType : 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(provincias) {
       
        if (provincias.length == 1){
            let provincia = provincias[0];
            $("#Nombre").val(provincia.nombre);
            $("#ProvinciaID").val(provincia.provinciaID);
            document.getElementById("tituloModal").innerHTML = "Editar Provincia";
            $("#ModalProvincia").modal("show");
        }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error : function(xhr, status) {
        alert('Error al cargar provincias');
        document.getElementById("alerta").innerHTML = "Error al cargar provincias";
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(xhr, status) {
        //alert('Petición realizada');
    }
});
}


function GuardarProvincia(){
    //JAVASCRIPT
    let nombre = $("#Nombre").val();
    let provinciaID = $("#ProvinciaID").val();
    console.log(nombre+" "+provinciaID)
    $.ajax({
        // la URL para la petición
        url : '../../Provincias/GuardarProvincia',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : { provinciaID : provinciaID, nombre : nombre },    
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
                title: 'La Provincia ya existe'
                })
            }
            if(resultado == "Crear"){
                
                $("#ModalProvincia").modal("hide");
                BuscarProvincias();
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

function DeshabilitarProvincia(provinciaID){
    console.log("hola")

    $.ajax({
    // la URL para la petición
    url : '../../Provincias/Deshabilitar',
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data : { provinciaID: provinciaID},    
    // especifica si será una petición POST o GET
    type : 'GET',
    // el tipo de información que se espera de respuesta
    dataType : 'json',
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success : function(resultado) {
        console.log(resultado);
       if(resultado == "error"){
        alert("Imposible Habilitar una provincia con categorias deshabilitadas")
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
        BuscarProvincias();
       }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error : function(xhr, status) {
        alert('Error al cargar provincias');
    },

    // código a ejecutar sin importar si la petición falló o no
    complete : function(xhr, status) {
        //alert('Petición realizada');
    }
});
}

