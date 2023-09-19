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
      listaNotificaciones = data.notificaciones; // Almacena todas las solicitudes en la variable
      // usuario = data.usuario;
      console.log(listaNotificaciones);
      mostrarNotificaciones(); // Llama a la función para filtrar y mostrar las solicitudes
    },
    error: function (xhr, status, error) {
      console.error("Error en la solicitud Ajax:");
      console.error("Estado: " + status);
      console.error("Error: " + error);
    },
  });
}


function mostrarNotificaciones() {
  var notificacionesContainer = $("#tablaNotificaciones");
  notificacionesContainer.empty();

  $.each(listaNotificaciones, function (index, notificacion) {
    var link, check;
    if(notificacion.link != null){
      link = `onclick="window.location.href = '${notificacion.link}';"`
    }
    if(notificacion.check == true){
      check = `<i class='bx bx-envelope-open'></i>`
    }
    else{
      check = `<i class='bx bx-envelope'></i>`
    }
    notificacionesContainer.append(`     
        <tr ${link}>
            <td class="px-auto"><h2 class="my-auto">${check}</h2></td>
            <td>${moment(notificacion.fecha).format("DD-MM-YYYY")}</td>
            <td>${notificacion.descripcion}</td>
        </tr>
        
      `);
  });
}
