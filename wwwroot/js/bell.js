window.onload = BuscarNotificaciones();
var listaNotificaciones;

const notificationList = document.getElementById("notification-list");

function agregarNotificacion(mensaje, link, id) {
  const li = document.createElement("li");
  li.textContent = mensaje;
  li.onclick = function () {
    check(id);
    window.location.href = link;
  };
  notificationList.appendChild(li);
}

// "../../Notificaciones/Solicitudes/1"

const notificationIcon = document.querySelector(".notification-icon");
const notificationDropdown = document.querySelector(".notification-dropdown");

let isOpen = false;

notificationIcon.addEventListener("click", () => {
  isOpen = !isOpen; // Cambiar el estado de abierto/cerrado

  if (isOpen) {
    notificationDropdown.style.display = "block"; // Abrir la lista
  } else {
    notificationDropdown.style.display = "none"; // Cerrar la lista
  }
});

function BuscarNotificaciones() {
  $.ajax({
    url: "/Notificaciones/BuscarNotificacion",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data.notificaciones);
      var notificaciones = data.notificaciones.filter(function (element) {
        return !element.check; // Filtrar solo las notificaciones con check en false
      });
      notificaciones.forEach((element) => {
        agregarNotificacion(element.descripcion, element.link, element.notificacionID);
      });
      if (notificaciones.length > 0) {
        $("#numNotificacion").html(notificaciones.length);
      }
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud Ajax:");
      console.error("Estado: " + status);
      console.error("Error: " + error);
    },
  });
}

function check(id) {
   $.ajax({
      url: "../../Notificaciones/NotificacionCheck",
      type: "POST",
      data: { notificacionID: id },
      async: true,
      success: function (resultado) {
      },
      cache: false,
      error: function (xhr, status) {
        console.log("Disculpe, existió un problema");
      },
    });
    console.log("check"+id)
}
