let tagsActive = [];
let tagsExistentes = [];
let serviciosDisp = [];
var imgTemporalID = 0;

let publicacionID = $("#PublicacionID").val();
window.onload = () => {
  BuscarServicios();
  BuscarPublicacion(publicacionID);
  var formData = new FormData();

  // Verificar si el objeto FormData está vacío
  var estaVacio = true;
  formData.forEach(function (value, key) {
    estaVacio = false;
  });

  if (estaVacio) {
    console.log("El objeto FormData está vacío.");
  } else {
    console.log("El objeto FormData contiene datos.");
  }
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
      data: { publicacionID: publicacionID, validarActiva : false, habilitados: false},
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
          if(publicacion.eliminado == true){
            $("#Estado").prop("checked", false);
          }
          else{
            $("#Estado").prop("checked", true);
          }
          
          $("#Resumen").val(publicacion.resumen);
          // $("#descripcion").InnerHtML(publicacion.descripcion);
          tinymce.activeEditor.setContent(publicacion.descripcion);
        } else {
          publicacionID = 0;
        }

        //imagenes

        // if (publicacion.imagenes.length === 0) {
        // }
        publicacion.imagenes.forEach((item) => {
          if (imgTemporalID > item.imagenID) {
            imgTemporalID = item.imagenID + 1;
          }

          var imagenSrc = `data:${item.tipoImagen};base64, ${item.imagenBase64}`;

          var formData = new FormData();
          formData.append("imagen", null);
          formData.append("imagenSrc", imagenSrc);
          formData.append("imgTemporalID", item.imagenID);
          formData.append("imagenID", item.imagenID);
          formData.append("liminado", false);

          imagenesCargadas.push(formData);
        });
        actualizarImgs();
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
  let estado = $("#Estado").prop("checked");
  if ($("#EsOferta").val() == 1) {
    esOferta = true;
  } else {
    esOferta = false;
  }
  var tagsJSON = JSON.stringify(tagsActive);
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
        tagsJSON: tagsJSON,
        estado: estado,
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
          cargarImagenes();
        }
        if (resultado > 0) {
          Toast.fire({
            icon: "success",
            title: "Publicación inicializada. Recuerda añadir imagenes",
          });
          publicacionID = resultado;
          cargarImagenes();
          console.log("el id ahora es: " + resultado);
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

// QUITAR
function GuardarTags() {
  // invalidado con el controlador principal
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
$("#files").submit(function (event) {
  event.preventDefault();
  var imagenInput = document.getElementById("imagen");

  if (imagenInput.files.length > 0) {
    imgTemporalID++;
    var file = imagenInput.files[0];
    var imagenSrc = URL.createObjectURL(file);
    var formData = new FormData();
    formData.append("imagen", file);
    formData.append("imagenSrc", imagenSrc);
    formData.append("imgTemporalID", imgTemporalID);
    formData.append("imagenID", 0);
    // formData.append("eliminado", false);

    imagenesCargadas.push(formData);
    actualizarImgs();

    $("#ModalImagen").modal("hide");
  }
});

function actualizarImgs() {
  $("#Lista_imagenes").empty();
  var imageActive = "active";
  var cantidad = 0;
  var botones = $("#carouselExampleFade button");
  botones.hide();
  imagenesCargadas.forEach(function (img) {
    // var imagen = img.get("imagen");
    var imagenSrc = img.get("imagenSrc");
    var imgTemporalID = img.get("imgTemporalID");
    var eliminado = img.get("eliminado");
    
    eliminado = !!eliminado; // Forzamos a que la variable sea un bool
    console.log(eliminado);
    if (eliminado != true) {
      cantidad++;
      if(cantidad > 1){
        botones.show();
      }
      console.log("paso");
      var imagenImput = `<input type="hidden" name="selectID" value="${imgTemporalID}"></input><img src="${imagenSrc}"/>`;
      $("#Lista_imagenes").append(
        `<div class="carousel-item ${imageActive}">${imagenImput}</div>`
      );
      imageActive = "";
    }
  });
}

function cargarImagenes() {
  imagenesCargadas.forEach(function (imagenCargada) {
    imagenCargada.append("publicacionID", publicacionID);
    $.ajax({
      url: "../../Publicaciones/GuardarImagen",
      type: "POST",
      data: imagenCargada,
      success: function (resultado) {
        console.log("imagen Guardada");
      },
      cache: false,
      contentType: false,
      processData: false,
      error: function (xhr, status) {
        // alert("Disculpe, existió un problema");
        console.log("imagen no Guardada");
      },
    });
  });
  return;
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
    if (resultado.eliminado != undefined) {
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
  
  var imgTemporalID = $(".active").find('[name="selectID"]').val();
  console.log(imgTemporalID);
  // Buscar el elemento en el array por imgTemporalID
  var elementoAEliminar = imagenesCargadas.find(function (element) {
    return element.get("imgTemporalID") === imgTemporalID;
  });

  if (elementoAEliminar) {
    // Modificar la propiedad "Eliminado" a true
    elementoAEliminar.set("eliminado", true);
  }
  actualizarImgs();
}
