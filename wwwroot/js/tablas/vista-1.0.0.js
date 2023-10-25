var usuarioID = $("#usuarioID").val();
if (usuarioID == 0) {
  $("#btn-solicitud").hide();
}
var publicacionID = $("#PublicacionID").val();

window.onload = BuscarPublicacion();

async function BuscarPublicacion() {
  const data = await $.ajax({
    url: "../../Publicaciones/BuscarPublicaciones2",
    data: { publicacionID: publicacionID, verficarValorar: true },
    type: "GET",
    dataType: "json",
  });
  console.log(data);
  $("#tbody-publicaciones").empty();

  // Construir la representación de las publicaciónes
  var publicacion = data.lista[0];
  //imagenes
  if (publicacion.imagenes.length > 0) {
    let claseActive = "active";
    publicacion.imagenes.forEach((imagen) => {
      let imagenHtml = "<td></td>";
      if (imagen.imagenBase64) {
        imagenHtml = `<img class="mx-auto imagen" alt="Imagen" src="data:${imagen.tipoImagen};base64, ${imagen.imagenBase64}" />`;
      }
      $("#Lista_imagenes").append(
        `<div class="carousel-item carrousel-ajuste ${claseActive}" >
            ${imagenHtml}
          </div>
          `
      );
      claseActive = "";
    });
  }

  //servicios
  var tags = "";
  publicacion.servicios.forEach((etiqueta) => {
    tags += `<label class="badge bg-success text-wrap">${etiqueta.servicioNombre}</label>`;
  });
  console.log("tags: " + tags);

  //asignando html
  $("#tags").html(tags);
  $("#titulo").html(publicacion.titulo);
  $("#tituloModal").html(publicacion.titulo);
  $("#usuario").html(
    "Publicado por <i class='bx bx-user'></i><a href='#' onclick='perfilView(" +
      publicacion.usuarioID +
      ")'>" +
      publicacion.usuarioNombre +
      "</a> (" +
      moment(publicacion.fecha, "YYYY-MM-DD").format("DD-MM-YYYY") +
      ")"
  );
  $("#userName").append(publicacion.usuarioNombre);
  $("#resumen").html(publicacion.resumen);
  $("#descripcion").html(publicacion.descripcion);

  //validaciones
  if (publicacion.propia == true) {
    $("#btn-solicitud").hide();
    $("#btn-editar").show();
  } else {
    if (publicacion.puedeValorar == true) {
      $("#ValoracionCreate").show();
    }
  }

  publicacion.valoraciones.forEach((valoracion) => {
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
}

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
    success: function (resultado) {
      if (resultado == "Crear") {
        $("#ValoracionCreate").hide();
        BuscarValoraciones();
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
        if (resultado == "Puntuacion0") {
          Toast.fire({
            icon: "error",
            title: "Puntuación inválida. La valoración mínima es de media estrella."+
            `<div class=" mx-auto valoracion">
              <i class="bx bxs-star-half"></i>
              <i class="bx bx-star"></i>
              <i class="bx bx-star"></i>
              <i class="bx bx-star"></i>
              <i class="bx bx-star"></i>
            </div>`
          });
        } else {
          Toast.fire({
            icon: "error",
            title: "error",
          });
        }
      }
    },
    error: function (xhr, status) {
      alert("Error al cargar valoracion");
    },
  });
}

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
var selectValor = 0;

function showValoracion(valor) {
  console.log("estrellas: " + valor);
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
