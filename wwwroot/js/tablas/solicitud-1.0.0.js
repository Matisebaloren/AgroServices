var todasLasSolicitudes = []; // Variable para almacenar todas las solicitudes
var usuario = [];

BuscarSolicitudes(); // Llama a la función para cargar las solicitudes al inicio

$("#FiltroTipo, #FiltroVisto").on("change", function () {
  filtrarYMostrarSolicitudes();
});

function BuscarSolicitudes() {
  $.ajax({
    url: "/Solicitudes/BuscarSolicitud",
    type: "GET",
    dataType: "json",
    success: function (data) {
      todasLasSolicitudes = data.solicitudes;
      usuario = data.usuario;
      console.log(todasLasSolicitudes); // Almacena todas las solicitudes en la variable
      filtrarYMostrarSolicitudes(); // Llama a la función para filtrar y mostrar las solicitudes
    },
    error: function () {},
  });
}

function filtrarYMostrarSolicitudes() {
  var tipo = $("#FiltroTipo").val();
  var visto = $("#FiltroVisto").val();

  // Filtrar las solicitudes almacenadas en la variable
  var solicitudesFiltradas = todasLasSolicitudes.filter(function (solicitud) {
    return cumpleConFiltros(solicitud, tipo, visto);
  });
  console.log(solicitudesFiltradas);
  mostrarSolicitudes(solicitudesFiltradas);
}

function cumpleConFiltros(solicitud, tipo, visto) {
  console.log(solicitud, tipo, visto);

  if (visto === "1" && solicitud.estado > 0) {
    return false; // No cumple con el filtro de "visto 1"
  }
  if (visto === "2" && solicitud.estado == 0) {
    return false; // No cumple con el filtro de "visto 2"
  }

  if (tipo === "1" && solicitud.usuarioID == usuario.usuarioID) {
    return false;
  } else if (tipo === "2" && solicitud.usuarioID != usuario.usuarioID) {
    return false;
  }

  return true; // Si no se aplican filtros de tipo, se devuelve true
}

function mostrarSolicitudes(solicitudes) {
  var solicitudesContainer = $("#tablaSolicitudes");
  solicitudesContainer.empty();

  $.each(solicitudes, function (index, solicitud) {
    let iconClass = solicitud.usuarioID == usuario.usuarioID
        ? "bx bxs-phone-outgoing text-success"
        : "bx bxs-phone-incoming text-primary";

    solicitudesContainer.append(`
        <tr>
            <td><i class="${iconClass}"></i></td>
            <td>${solicitud.descripcion}</td>
            <td>${moment(solicitud.fecha).format("DD-MM-YYYY")}</td>
        </tr>
      `);
    // Puedes mostrar más detalles de la solicitud como necesites
  });
}
