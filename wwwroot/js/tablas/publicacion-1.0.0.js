let tagsActive = new Array();
let serviciosDisp = new Array();
window.onload = BuscarPublicaciones();

function BuscarPublicaciones() {
  console.log("prueba uno");

  $("#tbody-publicaciones").empty();

  $.ajax({
    // la URL para la petición
    url: "../../Publicaciones/BuscarPublicaciones",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: {},
    // especifica si será una petición POST o GET
    type: "GET",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función

    success: function (publicaciones) {
      $("#tbody-publicaciones").empty();
      let BotonDeshabilitado = "";
      // $.each(publicaciones, function (index, publicaciones) {
      //   if (publicaciones.eliminado == true) {
      //     BotonDeshabilitado = `
      //               <tr class="table-danger" >
      //                   <td> ${publicaciones.nombre}</td>
      //                   <td class=" text-end">
      //                       <a class="btn btn-eliminar btn-habilitar" onClick="DeshabilitarPublicacion('${publicacion.publicacionID}')" role="button"></a>
      //                   </td>
      //               </tr>
      //               `;
      //   } else {
      //     BotonDeshabilitado = `
      //               <tr>
      //                   <td class=" danger" >${publicacion.nombre} </td>
      //                   <td class=" text-end">
      //                       <a class="btn btn-eliminar btn-editar" onClick="BuscarPublicacion(${publicacion.publicacionID})" role="button"></a>
      //                       <a class="btn btn-eliminar" onClick="DeshabilitarPublicacion('${publicacion.publicacionID}')" role="button"></a>
      //                   </td>
      //               </tr>
      //               `;
      //   }
      //   $("#tbody-publicaciones").append(`
      //               ${BotonDeshabilitado}
      //           `);
      // });
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert("Error al cargar publicaciones");
    },

    // código a ejecutar sin importar si la petición falló o no
    complete: function (xhr, status) {
      //alert('Petición realizada');
    },
  });

  $.ajax({
    url: "../../Publicaciones/BuscarServicios",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (servicios) {
      $.each(servicios, function (index, servicio) {
        serviciosDisp.push(servicio);
        actualizarTag();
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar servicios");
    },
  });
}

function VaciarFormulario() {
  $("#Nombre").val("");
  $("#PublicacionID").val(0);
  document.getElementById("tituloModal").innerHTML = "Agregar Publicacion";
}

// function BuscarProvincia(provinciaID){
//         $.ajax({
//         // la URL para la petición
//         url : '../../Provincias/BuscarProvincias',
//         // la información a enviar
//         // (también es posible utilizar una cadena de datos)
//         data : { provinciaID: provinciaID },
//         // especifica si será una petición POST o GET
//         type : 'GET',
//         // el tipo de información que se espera de respuesta
//         dataType : 'json',
//         // código a ejecutar si la petición es satisfactoria;
//         // la respuesta es pasada como argumento a la función
//         success : function(provincias) {

//             if (provincias.length == 1){
//                 let provincia = provincias[0];
//                 $("#Descripcion").val(provincia.descripcion);
//                 $("#ProvinciaID").val(provincia.provinciaID);
//                 document.getElementById("tituloModal").innerHTML = "Editar Provincia";
//                 $("#ModalProvincia").modal("show");
//             }
//         },

//         // código a ejecutar si la petición falla;
//         // son pasados como argumentos a la función
//         // el objeto de la petición en crudo y código de estatus de la petición
//         error : function(xhr, status) {
//             alert('Error al cargar provincias');
//             document.getElementById("alerta").innerHTML = "Error al cargar provincias";
//         },

//         // código a ejecutar sin importar si la petición falló o no
//         complete : function(xhr, status) {
//             //alert('Petición realizada');
//         }
//     });
// }

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

function GuardarPublicacion(){
    //JAVASCRIPT
    let descripcion = $("#descripcion").val();
    let publicacionID = $("#PublicacionID").val();
    let esOferta = null;
    if($("#EsOferta").val() == false){
      esOferta = false;
    }
    else{
      esOferta = true;
    }
    let titulo = $("#Titulo").val();
    let usuarioID = $("#UsuarioID").val();
    
    $.ajax({
        // la URL para la petición
        url : '../../Publicaciones/GuardarPublicacion',
        // la información a enviar
        // (también es posible utilizar una cadena de datos)
        data : { publicacionID : publicacionID, descripcion : descripcion, esOferta : esOferta, titulo : titulo, usuarioID : usuarioID},
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
                title: 'Complete el campo'
                })
            }
            if(resultado == "repetir"){
                Toast.fire({
                icon: 'error',
                title: 'La Provincia ya existe'
                })
            }
            if(resultado == "crear"){
              Toast.fire({
              icon: 'error',
              title: 'ta bien'
              })
          }
        },

        // código a ejecutar si la petición falla;

        error : function(xhr, status) {
            alert('Disculpe, existió un problema');
        }
    });
}

// js para el formulario
function seleccionarTipo(value) {
  // console.log(value);
  switch (value) {
    case "0":
      // console.log("es cero");
      $("#TipoSeleccionado").hide();
      break;
    case "1":
      $("#TipoSeleccionado").show();
      $("#ListaImagenes").show();
      break;
    case "2":
      $("#TipoSeleccionado").show();
      $("#ListaImagenes").hide();
      break;
  }
}


function actualizarTag() {
  etiquetas = "";
  tagsActive.forEach(function (item) {
    console.log(item.descripcion);
    etiquetas +=
      '<button type="button" onclick=QuitarTag(' +
      item.servicioID +
      ') class="btn btn-success m-1">' +
      item.descripcion +
      "</button>";
  });

  $("#Etiqueta-List").html(etiquetas);
  $("#ServicioID").empty();
  if (serviciosDisp.length > 0) {
    $("#ServicioID").append("<option value=0>Seleccione Servicio</option>");
    $("#ServicioID").show();
  } else {
    $("#ServicioID").hide();
  }

  for (var i = 0; i < serviciosDisp.length; i++) {
    var option = document.createElement("option");
    option.value = serviciosDisp[i].servicioID;
    option.text = serviciosDisp[i].descripcion;
    $("#ServicioID").append(option);
  }
}

function AñadirEtiqueta(id) {
  var resultado = serviciosDisp.find((tags) => tags.servicioID == id);
  // console.log(resultado);
  tagsActive.push(resultado);
  serviciosDisp = serviciosDisp.filter((tags) => tags.servicioID != id);
  actualizarTag();
}

function QuitarTag(id) {
  var resultado = tagsActive.find((tags) => tags.servicioID == id);
  // console.log(resultado);
  serviciosDisp.push(resultado);
  tagsActive = tagsActive.filter((tags) => tags.servicioID != id);
  actualizarTag();
}

// function GuardarPublicacion(){
//   $
// }