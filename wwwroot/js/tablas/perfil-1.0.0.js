window.onload = function() {
BuscarPublicaciones();
visualizarPromedio();
}

async function BuscarPublicaciones(pagina = 1, elementosPorPagina = 10) {
  var usuarioID = $("#UsuarioID").val();
  const data = await $.ajax({
    url: "../../Publicaciones/BuscarPublicaciones2",
    data: {pagina:pagina,elementosPorPagina:elementosPorPagina, validarUsuario: usuarioID, validarActiva: false, habilitados: false },
    type: "GET",
    dataType: "json",
  });
  $("#tbody-publicaciones").empty();

  // Construir la representación de las publicaciónes
  data.lista.forEach((publicacion) => {
    let img = "",
      col,
      tags = "";
    if (
      publicacion.imagenes.length > 0 &&
      publicacion.imagenes[0].tipoImagen &&
      publicacion.imagenes[0].imagenBase64
    ) {
      img = `<div class="col-12 col-md-6 itemImg"><img src="data:${publicacion.imagenes[0].tipoImagen};base64, ${publicacion.imagenes[0].imagenBase64}"/></div>`;
      col = "col-md-6";
    }
    publicacion.servicios.forEach((etiqueta) => {
      tags += `<label class="badge bg-success text-wrap">${etiqueta.servicioNombre}</label> `;
    });

    const item = `
              <div onclick="Vista(${publicacion.publicacionID})" class="card_perfil my-2 row itemA">
                    ${img}
                    <div class="infoCard col-12 pt-2 ${col}">
                      <h4 class="m-0 px-2">${publicacion.titulo}</h4>
                      <label onclick="event.stopPropagation(); perfilView(${publicacion.usuarioID})">Por <b>${publicacion.usuarioNombre}</b></label>
                      <label>${tags}</label>
                      <p class="mx-2 mb-auto">${publicacion.resumen}</p>
                      <div class="card-footer d-flex">
                        <label class="my-auto">
                          Publicado el: ${moment(publicacion.fecha, "YYYY-MM-DD").format("DD-MM-YYYY")}
                        </label>
                        <label class="ms-auto valoracion">
                          ${generarIconos(publicacion.valoracionPuntaje)} (${publicacion.valoracionesCantidad})
                        </label>
                      </div>
                    </div>
              </div>`;

    // Agregar el elemento a la tabla
    $("#tbody-publicaciones").append(item);

    MostrarPaginacion(pagina, data.totalPaginas);
  });
}


let currentPage = 1;
let elementsPerPage = 10;
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

function visualizarPromedio(){
  var icons = generarIconos($("#ValoracionPuntaje").val());
  $("#ValoracionPromedio").html(icons);
};
