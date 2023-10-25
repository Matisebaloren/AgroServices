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

  var valoSumatoria = 0;
  var dataGrapht = [0, 0, 0, 0, 0];
  publicacion.valoraciones.forEach((valoracion) => {
    console.log(valoracion);
    switch (valoracion.puntuacion) {
      case 1:
      case 2:
        dataGrapht[0]++;
        break;
      case 3:
      case 4:
        dataGrapht[1]++;
        break;
      case 5:
      case 6:
        dataGrapht[2]++;
        break;
      case 7:
      case 8:
        dataGrapht[3]++;
        break;
      case 9:
      case 10:
        dataGrapht[4]++;
        break;
      default:
      // Acciones predeterminadas si num no coincide con ningún caso
    }
    var fechaMoment = moment(valoracion.fecha, "YYYY-MM-DDTHH:mm:ss.SS");
    valoSumatoria += valoracion.puntuacion;
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
    
    let trImprimir = `
            <tr>
                <td>${valoracion.username} </td>
                <td>${valoracion.contenido} </td>
                <td>${valoracion.puntuacion}/10</td>
                <td>${fechaMoment.format(
                  "D [de] MMMM, YYYY"
                )} </td>
            </tr>
            `;
            $("#tbody-imprimir").append(trImprimir);  
  });
  console.log(dataGrapht);
  actualizarGraph(dataGrapht);

  var puntaje = 0;
  if (publicacion.valoraciones.length > 0) {
    puntaje = Math.round(valoSumatoria / publicacion.valoraciones.length);
  }
  $("#ValoracionGeneral").append(`
    <div id="valoracionPublicacion" class="ms-auto valoracion" onmouseover="mostrarInfo()" onmouseout="ocultarInfo()" ontouchstart="mostrarInfo()">
      ${generarIconos(puntaje)}
      </div>`);
}

function mostrarInfo() {
  var elemEstrellas = document.querySelector("#ValoracionGeneral .valoracion");
  var elemGraph = document.getElementById("ValoracionInfo");
    // Obtén las coordenadas de ValoracionGeneral
    var rect = elemEstrellas.getBoundingClientRect();
    console.log(rect);
    var top = rect.top + window.scrollY;
    var left = rect.left + window.scrollX + rect.width;


    // Muestra ValoracionInfo y posiciona en las mismas coordenadas
    $("#ValoracionInfo").show();
    elemGraph.style.opacity = 1;
    elemGraph.style.zIndex = 1;
    elemGraph.style.top = top + 5 + elemEstrellas.clientHeight + "px";
    elemGraph.style.left = (left - 300) + "px";
    console.log(elemGraph);
  
}
function ocultarInfo() {
  $("#ValoracionInfo").hide();
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
            title:
              "Puntuación inválida. La valoración mínima es de media estrella." +
              `<div class=" mx-auto valoracion">
              <i class="bx bxs-star-half"></i>
              <i class="bx bx-star"></i>
              <i class="bx bx-star"></i>
              <i class="bx bx-star"></i>
              <i class="bx bx-star"></i>
            </div>`,
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

function actualizarGraph(data) {
  const ctx = document.getElementById("GraphValoracion");

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["1", "2", "3", "4", "5"],
      datasets: [
        {
          label: "# numero de valoraciones",
          data: data,
          borderWidth: 1,
        },
      ],
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  });
}

function Imprimir() {
  var doc = new jsPDF();
  //var doc = new jsPDF('l', 'mm', [297, 210]);

  var totalPagesExp = "{total_pages_count_string}";
  var pageContent = function (data) {
    var pageHeight =
      doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
    var pageWidth =
      doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

    // FOOTER
    var str = "Pagina " + data.pageCount;
    // Total page number plugin only available in jspdf v1.0+
    if (typeof doc.putTotalPages == "function") {
      str = str + " de " + totalPagesExp;
    }

    doc.setLineWidth(8);
    doc.setDrawColor(238, 238, 238);
    doc.line(14, pageHeight - 11, 196, pageHeight - 11);

    doc.setFontSize(10);

    doc.setFontStyle("bold");

    doc.text(str, 17, pageHeight - 10);
  };

  var table = doc.autoTableHtmlToJson(
    document.getElementById("tabla-imprimir")
  );
  doc.autoTable({
    head: [table.columns],
    body: table.data,
    didDrawPage: function (data) {
      // Agrega tu función de pie de página aquí
    },
  });

  // ESTO SE LLAMA ANTES DE ABRIR EL PDF PARA QUE MUESTRE EN EL PDF EL NRO TOTAL DE PAGINAS. ACA CALCULA EL TOTAL DE PAGINAS.
  if (typeof doc.putTotalPages === "function") {
    doc.putTotalPages(totalPagesExp);
  }

  //doc.save('InformeSistema.pdf')

  var string = doc.output("datauristring");
  var iframe =
    "<iframe width='100%' height='100%' src='" + string + "'></iframe>";

  var x = window.open();
  if (x) {
    x.document.open();
    // Resto del código...
  } else {
    console.log("La ventana no se pudo abrir");
  }
  x.document.open();
  x.document.write(iframe);
  x.document.close();
}
