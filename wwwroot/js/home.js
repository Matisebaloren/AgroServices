var elementosOcultos = null;
$(document).ready(function () {
  BuscarServicios();
  BuscarPublicaciones();
});
var rotateCols;
function BuscarServicios() {
  $("#cards-servicios").empty();

  $.ajax({
    url: "../../Servicios/BuscarServicios",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (servicios) {
      console.log("La solicitud AJAX fue exitosa");
      console.log("Datos recibidos:", servicios);

      $.each(servicios, function (index, servicio) {
        if (servicio.eliminado == false) {
          let oculto = "";
          if (index > 5) {
            oculto = "oculto";
          }
          console.log("Añadiendo servicio:", servicio.nombre);
          $("#cards-servicios").append(`
            <div class="col-4 col-sm-3 col-lg-2 pb-3 px-2 card-mobile rotate-col ${oculto}">
              <div class="card shadow rounded-lg">
                <div href="#" class="text-center">
                  <h6 class="grey-text my-2">${servicio.descripcion}</h6>
                </div>
              </div>
            </div>       
          `);
        }
      });
      elementosOcultos = $(".oculto");
      elementosOcultos.hide();
      if (servicios.length <= 6) {
        $("#toggleButton").hide();
      }
      rotateCols = document.querySelectorAll(".rotate-col");
      // console.log("cols:" + rotateCols);
      rotateServicios();
    },
    error: function (xhr, status) {
      console.log("Error en la solicitud AJAX:", status);
      alert("Error al cargar servicios");
    },
  });

  console.log("Fin de la función BuscarServicios");
}

// Agrega un botón o elemento que desencadenará la alternancia de visibilidad
$("#toggleButton").click(function () {
  elementosOcultos.toggle(); // Alterna la visibilidad de los elementos ocultos
  $(this).toggleClass("vuelta");
  rotateServicios();
});

function rotateServicios() {
  rotateCols.forEach(function (col, index) {
    var rect = col.getBoundingClientRect();
    var medio = window.innerWidth / 2;
    // Calculamos la posición horizontal del centro del elemento col
    var posX = rect.left + rect.width / 2;

    // Calculamos la rotación en grados basada en la posición horizontal
    var rotation = ((posX * 60) / window.innerWidth - 30) * -1;

    // Calculamos la escala basada en la posición horizontal
    var scale = (((medio - posX) * (posX > medio ? -1 : 1)) / medio) * 0.2 + 1;

    col.style.transform = `perspective(350px) rotateY(${rotation}deg) scale(${scale})`;
  });
}

window.addEventListener("resize", function () {
  rotateServicios();
});

function BuscarPublicaciones() {
  $("#cards-servicios").empty();

  $.ajax({
    url: "../../Publicaciones/BuscarPublicaciones",
    data: { elementosPorPagina: 6 },
    type: "GET",
    dataType: "json",
    success: function (datos) {
      console.log(datos);
      $.each(datos.lista, async function (index, publicacion) {
        if (publicacion.eliminado == false) {
          //  Llamada AJAX para obtener las imágenes
          var imagen = null;
          await $.ajax({
            url: "../../Publicaciones/BuscarImagenes",
            data: { publicacionID: publicacion.publicacionID },
            type: "GET",
            dataType: "json",
            success: function (imagenes) {
              imagen = imagenes[0];
            },
          });

          console.log(imagen);
          let img = "";
          if (imagen != null) {
            img = `data:${imagen.tipoImagen};base64, ${imagen.imagenBase64}`;
          }
          else{
            img = `../img/cosechadora.jpg`;
          }
         
          // Construir la representación de la publicación
          $("#grid-Publicaciones").append(`
            <label class="card" onclick="Vista(${publicacion.publicacionID})">
              <div class="card__body">
                <div class="card__body-cover"><img class="card__body-cover-image"
                    src="${img}" /></span>
                </div>
                <header class="card__body-header">
                  <h4 class="card__body-header-title">${publicacion.titulo}</h4>
                </header>
              </div>
            </label>       
          `);
        }
      });
    },
    error: function (xhr, status) {
      console.log("Error en la solicitud AJAX:", status);
      alert("Error al cargar servicios");
    },
  });

  console.log("Fin de la función BuscarServicios");
}

// async function BuscarPublicaciones(limite = 6) {
//   try {
//     const [publicaciones, servicios] = await Promise.all([
//       $.ajax({
//         url: "../../Publicaciones/BuscarPublicaciones",
//         data: { pagina, elementosPorPagina },
//         type: "GET",
//         dataType: "json",
//       }),
//       $.ajax({
//         url: "../../Publicaciones/BuscarServicios",
//         type: "GET",
//         dataType: "json",
//       }),
//     ]);
//     console.log("publicaciones: " + publicaciones.lista);
//     const ListaServicios = new Map(
//       servicios.map((servicio) => [servicio.servicioID, servicio.descripcion])
//     );

//     $("#tbody-publicaciones").empty();

//     for (const publicacion of publicaciones.lista) {
//       // Llamada AJAX para obtener las etiquetas
//       const tags = await $.ajax({
//         url: "../../Publicaciones/BuscarTagsActivos",
//         data: { publicacionID: publicacion.publicacionID },
//         type: "GET",
//         dataType: "json",
//       });

//       // Crear una cadena de etiquetas
//       let tagstring = "";
//       for (const tag of tags) {
//         if (tag.eliminado === false && ListaServicios.has(tag.servicioID)) {
//           tagstring += ListaServicios.get(tag.servicioID) + " - ";
//         }
//       }

//       // Llamada AJAX para obtener las imágenes
//       const imagenes = await $.ajax({
//         url: "../../Publicaciones/BuscarImagenes",
//         data: { publicacionID: publicacion.publicacionID },
//         type: "GET",
//         dataType: "json",
//       });

//       // Construir la representación de la publicación
//       let img = "";
//       let col = "";
//       if (imagenes.length > 0) {
//         img = `<div class="col-12 col-md-6 itemImg"><img src="data:${imagenes[0].tipoImagen};base64, ${imagenes[0].imagenBase64}"/></div>`;
//         col = "col-md-6";
//       }
//       // var fechaMoment = moment(publicacion.fecha, "YYYY-MM-DDTHH:mm:ss.SS");
//       const item = `
//           <tr>
//             <td>
//               <a onclick="Vista(${
//                 publicacion.publicacionID
//               })" asp-route-id="0" class="row mx-2 itemA">
//                 ${img}
//                 <div class="col-12 ${col}">
//                   <h3>${publicacion.titulo}</h3>
//                   <p>${moment(publicacion.fecha, "YYYY-MM-DD").format(
//                     "DD-MM-YYYY"
//                   )}</p>
//                   <p class="badge bg-success text-wrap">${tagstring}</p>
//                   <p>${publicacion.resumen}</p>

//                 </div>
//               </a>
//             </td>
//           </tr>`;

//       // Agregar el elemento a la tabla
//       $("#tbody-publicaciones").append(item);
//     }

//     MostrarPaginacion(pagina, publicaciones.totalPaginas);
//   } catch (error) {
//     console.error("Error al cargar datos:", error);
//   }
// }
