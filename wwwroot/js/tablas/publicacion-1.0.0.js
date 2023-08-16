let tagsActive = [];
let serviciosDisp = [];
let publicacionID = $("#PublicacionID").val();
let usuarioID = $("#usuarioID").val();

console.log(publicacionID + " este es el id de publicacion");
console.log(usuarioID + " este es el id del usuario");

window.onload = () => {
  BuscarPublicacion(publicacionID);
};

const BuscarPublicacion = (publicacionID = 0) => {
  BuscarServicios();

  if (publicacionID !== 0) {
    BuscarTagsActivos(publicacionID);
    BuscarImagenes();
    BuscarInformacionPublicacion(publicacionID);
  }
};

const BuscarServicios = () => {
  $.ajax({
    url: "../../Publicaciones/BuscarServicios",
    type: "GET",
    dataType: "json",
    success: (servicios) => {
      serviciosDisp = servicios;
    },
    error: (xhr, status) => {
      alert("Error al cargar servicios");
    },
  });
};

const BuscarTagsActivos = (publicacionID) => {
  $.ajax({
    url: "../../Publicaciones/BuscarTagsActivos",
    data: { publicacionID: publicacionID },
    type: "GET",
    dataType: "json",
    success: (etiquetas) => {
      etiquetas.forEach((tag) => {
        if (!tag.eliminado) {
          AñadirEtiqueta(tag.servicioID);
        }
      });
    },
    error: (xhr, status) => {
      alert("Error al cargar etiquetas");
    },
  });
};

const BuscarImagenes = () => {
  $("#Lista_imagenes").empty();
  $.ajax({
    url: "../../Publicaciones/BuscarImagenes",
    data: { publicacionID: publicacionID },
    type: "GET",
    dataType: "json",
    success: (imagenes) => {
      let clase = "active";
      if (imagenes.length === 0) {
        // Código para mostrar la imagen por defecto
      }
      imagenes.forEach((item) => {
        let imagen = "<td></td>";
        if (item.imagenBase64) {
          imagen = `<center><input hidden name="id" value="${item.imagenID}"></input><img src="data:${item.tipoImagen};base64, ${item.imagenBase64}" style="height: 35vw; display: block"/></center>`;
        }
        $("#Lista_imagenes").append(
          `<div class="carousel-item ${clase}" >
              ${imagen}
            </div>`
        );
        clase = "";
      });
    },
    error: (xhr, status) => {
      alert("Error al cargar imagenes");
    },
  });
};

const BuscarInformacionPublicacion = (publicacionID) => {
  if (publicacionID > 0) {
    $("#btn-cambiar").show();
    $.ajax({
      url: "../../Publicaciones/BuscarPublicaciones",
      data: { publicacionID: publicacionID },
      type: "GET",
      dataType: "json",
      success: (publicaciones) => {
        if (publicaciones.length > 0) {
          const publicacion = publicaciones[0];
          $("#EsOferta").val(publicacion.esOferta ? "1" : "2");
          seleccionarTipo(publicacion.esOferta ? "1" : "2");
          $("#UsuarioID").val(publicacion.usuarioID);
          $("#Titulo").val(publicacion.titulo);
          // $("#descripcion").InnerHtML(publicacion.descripcion);
          tinymce.activeEditor.setContent(publicacion.descripcion);
        } else {
          publicacionID = 0;
        }
      },
      error: (xhr, status) => {
        alert("Error al cargar publicaciones");
      },
    });
  }
};

function GuardarPublicacion() {
  //JAVASCRIPT

  var contenido = tinymce.activeEditor.getContent();
  console.log("descripcion:" + contenido);
  let esOferta = null;
  let titulo = $("#Titulo").val();
  if ($("#EsOferta").val() == 1) {
    esOferta = true;
  } else {
    esOferta = false;
  }

  if (titulo || descripcion || esOferta > 0) {
    $.ajax({
      // la URL para la petición
      url: "../../Publicaciones/GuardarPublicacion",
      // la información a enviar
      // (también es posible utilizar una cadena de datos)
      data: {
        publicacionID: publicacionID,
        descripcion: contenido,
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
  $("#ServicioID").prop("disabled", isDisabled);
  $("#Etiqueta-List").toggle(!isHidden);
  $("#descripcion").prop("disabled", isDisabled);
  $("#btn-guardar").prop("disabled", isDisabled);

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
  /*   console.log(resultado);*/
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
