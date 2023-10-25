let tagsActive = [];
let tagsExistentes = [];
let serviciosDisp = [];
var imageActive = "active";

let publicacionID = $("#PublicacionID").val();
window.onload = () => {
  BuscarServicios();
  BuscarPublicacion(publicacionID);
};

function BuscarServicios() {
  $("#cards-servicios").empty();

  $.ajax({
    url: "../../Servicios/BuscarServicios",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (servicios) {
      $.each(servicios, function (index, servicio) {
        if (servicio.eliminado == false) {
          serviciosDisp.push(servicio);
        }
      });
      console.log(tagsActive);
    },
    error: function (xhr, status) {
      console.log("Error en la solicitud AJAX:", status);
    },
  });
}

const BuscarPublicacion = (publicacionID = 0) => {
  if (publicacionID != 0) {
    // $("#btn-cambiar").show();
    $.ajax({
      url: "../../Publicaciones/BuscarPublicaciones2",
      data: { publicacionID: publicacionID },
      type: "GET",
      dataType: "json",
      success: (resultado) => {
        console.log(resultado);
        if (resultado.lista[0]) {
          var publicacion = resultado.lista[0];

          publicacion.servicios.forEach((tag) => {
            //seteamos los servicios que ya tiene
            tagsExistentes.push(tag.servicioID);
            AñadirEtiqueta(tag.servicioID);
          });
          $("#EsOferta").val(publicacion.esOferta ? "1" : "2");
          seleccionarTipo(publicacion.esOferta ? "1" : "2");
          $("#UsuarioID").val(publicacion.usuarioID);
          $("#Titulo").val(publicacion.titulo);
          $("#Resumen").val(publicacion.resumen);
          // $("#descripcion").InnerHtML(publicacion.descripcion);
          tinymce.activeEditor.setContent(publicacion.descripcion);
        } else {
          publicacionID = 0;
        }

        //imagenes

        if (publicacion.imagenes.length === 0) {
        }
        publicacion.imagenes.forEach((item) => {
          let imagen = "<td></td>";
          if (item.imagenBase64) {
            imagen = `<input hidden name="id" value="${item.imagenID}"></input><img src="data:${item.tipoImagen};base64, ${item.imagenBase64}"/>`;
          }
          $("#Lista_imagenes").append(
            `<div class="carousel-item ${imageActive}" >
              ${imagen}
            </div>`
          );
          imageActive = "";
        });
      },
      error: (xhr, status) => {
        var errorMessage = "Error al cargar publicaciones";
        if (xhr && xhr.responseJSON && xhr.responseJSON.error) {
          errorMessage += ": " + xhr.responseJSON.error;
        } else {
          errorMessage += ". Detalles del error: " + xhr.statusText + status;
        }

        alert(errorMessage);
      },
    });
  }
};

function GuardarPublicacion() {
  //JAVASCRIPT
  var descripcion = tinymce.activeEditor.getContent();
  let esOferta = null;
  let titulo = $("#Titulo").val();
  let resumen = $("#Resumen").val();
  if ($("#EsOferta").val() == 1) {
    esOferta = true;
  } else {
    esOferta = false;
  }
  console.log(titulo, descripcion, esOferta, resumen);
  if (titulo && descripcion && esOferta != null && resumen) {
    $.ajax({
      url: "../../Publicaciones/GuardarPublicacion",
      data: {
        publicacionID: publicacionID,
        descripcion: descripcion,
        esOferta: esOferta,
        titulo: titulo,
        resumen: resumen,
      },
      type: "POST",
      dataType: "json",
      success: function (resultado) {
        console.log(resultado);
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000,
          timerProgressBar: true,
          didOpen: (toast) => {
            toast.addEventListener("mouseenter", Swal.stopTimer);
            toast.addEventListener("mouseleave", Swal.resumeTimer);
          },
        });
        if (resultado < 0) {
          Toast.fire({
            icon: "error",
            title: "error",
          });
        }
        if (resultado == 0) {
          Toast.fire({
            icon: "success",
            title: "Se modifico correctamente",
          });
          
        }
        if (resultado > 0) {
          Toast.fire({
            icon: "success",
            title: "Publicación inicializada. Recuerda añadir imagenes",
          });
          publicacionID = resultado;
          imagenesCargadas.forEach(function (imagenCargada) {
            imagenCargada.append("publicacionID", publicacionID);
            cargarImagen(imagenCargada);
          });
          GuardarTags();
          console.log("el id ahora es: " + resultado);
          GuardarTags();
        }
      },

      // código a ejecutar si la petición falla;

      error: function (xhr, status) {
        alert("Disculpe, existió un problema");
      },
    });
  } else {
    const Toast = Swal.mixin({
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer: 3000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    });
    Toast.fire({
      icon: "error",
      title: "Faltan Campos por Completar",
    });
  }
}

function GuardarTags() {
  if (tagsActive.length > 0) {
    $.each(tagsActive, function (index, tag) {
      let tagServicioID = tag.servicioID;
      let tagEliminado = tag.eliminado;
      console.log(tag + " en " + publicacionID);
      $.ajax({
        url: "../../Publicaciones/GuardarTag",
        data: {
          publicacionID: publicacionID,
          servicioID: tagServicioID,
          eliminado: tagEliminado,
        },
        type: "POST",
        dataType: "json",
        success: function (tags) {
          console.log(tags, 1);
        },
        error: function (xhr, status) {
          alert("Disculpe, existió un problema");
        },
      });
    });
  }
}

// js para el formulario
function seleccionarTipo(value) {
  const isDisabled = value === "0" ? true : false;
  const isHidden = value === "0" ? true : false;

  $("#Titulo").prop("disabled", isDisabled);
  $("#Resumen").prop("disabled", isDisabled);
  $("#ServicioID").prop("disabled", isDisabled);
  $("#Etiqueta-List").toggle(!isHidden);
  $("#descripcion").prop("disabled", isDisabled);
  $("#btn-guardar").prop("disabled", isDisabled);

  actualizarTag();
}

imagenesCargadas = [];

// // Crear Imagen
// $("#files").submit(function (event) {
//   event.preventDefault(); // Prevenir la acción por defecto del formulario

//   console.log(this);
//   var formData = new FormData(this);
//   // formData.append("publicacionID", publicacionID);
//   console.log(formData);
//   if (formData.has("file")) {
//     imagenesCargadas.push(formData);

//     var imagen = `<input hidden name="id" value="c${
//       imagenesCargadas.length
//     }"></input><img src="${formData.get("file").name}"/>`;

//     $("#Lista_imagenes").append(
//       `<div class="carousel-item ${imageActive}" >
//               ${imagen}
//             </div>`
//     );
//     imageActive = "";
//   }
// });

$("#files").submit(function (event) {
  event.preventDefault();
  var imagenInput = document.getElementById("imagen");

  if (imagenInput.files.length > 0) {
    var file = imagenInput.files[0];

    var formData = new FormData();
    formData.append("imagen", file);
    formData.append("imagenID", "temp" + (imagenesCargadas.length + 1));

    imagenesCargadas.push(formData);

    var imagenSrc = URL.createObjectURL(file);

    var imagen = `<input type="hidden" name="temp${imagenesCargadas.length}" value="temp${imagenesCargadas.length}"></input><img src="${imagenSrc}"/>`;

    $("#Lista_imagenes").append(
      `<div class="carousel-item ${imageActive}" >
                ${imagen}
              </div>`
    );
    imageActive = "";
  }
});

function cargarImagen(formdata) {
  $.ajax({
    url: "../../Publicaciones/GuardarImagen",
    type: "POST",
    data: formdata,
    async: false,
    success: function (resultado) {
      // $("#ModalImagen").modal("hide");
      // setTimeout(function () {
      //   // BuscarImagenes();
      // }, 100);
    },
    cache: false,
    contentType: false,
    processData: false,
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });

  return false;
}

function actualizarTag() {
  etiquetas = "";
  if (tagsActive.length > 0) {
    tagsActive.forEach(function (item) {
      // console.log(item.descripcion);
      if (item.eliminado == false) {
        etiquetas +=
          '<spam type="button" onclick=QuitarTag(' +
          item.servicioID +
          ') class="tag">' +
          item.descripcion +
          "</spam>";
      }
    });
    $("#Etiqueta-List").html(etiquetas);
  }
  console.log("anuma" + serviciosDisp);
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
  console.log(id);
  if (tagsActive.find((tags) => tags.servicioID == id)) {
    let resultado = serviciosDisp.find((tags) => tags.servicioID == id);
    if(resultado.eliminado != undefined){
      resultado.eliminado = false;
    } 
  } else {
    let resultado = serviciosDisp.find((tags) => tags.servicioID == id);
    tagsActive.push(resultado);
  }
  serviciosDisp = serviciosDisp.filter((tags) => tags.servicioID != id);
  actualizarTag();
}

function QuitarTag(id) {
  var resultado = tagsActive.find((tags) => tags.servicioID == id);
  resultado.eliminado = true;
  // console.log(resultado);           terminar el eliminado para q lo elimine de la base de dato.
  serviciosDisp.push(resultado);
  // tagsActive = tagsActive.filter((tags) => tags.servicioID != id);
  actualizarTag();
}

function NuevaImagen() {
  $("#ModalImagen").modal("show");
}

function EliminarImagen() {
  var imagenID = $(".active").find('[name="id"]').val();
  console.log(imagenID);
  $.ajax({
    url: "../../Publicaciones/GuardarImagen",
    data: {
      ImagenID: imagenID,
    },
    type: "POST",
    dataType: "json",
    success: function (resultado) {
      // console.log(resultado);
      // BuscarImagenes();
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}
