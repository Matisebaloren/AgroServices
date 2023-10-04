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
          $("#ProvinciaID").append(option);
        }
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar usuarios");
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
          $("#LocalidadID").append(option);
        }
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar usuarios");
    },
    complete: function (xhr, status) {},
  });
}
