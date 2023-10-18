var provinciaID = $("#ProvinciaIDGet").length > 0 ? $("#ProvinciaIDGet").val() : null;
var localidadID = $("#LocalidadIDGet").length > 0 ? $("#LocalidadIDGet").val() : null;

window.onload = CargarLugares();
var provinciasList = new Array();
$("#LocalidadID").prop("disabled", true);


function CargarLugares() {
  $.ajax({
    url: "../../Provincias/BuscarProvincias",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (provincias) {
      var optionI = document.createElement("option");
      optionI.value = 0;
      optionI.text = "Primero seleccione una Provincia";
      $("#LocalidadID").append(optionI);
      $.each(provincias, function (index, provincia) {
        if (provincia.eliminado != true) {
          provinciasList.push(provincia);
          let option = document.createElement("option");
          option.value = provincia.provinciaID;
          option.text = provincia.nombre;
          if (provinciaID != null && provincia.provinciaID == provinciaID) {
            option.selected = true;
            CambiarProvincia(provinciaID);
          }

          $("#ProvinciaID").append(option);
        }
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar provincias");
    },
    complete: function (xhr, status) {},
  });
}

function CambiarProvincia(id) {
  console.log("CambiarProvincia");
  $.ajax({
    url: "../../Localidades/BuscarLocalidadesXProvincia",
    data: { provinciaID: id },
    type: "GET",
    dataType: "json",
    success: function (localidades) {
    $("#LocalidadID").empty();
    console.log(localidades);
    if(localidades.length > 0){
        $("#LocalidadID").prop("disabled", false);
    }
    else{
        $("#LocalidadID").prop("disabled", true);
        let option = document.createElement("option");
          option.value = "";
          option.text = "Seleccione Provincia";
          $("#LocalidadID").append(option);
    }
      $.each(localidades, function (index, localidad) {
        console.log(localidad);
        if (localidad.eliminado != true) {
          let option = document.createElement("option");
          option.value = localidad.localidadID;
          option.text = localidad.nombre;

          if (localidadID != null && localidad.localidadID == localidadID) {
            option.selected = true;
          }
          $("#LocalidadID").append(option);
        }
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar localidades");
    },
    complete: function (xhr, status) {},
  });
}
