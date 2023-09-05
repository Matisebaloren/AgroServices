window.onload = BuscarPublicaciones();

// function BuscarPublicaciones() {
//   $("#tbody-publicaciones").empty();

//   $.ajax({
//     url: "../../Publicaciones/BuscarPublicaciones",
//     data: {},
//     type: "GET",
//     dataType: "json",
//     success: function (publicaciones) {
//       $("#tbody-publicaciones").empty();
//       let item = "";
//       var ListaServicios = "";
//       $.ajax({
//         url: "../../Publicaciones/BuscarServicios",
//         data: {},
//         type: "GET",
//         dataType: "json",
//         success: function (servicios) {
//           ListaServicios = servicios;
//           console.log(ListaServicios);
//         },
//         error: function (xhr, status) {
//           alert("Error al cargar servicios");
//         },
//       });
//       $.each(publicaciones, function (index, publicacion) {
//         $.ajax({
//           url: "../../Publicaciones/BuscarTagsActivos",
//           data: { publicacionID: publicacion.publicacionID },
//           type: "GET",
//           dataType: "json",
//           success: function (tags) {
//             let tagstring = "";
//             $.each(tags, function (key, tag) {
//               if (tag.eliminado == false) {
//                 let search = ListaServicios.find(
//                   (s) => s.servicioID == tag.servicioID
//                 );
//                 tagstring +=  search.descripcion + " - ";
//                 console.log(tagstring);
//               }
//             });

//             $.ajax({
//               url: "../../Publicaciones/BuscarImagenes",
//               data: { publicacionID: publicacion.publicacionID },
//               type: "GET",
//               dataType: "json",
//               success: function (imagenes) {
//                 let img = "";
//                 let col = "";
//                 if (imagenes.length > 0) {
//                   console.log("imagen:" + imagenes);
//                   img = `<div class="col-12 col-md-6 itemImg mb-3"><img src="data:${imagenes[0].tipoImagen};base64, ${imagenes[0].imagenBase64}" style="width: 100%; height: 100%;"/></div>`;
//                   col = "col-md-6";
//                 }
//                 $.each(imagenes, function (key, tag) {
//                   console.log(tag);
//                 });
//                 console.log(publicacion.publicacionID + tagstring);
//                 item = `
//                     <tr>
//                         <td>
//                         <a onclick=Vista(${publicacion.publicacionID}) asp-route-id="0" class="row mx-2 itemA">

//                         ${img}

//                             <div class="col-12 ${col}">
//                                 <h3>${publicacion.titulo}</h3>
//                                 <p class="badge bg-success text-wrap">${tagstring}</p>
//                                 <p>${publicacion.descripcion}</p>
//                             </div>
//                         </a>
//                         </td>
//                     </tr>
//                     `;
//                 $("#tbody-publicaciones").append(`
//                             ${item}
//                         `);
//               },
//               error: function (xhr, status) {
//                 alert("Error al cargar publicaciones");
//               },
//             });
//           },
//           error: function (xhr, status) {
//             alert("Error al cargar tags");
//           },
//         });
//       });
//     },
//     error: function (xhr, status) {
//       alert("Error al cargar publicaciones");
//     },
//   });
// }

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
        img = `<div class="col-12 col-md-6 itemImg mb-3"><img src="data:${imagenes[0].tipoImagen};base64, ${imagenes[0].imagenBase64}" style="width: 100%; height: 100%;"/></div>`;
        col = "col-md-6";
      }

      const item = `
        <tr>
          <td>
            <a onclick="Vista(${publicacion.publicacionID})" asp-route-id="0" class="row mx-2 itemA">
              ${img}
              <div class="col-12 ${col}">
                <h3>${publicacion.titulo}</h3>
                <p class="badge bg-success text-wrap">${tagstring}</p>
                <p>${publicacion.descripcion}</p>
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

function PublicacionesPorPagina(cantidad){
  elementsPerPage = cantidad;
  BuscarPublicaciones(1, elementsPerPage); // Volver a cargar las publicaciones con la nueva cantidad por página
};

function Vista(publicacionID) {
  console.log(publicacionID);
  window.location.href =
    `../../Publicaciones/VistaPublicacion/` + publicacionID;
}
