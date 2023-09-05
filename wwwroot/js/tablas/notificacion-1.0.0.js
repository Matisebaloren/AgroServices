var listaNotificaciones = []; // Variable para almacenar todas las notificacines
var usuario = [];

BuscarNotificaciones(); // Llama a la función para cargar las solicitudes al inicio

function BuscarNotificaciones() {
  $.ajax({
    url: "/Notificaciones/BuscarNotificacion",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      listaNotificaciones = data.notificaciones;
      // usuario = data.usuario;
      console.log(listaSolicitudes); // Almacena todas las solicitudes en la variable
      MostrarNotificaciones(); // Llama a la función para filtrar y mostrar las solicitudes
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud Ajax:");
      console.error("Estado: " + status);
      console.error("Error: " + error);
    },
  });
}

// $("#FiltroTipo, #FiltroEstado").on("change", function () {
//   filtrarYMostrarSolicitudes();
// });

// function filtrarYMostrarSolicitudes() {
//   // var tipo = $("#FiltroTipo").val();
//   // var estado = $("#FiltroEstado").val();

//   // Filtrar las solicitudes almacenadas en la variable
//   // var notificacionesFiltradas = listaNotificaciones.filter(function (notificacion) {
//   //   return cumpleConFiltros(solicitud, tipo, estado);
//   // });
//   console.log(solicitudesFiltradas);
//   mostrarNotificaciones(solicitudesFiltradas);
// }

// function cumpleConFiltros(solicitud, tipo, estado) {
//   console.log(solicitud, tipo, estado);

//   if (estado === "0" && solicitud.estado != 0) {
//     return false; // No cumple con el filtro de "estado 0" creado
//   } else if (estado === "1" && solicitud.estado != 1) {
//     return false; // No cumple con el filtro de "estado 1" cancelada
//   } else if (estado === "2" && solicitud.estado != 2) {
//     return false; // No cumple con el filtro de "estado 2" rechazada
//   } else if (estado === "3" && solicitud.estado != 3) {
//     return false; // No cumple con el filtro de "estado 3" Aceptado
//   } else if (estado === "4" && solicitud.estado != 4) {
//     return false; // No cumple con el filtro de "estado 4" Cocretado
//   }

//   if (tipo === "1" && solicitud.usuarioID == usuario.usuarioID) {
//     return false;
//   } else if (tipo === "2" && solicitud.usuarioID != usuario.usuarioID) {
//     return false;
//   }

//   return true; // Si no se aplican filtros de tipo, se devuelve true
// }

function mostrarNotificaciones() {
  var notificacionesContainer = $("#tablaNotificaciones}");
  notificacionesContainer.empty();

  $.each(listaNotificaciones, function (index, notificacion) {

    notificacionesContainer.append(`
        <tr onclick="modalInfo(${notificacion.notificacionID})" class="${classTable}">
            <td><i class="${iconClass}"></i></td>
            <td>${solicitud.descripcion}</td>
            <td>${estado}</td>
            <td>${botones}</td>
        </tr>
      `);
  });
}

function modalCancelar(id) {
  let solicitud = listaSolicitudes.find((s) => s.solicitudID === id);
  let tipo = solicitud.usuarioID != usuario.usuarioID ? "rechazar" : "cancelar";
  $("#modalCancelar .modal-body").html(
    `Se procederá a ${tipo} la solicitud relacionada con la publicación <strong>"${solicitud.publicacionTitulo}"</strong>. Esta acción implica la anulación de la solicitud y su eliminación del proceso en curso.`
  );
  $("#btn-cancelar").html(tipo);
  $("#modalCancelar").modal("show");
  $("#btn-cancelar").click(function () {
    cancelar(id);
  });
}

function cancelar(id) {
  $.ajax({
    url: "../../Notificaciones/cancelarSolicitud",
    type: "POST",
    data: {solicitudID : id},
    async: true,
    success: function (resultado) {
      $("#modalCancelar").modal("hide");
      BuscarSolicitudes(); // Actualizar la tabla
    },
    cache: false,
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema");
    },
  });
}

function modalConcretar(id) {
  let solicitud = listaSolicitudes.find((s) => s.solicitudID === id);
  $("#modalConcretar .modal-title").html(`Cocretar solicitud` );
  $("#modalConcretar .modal-body").html(
    `A continuación, se procederá a concretar el servicio relacionado con <strong>"${solicitud.publicacionTitulo}"</strong>. Este paso permite a los participantes en el servicio proporcionar sus valoraciones, lo que beneficia tanto a quienes brindan el servicio como al solicitante. `
  );
  $("#modalConcretar").modal("show");
  $("#btn-cancelar").click(function () {
    concretar(id);
  });
}

function modalAceptar(id) {
  let solicitud = listaSolicitudes.find((s) => s.solicitudID === id);
  $("#modalConcretar .modal-title").html(`Aceptar Solcitud`);
  $("#modalConcretar .modal-body").html(
    `A continuación, se procederá a concretar el servicio relacionado con <strong>"${solicitud.publicacionTitulo}"</strong>. Este paso permite a los participantes en el servicio proporcionar sus valoraciones, lo que beneficia tanto a quienes brindan el servicio como al solicitante. `
  );
  $("#modalConcretar").modal("show");
  $("#btn-cancelar").click(function () {
    aceptar(id);
  });
}

function concretar(id) {
  $.ajax({
    url: "../../Notificaciones/concretarSolicitud",
    type: "POST",
    data: { solicitudID : id },
    async: true,
    success: function (resultado) {
      $("#modalCancelar").modal("hide");
      BuscarSolicitudes(); // Actualizar la tabla
    },
    cache: false,
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema");
    },
  });
}
