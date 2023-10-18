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

if (notificationIcon) {
  notificationIcon.addEventListener("click", () => {
    isOpen = !isOpen; // Cambiar el estado de abierto/cerrado

    if (isOpen) {
      notificationDropdown.style.display = "block"; // Abrir la lista
    } else {
      notificationDropdown.style.display = "none"; // Cerrar la lista
    }
  });
}

function BuscarNotificaciones() {
  $.ajax({
    url: "/Notificaciones/BuscarNotificacion",
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log("info:" + data.error);
      if (!data.error) {
        var notificaciones = data.notificaciones.filter(function (element) {
          return !element.check; // Filtrar solo las notificaciones con check en false
        });
        notificaciones.forEach((element) => {
          agregarNotificacion(
            element.descripcion,
            element.link,
            element.notificacionID
          );
        });
        if (notificaciones.length > 0) {
          $("#numNotificacion").html(notificaciones.length);
        }
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
    success: function (resultado) {},
    cache: false,
    error: function (xhr, status) {
      console.log("Disculpe, existió un problema");
    },
  });
  console.log("check" + id);
}

var connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
var type = connection.effectiveType;

// Definir los tipos de conexión que consideras "buenos"
var conexionesBuenas = ["4g", "wifi"];

// Si la conexión es buena, activa el video
if (conexionesBuenas.includes(type)) {
  console.log("consexion nice");
  var miVideo = document.getElementById("miVideo");

  miVideo.addEventListener("timeupdate", function () {
    var tiempoRestante = miVideo.duration - miVideo.currentTime;
    var umbral = 3; // 3 segundos antes de que se termine desaparece.
    if (tiempoRestante <= umbral) {
      miVideo.style.opacity = "0";
    }
  });

  miVideo.addEventListener("canplaythrough", function () {
    console.log("El video se ha cargado completamente.");
    // Hacer el video visible con una transición
    miVideo.style.opacity = "1";
    // Reproducir el video
    miVideo.play();
  });

  miVideo.addEventListener("ended", function () {
    // Cuando el video llega al final, restaura la opacidad a 1
    miVideo.style.opacity = "1";
  });
}
