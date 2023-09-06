window.onload = BuscarPublicaciones();

async function BuscarPublicaciones(pagina = 1, elementosPorPagina = 10) {
  try {
    const [publicaciones, servicios] = await Promise.all([
      $.ajax({
        url: "../../Publicaciones/BuscarPublicaciones",
        data: { pagina, elementosPorPagina },
        type: "GET",
        dataType: "json",
      }),
      $.ajax({
        url: "../../Publicaciones/BuscarServicios",
        type: "GET",
        dataType: "json",
      }),
    ]);
    console.log("publicaciones: " + publicaciones.lista);
    const ListaServicios = new Map(
      servicios.map((servicio) => [servicio.servicioID, servicio.descripcion])
    );
    
    $("#tbody-publicaciones").empty();

    for (const publicacion of publicaciones.lista) {
      // Llamada AJAX para obtener las etiquetas
      const tags = await $.ajax({
        url: "../../Publicaciones/BuscarTagsActivos",
        data: { publicacionID: publicacion.publicacionID },
        type: "GET",
        dataType: "json",
      });

      // Crear una cadena de etiquetas
      let tagstring = "";
      for (const tag of tags) {
        if (tag.eliminado === false && ListaServicios.has(tag.servicioID)) {
          tagstring += ListaServicios.get(tag.servicioID) + " - ";
        }
      }

      // Llamada AJAX para obtener las imágenes
      const imagenes = await $.ajax({
        url: "../../Publicaciones/BuscarImagenes",
        data: { publicacionID: publicacion.publicacionID },
        type: "GET",
        dataType: "json",
      });

      // Construir la representación de la publicación
      let img = "";
      let col = "";
      if (imagenes.length > 0) {
        img = `<div class="col-12 col-md-6 itemImg"><img src="data:${imagenes[0].tipoImagen};base64, ${imagenes[0].imagenBase64}"/></div>`;
        col = "col-md-6";
      }
      // var fechaMoment = moment(publicacion.fecha, "YYYY-MM-DDTHH:mm:ss.SS");
      const item = `
        <tr>
          <td>
            <a onclick="Vista(${publicacion.publicacionID})" asp-route-id="0" class="row mx-2 itemA">
              ${img}
              <div class="col-12 ${col}">
                <h3>${publicacion.titulo}</h3>
                <p>${moment(publicacion.fecha, "YYYY-MM-DD").format("DD-MM-YYYY")}</p>
                <p class="badge bg-success text-wrap">${tagstring}</p>
                <p>${publicacion.resumen}</p>
                
              </div>
            </a>
          </td>
        </tr>`;

      // Agregar el elemento a la tabla
      $("#tbody-publicaciones").append(item);
    }

    MostrarPaginacion(pagina, publicaciones.totalPaginas);
  } catch (error) {
    console.error("Error al cargar datos:", error);
  }
}

// function transFecha(fecha) {
//   var ageDiff = DateTime.Now - fecha;
//   var age = "";
//   if (ageDiff.TotalDays > 365) {
//     var years = ageDiff.Days / 365;
//     if (years < 2) {
//       age = years + " Año";
//     } else {
//       age = years + " Años";
//     }
//   } else {
//     age = ageDiff.Days + " dias y " + ageDiff.Hours + " horas";
//   }
//   return age;
// }

let currentPage = 1;
let elementsPerPage = 10; // Cambiar según tu necesidad

function MostrarPaginacion(paginaActual, totalPaginas) {
  const maxPaginasCercanas = 2; // Cantidad de páginas cercanas a mostrar
  let minPagina = Math.max(paginaActual - maxPaginasCercanas, 1);
  let maxPagina = Math.min(paginaActual + maxPaginasCercanas, totalPaginas);

  let paginacionHTML = "";

  if (paginaActual > 1) {
    paginacionHTML += `<button id="firstButton">|<</button>`;
    paginacionHTML += `<button id="prevButton"><</button>`;
  }

  for (let pagina = minPagina; pagina <= maxPagina; pagina++) {
    if (pagina === paginaActual) {
      paginacionHTML += `<span class="current">${pagina}</span>`;
    } else {
      paginacionHTML += `<button class="pageButton">${pagina}</button>`;
    }
  }

  if (paginaActual < totalPaginas) {
    paginacionHTML += `<button id="nextButton">></button>`;
    paginacionHTML += `<button id="endButton">>|</button>`;
  }

  $("#pagination").html(paginacionHTML);
  paginacionHTML = `Página ${paginaActual} de ${totalPaginas}`;
  $("#paginationText").html(paginacionHTML);

  $(".pageButton").click(function () {
    const nuevaPagina = parseInt($(this).text());
    BuscarPublicaciones(nuevaPagina, elementsPerPage);
  });

  $("#prevButton").click(function () {
    if (currentPage > 1) {
      currentPage--;
      BuscarPublicaciones(currentPage, elementsPerPage);
    }
  });

  $("#nextButton").click(function () {
    currentPage++;
    BuscarPublicaciones(currentPage, elementsPerPage);
  });

  $("#firstButton").click(function () {
    currentPage = 1;
    BuscarPublicaciones(currentPage, elementsPerPage);
  });

  $("#endButton").click(function () {
    currentPage = totalPaginas;
    BuscarPublicaciones(currentPage, elementsPerPage);
  });
}

function PublicacionesPorPagina(cantidad) {
  elementsPerPage = cantidad;
  BuscarPublicaciones(1, elementsPerPage); // Volver a cargar las publicaciones con la nueva cantidad por página
}

function Vista(publicacionID) {
  console.log(publicacionID);
  window.location.href =
    `../../Publicaciones/VistaPublicacion/` + publicacionID;
}
