var usuarioID = $("#usuarioID").val();
if (usuarioID == 0) {
  $("#btn-solicitud").hide();
}
var publicacionID = $("#PublicacionID").val();

window.onload = BuscarPublicaciones();

function BuscarPublicaciones() {
  BuscarValoraciones();
  var publicacionID = $("#PublicacionID").val();
  console.log(publicacionID);
  $.ajax({
    url: "../../Publicaciones/BuscarPublicaciones",
    data: { publicacionID: publicacionID },
    type: "GET",
    dataType: "json",
    success: function (publicaciones) {
      $("#titulo").html(publicaciones[0].titulo);
      $("#tituloModal").html(publicaciones[0].titulo);

      // let time = publicaciones[0].fecha.ToString("dd/MM/yyyy")
      let arrTime = publicaciones[0].fecha.split("T");
      let dia = arrTime[0].split("-");
      let diaArmado = dia[2] + "/" + dia[1] + "/" + dia[0];
      if (publicaciones[0].usuarioID == usuarioID) {
        $("#btn-solicitud").hide();
        // console.log("dueño");
        $("#btn-editar").show();
      }
      console.log(arrTime);
      // $("#fecha").html(arrTime[0]);
      $("#fecha").html(diaArmado);
      $("#descripcion").html(publicaciones[0].descripcion);
    },
    error: function (xhr, status) {
      alert("Error al cargar publicaciones");
    },
  });
  let item = "";
  var ListaServicios = "";
  $.ajax({
    url: "../../Publicaciones/BuscarServicios",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (servicios) {
      ListaServicios = servicios;
      console.log(ListaServicios);
    },
    error: function (xhr, status) {
      alert("Error al cargar servicios");
    },
  });

  $.ajax({
    url: "../../Publicaciones/BuscarTagsActivos",
    data: { publicacionID: publicacionID },
    type: "GET",
    dataType: "json",
    success: function (tags) {
      console.log(tags);
      let tagstring = "";
      $.each(tags, function (key, tag) {
        if (tag.eliminado == false) {
          let search = ListaServicios.find(
            (s) => s.servicioID == tag.servicioID
          );
          tagstring += " - " + search.descripcion;
          console.log(tagstring);
          $("#tags").show();
        }
      });
      $("#tags").html(tagstring);
    },
    error: function (xhr, status) {
      alert("Error al cargar tags");
    },
  });

  // buscamos imagenes relacionadas
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
          imagen = `<img class="mx-auto imagen" alt="Imagen" src="data:${item.tipoImagen};base64, ${item.imagenBase64}" />`;
        }
        $("#Lista_imagenes").append(
          `<div class="carousel-item carrousel-ajuste ${clase}" >
            ${imagen}
          </div>
          `
        );
        clase = "";
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar publicaciones");
    },
  });
}

function nuevaSolicitud() {
  $("#ModalSolicitud").modal("show");
}

function EnviarSolicitud() {
  var descripcion = $("#descripcionSolicitud").val();
  $.ajax({
    url: "../../Notificaciones/GuardarSolicitud",
    data: {
      publicacionID: publicacionID,
      descripcion: descripcion,
      usuarioID: usuarioID,
    },
    type: "POST",
    dataType: "json",

    success: function (resultado) {
      console.log(resultado);
      $("#ModalSolicitud").modal("hide");
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
      if (resultado == "Error") {
        Toast.fire({
          icon: "Error",
          title: "Petición invalida, Prueba en otro momento",
        });
      }
      if (resultado == "Crear") {
        Toast.fire({
          icon: "success",
          title: "Solicitud enviada correctamente.",
        });
        console.log("el id ahora es: " + resultado);
        $("#ModalSolicitud").modal("hide");
      }
    },

    // código a ejecutar si la petición falla;

    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}

function enviarValoracion() {
  contenido = $("#Contenido").val();
  console.log(contenido);
  puntuacion = selectValor;
  $.ajax({
    url: "../../Valoraciones/GuardarValoracion",
    data: {
      publicacionID: publicacionID,
      contenido: contenido,
      puntuacion: puntuacion,
    },
    type: "POST",
    dataType: "json",
    success: function (tags) {
      $("#ValoracionCreate").hide();
      BuscarValoraciones();
    },
    error: function (xhr, status) {
      alert("Error al cargar valoracion");
    },
  });
}
// function enviarSolicitud() {
//   descripcion = $("#descripcionSolicitud").val();
//   $.ajax({
//     url: "../../Solicitudes/GuardarSolicitud",
//     data: {
//       publicacionID: publicacionID,
//       descripcion: descripcion,
//       usuarioID: usuarioID,
//     },
//     type: "GET",
//     dataType: "json",
//     success: function (tags) {},
//     error: function (xhr, status) {
//       alert("Error al cargar valoracion");
//     },
//   });
// }

function BuscarValoraciones() {
  $("#Valoraciones").empty();
  // $("#Valoraciones").empty();
  $.ajax({
    url: "../../Publicaciones/BuscarValoraciones",
    data: { publicacionID: publicacionID },
    type: "GET",
    dataType: "json",
    success: function (valoraciones) {
      let texto = "";
      $.each(valoraciones, function (index, valoracion) {
        var fechaMoment = moment(valoracion.fecha, "YYYY-MM-DDTHH:mm:ss.SS");
        comentario = `
          <div class="comentario">
            <div class="comentario-contenido">
              <div class="comentario-header">
                <p class="nombre-usuario">${valoracion.username}</p>
                <div class="valoracion">
                ${generarIconos(valoracion.puntuacion)}
                </div>
              </div>
              <p class="texto-comentario">${valoracion.contenido}</p>
              <p class="fecha-comentario">Publicado el ${fechaMoment.format(
                "D [de] MMMM, YYYY"
              )}</p>
            </div>
          </div>
        `;
        $("#Valoraciones").append(comentario);
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar valoraciones");
    },
  });
}

function generarIconos(valor) {
  const iconos = [];

  const iconoLlena = '<i class="bx bxs-star"></i>';
  const iconoMediaLlena = '<i class="bx bxs-star-half"></i>';
  const iconoVacia = '<i class="bx bx-star"></i>';

  // Determinar el número de iconos llenos, medios llenos y vacíos
  const iconosLlenos = Math.floor(valor / 2);
  const iconoMedia = valor % 2 === 1 ? iconoMediaLlena : "";
  const iconosVacios = 5 - iconosLlenos - (iconoMedia === "" ? 0 : 1);

  // Agregar iconos llenos
  for (let i = 0; i < iconosLlenos; i++) {
    iconos.push(iconoLlena);
  }

  // Agregar icono medio lleno si es necesario
  if (iconoMedia !== "") {
    iconos.push(iconoMedia);
  }

  // Agregar iconos vacíos
  for (let i = 0; i < iconosVacios; i++) {
    iconos.push(iconoVacia);
  }

  return iconos.join(""); // Convertir el arreglo a una cadena de iconos
}

const stars = document.querySelectorAll("#inputValoracion i");
console.log(stars.length);
stars.forEach((star, index) => {
  star.addEventListener("mousemove", function (event) {
    const starRect = star.getBoundingClientRect();
    const centerx = (starRect.left + starRect.right) / 2;
    const touchX = event.clientX;
    var valor = index * 2;
    if (touchX < centerx) {
      valor = valor + 1;
    } else {
      valor = valor + 2;
    }
    showValoracion(valor);
    hoverValor = valor;
  });
  star.addEventListener("click", function (event) {
    selectValor = hoverValor;
  });
  star.addEventListener("mouseleave", function () {
    showValoracion(selectValor);
  });
});

var hoverValor = 10;
var selectValor = 10;

function showValoracion(valor) {
  stars.forEach((star, index) => {
    i = (index + 1) * 2;
    console.log(valor + " " + i);

    star.className = "";
    if (valor >= i) {
      console.log("mayor");
      star.classList.add("bx", "bxs-star");
    } else {
      if (valor == i - 1) {
        star.classList.add("bx", "bxs-star-half");
      } else {
        console.log("menor o igual");
        star.classList.add("bx", "bx-star");
      }
    }
  });
}
function seleccionarValor(valor) {}
