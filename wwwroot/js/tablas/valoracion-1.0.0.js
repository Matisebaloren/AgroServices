window.onload = BuscarValoraciones();


function BuscarValoraciones(){
    console.log("prueba uno");
    let publicacionID = $("#PublicacionID");

    $("#tbody-valoraciones").empty();

    $.ajax({
        // la URL para la petición
        url : '../../Valoraciones/BuscarValoraciones',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : {publicacionID: publicacionID},    
        // especifica si será una petición POST o GET
        type : 'GET',
        // el tipo de información que se espera de respuesta
        dataType : 'json',
        // código a ejecutar si la petición es satisfactoria;
        // la respuesta es pasada como argumento a la función
        
        success : function(valoraciones) { 
            $("#tbody-valoraciones").empty();
            let BotonDeshabilitado = '';
            $.each(valoraciones, function(index, valoraciones) {
                if(valoraciones.eliminado == true){
                    BotonDeshabilitado = `
                    <tr class="table-danger" >
                        <td> ${valoraciones.nombre}</td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-habilitar" onClick="DeshabilitarValoracion('${valoracion.valoracionID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                else{
                    BotonDeshabilitado = `
                    <tr>
                        <td class=" danger" >${valoracion.nombre} </td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-editar" onClick="BuscarValoracion(${valoracion.valoracionID})" role="button"></a>
                            <a class="btn btn-eliminar" onClick="DeshabilitarValoracion('${valoracion.valoracionID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
                }
                $("#tbody-valoraciones").append(`
                    ${BotonDeshabilitado}
                `);      
            });
        },
        error : function(xhr, status) {
            alert('Error al cargar valoraciones');
        }
    });
}

