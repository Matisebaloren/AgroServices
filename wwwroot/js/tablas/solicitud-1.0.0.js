var listaSolicitudes = []; // Variable para almacenar todas las solicitudes
var usuario = [];

BuscarSolicitudes(); // Llama a la función para cargar las solicitudes al inicio

function BuscarSolicitudes() {
  $.ajax({
    url: "/Notificaciones/BuscarSolicitud",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log("data: " + data);
      listaSolicitudes = data.solicitudes;
      usuario = data.usuario; //mejor pasar el usuarioID
      console.log(usuario);
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

  if (tipo === "2" && solicitud.usuarioID == usuario.usuarioID) {
    return false;
  } else if (tipo === "1" && solicitud.usuarioID != usuario.usuarioID) {
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
    if (solicitud.usuarioID != usuario.usuarioID) {
      iconClass = `bx bxs-phone-outgoing text-success`;
    } else {
      iconClass = `bx bxs-phone-incoming text-primary`;
    }
    switch (solicitud.estado) {
      case 0:
        estado = "En espera";
        if (solicitud.usuarioID != usuario.usuarioID) {
          botones = `<button class="btn btn-danger" onclick="event.stopPropagation(); modalCancelar(${solicitud.solicitudID})">Cancelar</button>`;
        } else {
          botones = `
          <button class="btn btn-primary" onclick="event.stopPropagation(); modalAceptar(${solicitud.solicitudID})">Aceptar</button>
          <button class="btn btn-danger" onclick="event.stopPropagation(); modalCancelar(${solicitud.solicitudID})">Rechazar</button>
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
        if (solicitud.usuarioID == usuario.usuarioID) {
          botones = `<button class="btn btn-success" onclick="event.stopPropagation(); modalConcretar(${solicitud.solicitudID})">Concretar</button>`;
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
        <tr onclick="modalDetalle(${
          solicitud.solicitudID
        })" class="${classTable} ${selected}">
            <td><i class="${iconClass}"></i></td>
            <td>${moment(solicitud.fecha).format("DD-MM-YYYY")}</td>
            <td>${solicitud.publicacionTitulo}</td>
            
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
    actualizarSolicitud(id, 1);
  });
}

function modalConcretar(id) {
  let solicitud = listaSolicitudes.find((s) => s.solicitudID === id);
  $("#modalConcretar .modal-title").html(`Cocretar solicitud`);
  $("#modalConcretar .modal-body").html(
    `<p>
    A continuación, se procederá a concretar el servicio relacionado con <strong>"${solicitud.publicacionTitulo}"</strong>. Este paso es esencial ya que permite a los participantes en el servicio proporcionar sus valoraciones y comentarios sobre la experiencia.
  </p>
  <p>
    Las valoraciones y comentarios son valiosos tanto para quienes brindan el servicio como para el solicitante. Ayudan a construir la reputación de los usuarios y a mantener la calidad de los servicios en nuestra plataforma.
  </p>
  <p>
    ¿Estás seguro de que deseas concretar esta solicitud?
  </p>`
  );
  $("#modalConcretar").modal("show");
  $("#btn-concretar").html("Concretar solicitud");
  $("#btn-concretar").click(function () {
    actualizarSolicitud(id, 4);
  });
}

function modalAceptar(id) {
  let solicitud = listaSolicitudes.find((s) => s.solicitudID === id);
  $("#modalConcretar .modal-title").html(`Aceptar Solcitud`);
  $("#modalConcretar .modal-body").html(
    `<p>
    Al aceptar esta solicitud relacionada con el servicio <strong>"${solicitud.publicacionTitulo}"</strong>, estás confirmando tu compromiso de avanzar con la transacción acordada.
  </p>
  <p>
    Una vez que se complete el trabajo, podrás marcar la solicitud como "Concretada" y permitir que tanto tú como el solicitante califiquen y valoren la experiencia. Esto ayuda a mantener la confianza y la transparencia en nuestra plataforma.
  </p>
  <p>
    ¿Estás seguro de que deseas aceptar esta solicitud?
  </p>`
  );
  $("#modalConcretar").modal("show");
  $("#btn-concretar").html("Aceptar solicitud");
  $("#btn-concretar").click(function () {
    actualizarSolicitud(id, 3);
  });
}

function actualizarSolicitud(id, newState) {
  $("#modalConcretar").modal("hide");
  $("#modalCancelar").modal("hide");
  console.log(newState);
  $.ajax({
    url: "../../Notificaciones/ModificarSolicitud",
    type: "POST",
    data: { solicitudID: id, estadoNuevo: newState },
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

function modalDetalle(id) {
  let solicitud = listaSolicitudes.find((s) => s.solicitudID === id);

  let estado;
  switch (solicitud.estado) {
    case 0:
      estado = "En espera";
      break;
    case 1:
      estado = "Cancelada"; // Cuando el que solicito se retracta de la solicitud.
      break;
    case 2:
      estado = "Rechazada"; // Cuando el dueño de la publicacion rechaza la solicitud.
      break;
    case 3:
      estado = "Aceptada"; // Cuando es aceptada la solicitud
      break;
    case 4:
      estado = "Cerrada";
      break;
    default:
      break;
  }
  // $("#modalDetalle .modal-title").html(`Detalle de`);
  $("#modalDetalle .modal-body").html(
    `
  <li class="d-flex">
    <i class="me-auto">Publicacion relacionada:</i> <a class="btn p-0 fw-bold" onclick="Vista(${
      solicitud.publicacionID
    })">${solicitud.publicacionTitulo}</a>
  </li>
  <li class="d-flex">
    <i class="me-auto">Dueño de publicacion:</i> <a class="btn p-0 fw-bold" onclick="perfilView(${
      solicitud.usuarioID
    })">${solicitud.userName}</a>
  </li>
  <hr>
  <li class="d-flex">
    <i class="me-auto">Solicitante:</i> <a class="btn p-0 fw-bold" onclick="perfilView(${
      solicitud.usuarioIDSolicitante
    })">${solicitud.userNameSolicitante}</a>
  </li>
  <li class="d-flex">
  <i class="me-auto">Email:</i> <span class="fw-bold">${
    solicitud.emailSolicitante !== null ? solicitud.emailSolicitante : "-"
  }</span>
</li>
  <li class="d-flex">
  <i class="me-auto">Teléfono:</i> <a class="btn p-0 fw-bold">${
    solicitud.phone !== null ? solicitud.phone : "-"
  }</a>
</li>
  
  <li class="d-flex">
    <i class="me-auto">Fecha de Solicitud:</i> <span class="fw-bold">${moment(
      solicitud.fecha,
      "YYYY-MM-DD"
    ).format("DD-MM-YYYY")}</span>
  </li>
  <li class="d-flex">
    <p>Mensaje:
    <span class="fw-bold">"${solicitud.descripcion}"</span> </p>
  </li>
  <hr>
  <li class="d-flex">
    <i class="me-auto">Estado:</i> ${estado}
  </li>
  `
  );
  $("#modalDetalle").modal("show");
  $("#btn-concretar").html("Aceptar solicitud");
  $("#btn-concretar").click(function () {
    actualizarSolicitud(id, 3);
  });
}
