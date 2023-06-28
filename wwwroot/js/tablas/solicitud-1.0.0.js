window.onload = BuscarSolicitudes();



function BuscarSolicitudes() {
  console.log("prueba uno");
var usuarioID = $("#usuarioID").val();
  $("#tbody-solicitudes").empty();

  $.ajax({
    url: "../../Solicitudes/BuscarSolicitudes",
    data: {usuarioID : usuarioID},
    type: "GET",
    dataType: "json",
    success: function (solicitudes) {
      console.log(solicitudes);
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert("Error al cargar solicitudes");
    },

    // código a ejecutar sin importar si la petición falló o no
    complete: function (xhr, status) {
      //alert('Petición realizada');
    },
  });
}
