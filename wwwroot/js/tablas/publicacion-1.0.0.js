let tagsActive = new Array();
let serviciosDisp = new Array();
let publicacionID = 13;
window.onload = BuscarPublicacion(publicacionID);

function BuscarPublicacion(publicacionID = 0) {
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
  $.ajax({
    url: "../../Publicaciones/BuscarImagenes",
    data: { publicacionID: publicacionID },
    type: "GET",
    dataType: "json",

    success: function (imagenes) {
      console.log("imagenes numero:" + imagenes.length);

      let clase = "active";
      $.each(imagenes, function (index, item) {
        let celdaEditar = `<td class="text-center"> <a class="btn btn-primary btn-sm" onClick="BuscarCategoria(${item.ImagenID})" role="button">Editar</a></td>`;
        let celdaDeshabilitar = `<td class="text-center"> <a class="btn btn-danger btn-sm" onClick="DeshabilitarHabilitar(${item.ImagenID}, true)" role="button">Deshabilitar</a></td>`;
        if (item.eliminado) {
          celdaEditar = `<td class="text-center"></td>`;
          celdaDeshabilitar = `<td class="text-center"> <a class="btn btn-success btn-sm" onClick="DeshabilitarHabilitar(${item.ImagenID}, false)" role="button">Habilitar</a></td>`;
        }

        let imagen = "<td></td>";
        if (item.imagenBase64) {
          imagen = `<td><img src="data:${item.tipoImagen};base64, ${item.imagenBase64}" style="width: 100%; height: 35vw; display: block"/></td>`;
        }

        $("#Lista_imagenes").append(
          `<div class="carousel-item ${clase}">
              ${imagen}
            </div>
            `
          // ${celdaEditar}
          // ${celdaDeshabilitar}
        );
        clase = "";
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar imagenes");
    },
  });

  // BUSCAR INFORMARCION DE PUBLICACION
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
      }
    },
    error: function (xhr, status) {
      alert("Error al cargar publicaciones");
    },
  });
}

function GuardarPublicacion() {
  //JAVASCRIPT
  let descripcion = $("#descripcion").val();
  let publicacionID = $("#PublicacionID").val();
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
      if (resultado == "faltas") {
        Toast.fire({
          icon: "error",
          title: "Complete el campo",
        });
      }
      if (resultado == "repetir") {
        Toast.fire({
          icon: "error",
          title: "La Provincia ya existe",
        });
      }
      if (resultado == "crear") {
        Toast.fire({
          icon: "error",
          title: "ta bien",
        });
        GuardarTags();
      }
    },

    // código a ejecutar si la petición falla;

    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}

function GuardarTags() {
  //JAVASCRIPT
  if (tagsActive.length > 0) {
    let publicacionID = $("#PublicacionID").val();

    $.each(tagsActive, function (index, tag) {
      let tagServicioID = tag.servicioID;
      let tagEliminado = tag.eliminado;
      console.log(tag);
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
  $("#ModalImagen").modal("show");
  actualizarTag();
}

$("#files").submit(function () {
  console.log($(this)[0]);
  var formData = new FormData($(this)[0]);
  var publicacionID = $("#PublicacionID").val();
  formData.append("publicacionID", publicacionID);
  console.log(formData);
  $.ajax({
    url: "../../Publicaciones/GuardarImagen",
    type: "POST",
    data: formData,
    async: false,
    success: function (resultado) {
      if (resultado) {
        $("#ModalImagen").modal("hide");
      } else {
      }
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
