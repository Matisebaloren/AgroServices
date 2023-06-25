let tagsActive = new Array();
let serviciosDisp = new Array();
let publicacionID = $("#PublicacionID").val();
console.log(publicacionID + " este es el id de publicacion");
window.onload = BuscarPublicacion(publicacionID);

function BuscarPublicacion(publicacionID = 0) {
  console.log(publicacionID);
  // Se buscan los servicis disponibles
  $.ajax({
    url: "../../Publicaciones/BuscarServicios",
    data: {},
    type: "GET",
    dataType: "json",

    success: function (servicios) {
      console.log(servicios);
      $.each(servicios, function (index, servicio) {
        serviciosDisp.push(servicio);
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar servicios");
    },
  });

  // se buscan las etiquetas activas
  if (publicacionID != 0) {
    $.ajax({
      url: "../../Publicaciones/BuscarTagsActivos",
      data: { publicacionID: publicacionID },
      type: "GET",
      dataType: "json",

      success: function (etiquetas) {
        console.log("etiquetas:" + etiquetas.length);
        $.each(etiquetas, function (index, tag) {
          if (tag.eliminado == false) {
            console.log(tag);
            AñadirEtiqueta(tag.servicioID);
          }
        });
      },
      error: function (xhr, status) {
        alert("Error al cargar etiquetas");
      },
    });
  }

  // se buscan Imagenes Relacionadas
  BuscarImagenes();

  // BUSCAR INFORMARCION DE PUBLICACION
  if (publicacionID > 0) {
    $("#btn-cambiar").show();
    $.ajax({
      url: "../../Publicaciones/BuscarPublicaciones",
      data: { publicacionID: publicacionID },
      type: "GET",
      dataType: "json",
      success: function (publicaciones) {
        console.log(publicaciones);
        if (publicaciones.length > 0) {
          if (publicaciones[0].esOferta == true) {
            $("#EsOferta").val(1);
            seleccionarTipo("1");
          } else {
            $("#EsOferta").val(2);
            seleccionarTipo("2");
          }
          $("#UsuarioID").val(publicaciones[0].usuarioID);
          $("#Titulo").val(publicaciones[0].titulo);
          $("#descripcion").val(publicaciones[0].descripcion);
        } else {
          publicacionID = 0;
        }
      },
      error: function (xhr, status) {
        alert("Error al cargar publicaciones");
      },
    });
  }
}

function BuscarImagenes() {
  $("#Lista_imagenes").empty();
  $.ajax({
    url: "../../Publicaciones/BuscarImagenes",
    data: { publicacionID: publicacionID },
    type: "GET",
    dataType: "json",

    success: function (imagenes) {
      let clase = "active";
      if (imagenes.length == 0) {
        $("#Lista_imagenes").append(
          `<div class="carousel-item ${clase}" >
          <div class="FondoGlass-1" style="width: 100%; height: 35vw;">
          <svg style="fill:#ffffff; position: absolute; right: 43%; top: 32%;" xmlns="http://www.w3.org/2000/svg" height="6em" viewBox="0 0 576 512"><path d="M160 80H512c8.8 0 16 7.2 16 16V320c0 8.8-7.2 16-16 16H490.8L388.1 178.9c-4.4-6.8-12-10.9-20.1-10.9s-15.7 4.1-20.1 10.9l-52.2 79.8-12.4-16.9c-4.5-6.2-11.7-9.8-19.4-9.8s-14.8 3.6-19.4 9.8L175.6 336H160c-8.8 0-16-7.2-16-16V96c0-8.8 7.2-16 16-16zM96 96V320c0 35.3 28.7 64 64 64H512c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H160c-35.3 0-64 28.7-64 64zM48 120c0-13.3-10.7-24-24-24S0 106.7 0 120V344c0 75.1 60.9 136 136 136H456c13.3 0 24-10.7 24-24s-10.7-24-24-24H136c-48.6 0-88-39.4-88-88V120zm208 24a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"/></svg>          </div>
            </div>
            `
        );
      }
      $.each(imagenes, function (index, item) {
        console.log("id de item" + item.imagenID);
        let imagen = "<td></td>";
        if (item.imagenBase64) {
          imagen = `<input hidden name="id" value="${item.imagenID}"></input><img src="data:${item.tipoImagen};base64, ${item.imagenBase64}" style="width: 100%; height: 35vw; display: block"/>`;
        }
        $("#Lista_imagenes").append(
          `<div class="carousel-item ${clase}" >
              ${imagen}
            </div>
            `
        );
        clase = "";
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar imagenes");
    },
  });
}

function GuardarPublicacion() {
  //JAVASCRIPT
  let descripcion = $("#descripcion").val();
  let esOferta = null;
  let titulo = $("#Titulo").val();
  let usuarioID = $("#UsuarioID").val();
  if ($("#EsOferta").val() == 1) {
    esOferta = true;
  } else {
    esOferta = false;
  }

  $.ajax({
    // la URL para la petición
    url: "../../Publicaciones/GuardarPublicacion",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: {
      publicacionID: publicacionID,
      descripcion: descripcion,
      esOferta: esOferta,
      titulo: titulo,
      usuarioID: usuarioID,
    },
    // especifica si será una petición POST o GET
    type: "POST",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
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
      // if (resultado == -1) {
      //   Toast.fire({
      //     icon: "error",
      //     title: "Complete el campo",
      //   });
      // }
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
        GuardarTags();
      }
      if (resultado > 0) {
        Toast.fire({
          icon: "success",
          title: "Se creo correctamente",
        });
        publicacionID = resultado;
        console.log("el id ahora es: " + resultado);
        GuardarTags();
        $("#btn-cambiar").show();
      }
    },

    // código a ejecutar si la petición falla;

    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
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
  // console.log(value);
  switch (value) {
    case "0":
      $("#Titulo").prop("disabled", true);
      $("#ServicioID").prop("disabled", true);
      $("#Etiqueta-List").hide();
      $("#descripcion").prop("disabled", true);
      $("#btn-guardar").prop("disabled", true);
      break;
    case "1":
      $("#Titulo").prop("disabled", false);
      $("#ServicioID").prop("disabled", false);
      $("#Etiqueta-List").show();
      $("#descripcion").prop("disabled", false);
      $("#btn-guardar").prop("disabled", false);
      break;
    case "2":
      $("#Titulo").prop("disabled", false);
      $("#ServicioID").prop("disabled", false);
      $("#Etiqueta-List").show();
      $("#descripcion").prop("disabled", false);
      $("#btn-guardar").prop("disabled", false);
      break;
  }
  actualizarTag();
}


// Crear Imagen
$("#files").submit(function () {
  console.log($(this)[0]);
  var formData = new FormData($(this)[0]);
  formData.append("publicacionID", publicacionID);
  console.log(formData);
  $.ajax({
    url: "../../Publicaciones/GuardarImagen",
    type: "POST",
    data: formData,
    async: false,
    success: function (resultado) {
      $("#ModalImagen").modal("hide");
      setTimeout(function () {
        BuscarImagenes();
      }, 100);
    },
    cache: false,
    contentType: false,
    processData: false,
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });

  return false;
});

function actualizarSelectTag() {}

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
  // console.log(resultado);
  if (tagsActive.find((tags) => tags.servicioID == id)) {
    let resultado = serviciosDisp.find((tags) => tags.servicioID == id);
    resultado.eliminado = false;
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

$("#div-imagenes").hide();

function CambiarSeccion() {
  $("#div-main").addClass("animate__slideOutUp");
  setTimeout(() => {
    $("#div-datos").hide();
    $("#div-imagenes").show();
    $("#div-main").removeClass("animate__slideOutUp");
    $("#div-main").addClass("animate__slideInUp");
    setTimeout(() => {
      $("#div-main").removeClass("animate__slideInUp");
    }, 1000);
  }, 1000);
}

function CambiarSeccion2() {
  $("#div-main").addClass("animate__slideOutDown");
  setTimeout(() => {
    $("#div-datos").show();
    $("#div-imagenes").hide();
    $("#div-main").removeClass("animate__slideOutDown");
    $("#div-main").addClass("animate__slideInDown");
    setTimeout(() => {
      $("#div-main").removeClass("animate__slideInDown");
    }, 1500);
  }, 700);
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
      console.log(resultado);
      BuscarImagenes();
    },
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}
