var listaSolicitudes = []; // Variable para almacenar todas las solicitudes
var usuario = [];

BuscarSolicitudes(); // Llama a la función para cargar las solicitudes al inicio

function BuscarSolicitudes() {
  $.ajax({
    url: "/Notificaciones/BuscarSolicitud",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      listaSolicitudes = data.solicitudes;
      usuario = data.usuario;
      console.log(listaSolicitudes); // Almacena todas las solicitudes en la variable
      filtrarYMostrarSolicitudes(); // Llama a la función para filtrar y mostrar las solicitudes
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud Ajax:");
      console.error("Estado: " + status);
      console.error("Error: " + error);
    },
  });
}

$("#FiltroTipo, #FiltroEstado").on("change", function () {
  filtrarYMostrarSolicitudes();
});

function filtrarYMostrarSolicitudes() {
  var tipo = $("#FiltroTipo").val();
  var estado = $("#FiltroEstado").val();

  // Filtrar las solicitudes almacenadas en la variable
  var solicitudesFiltradas = listaSolicitudes.filter(function (solicitud) {
    return cumpleConFiltros(solicitud, tipo, estado);
  });
  console.log(solicitudesFiltradas);
  mostrarSolicitudes(solicitudesFiltradas);
}

function cumpleConFiltros(solicitud, tipo, estado) {
  console.log(solicitud, tipo, estado);

  if (estado === "0" && solicitud.estado != 0) {
    return false; // No cumple con el filtro de "estado 0" creado
  } else if (estado === "1" && solicitud.estado != 1) {
    return false; // No cumple con el filtro de "estado 1" cancelada
  } else if (estado === "2" && solicitud.estado != 2) {
    return false; // No cumple con el filtro de "estado 2" rechazada
  } else if (estado === "3" && solicitud.estado != 3) {
    return false; // No cumple con el filtro de "estado 3" Aceptado
  } else if (estado === "4" && solicitud.estado != 4) {
    return false; // No cumple con el filtro de "estado 4" Cocretado
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
    let iconClass,
      botones = "",
      estado,
      selected = "",
      classTable = "table-light";
    if (solicitud.usuarioID == usuario.usuarioID) {
      iconClass = `bx bxs-phone-outgoing text-success`;
    } else {
      iconClass = `bx bxs-phone-incoming text-primary`;
    }
    switch (solicitud.estado) {
      case 0:
        console.log("0, recien creado");
        estado = "En espera";
        if (solicitud.usuarioID == usuario.usuarioID) {
          botones = `<button class="btn btn-danger" onclick="modalCancelar(${solicitud.solicitudID})">Cancelar</button>`;
        } else {
          botones = `
          <button class="btn btn-primary" onclick="modalAceptar(${solicitud.solicitudID})">Aceptar</button>
          <button class="btn btn-danger" onclick="modalCancelar(${solicitud.solicitudID})">Rechazar</button>
          `;
        }
        break;
      case 1:
        estado = "Cancelada"; // Cuando el que solicito se retracta de la solicitud.
        classTable = "table-danger";
        break;
      case 2:
        estado = "Rechazada"; // Cuando el dueño de la publicacion rechaza la solicitud.
        classTable = "table-danger";
        break;
      case 3:
        estado = "Aceptada"; // Cuando es aceptada la solicitud
        classTable = "table-success";
        if (solicitud.usuarioID != usuario.usuarioID) {
          botones = `<button class="btn btn-success" onclick="modalConcretar(${solicitud.solicitudID})">Concretar</button>`;
        }
        break;
      case 4:
        estado = "Cerrada";
        classTable = "table-secondary";
        break;
      default:
        console.log("0, ninguno");
        break;
    }
    if (solicitudIDJS && solicitudIDJS == solicitud.solicitudID) {
      selected = "selected";
    }

    solicitudesContainer.append(`
        <tr onclick="modalInfo(${
          solicitud.solicitudID
        })" class="${classTable} ${selected}">
            <td><i class="${iconClass}"></i></td>
            <td>${moment(solicitud.fecha).format("DD-MM-YYYY")}</td>
            <td>${solicitud.descripcion}</td>
            <td>${estado}</td>
            <td>${botones}</td>
        </tr>
      `);
  });

  if (solicitudIDJS) {
    var elemento = document.querySelector(".selected");

    // Desplazar automáticamente hasta el elemento seleccionado
    elemento.scrollIntoView({
      behavior: "smooth",
      block: "start",
      inline: "nearest",
    });
  }
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
    url: "../../Notificaciones/ModificarSolicitud",
    type: "POST",
    data: { solicitudID: id, estadoNuevo: 1 },
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
  $("#modalConcretar .modal-title").html(`Cocretar solicitud`);
  $("#modalConcretar .modal-body").html(
    `A continuación, se procederá a concretar el servicio relacionado con <strong>"${solicitud.publicacionTitulo}"</strong>. Este paso permite a los participantes en el servicio proporcionar sus valoraciones, lo que beneficia tanto a quienes brindan el servicio como al solicitante. `
  );
  $("#modalConcretar").modal("show");
  $("#btn-concretar").click(function () {
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
  $("#btn-concretar").click(function () {
    aceptar(id);
  });
}

function concretar(id) {
  $.ajax({
    url: "../../Notificaciones/ModificarSolicitud",
    type: "POST",
    data: { solicitudID: id, estadoNuevo: 4 },
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

function aceptar(id) {
  $.ajax({
    url: "../../Notificaciones/ModificarSolicitud",
    type: "POST",
    data: { solicitudID: id, estadoNuevo: 3 },
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
