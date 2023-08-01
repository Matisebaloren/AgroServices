window.onload = BuscarSolicitudes();



function BuscarSolicitudes() {
  console.log("prueba uno");
  var usuarioID = $("#usuarioID").val();
  $("#tbody-solicitudes").empty();
  var list_publicaciones = new Array();

  $.ajax({
    url: "../../Solicitudes/BuscarSolicitudes",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (solicitudes) {
      console.log(solicitudes);
    },
    error: function (xhr, status) {
      alert("Error al cargar solicitudes");
    },
    complete: function (xhr, status) {
      //alert('Petición realizada');
    },
  });

  $.ajax({
    url: "../../Publicaciones/BuscarPublicaciones",
    data: {usuarioID : usuarioID},
    type: "GET",
    dataType: "json",
    success: function (publicaciones) {
      list_publicaciones = publicaciones;
      // console.log(Publicaciones);
    },
    error: function (xhr, status) {
      alert("Error al cargar Publicaciones");
    },
    complete: function (xhr, status) {
      //alert('Petición realizada');
    },
  });

  console.log(list_publicaciones);
}
