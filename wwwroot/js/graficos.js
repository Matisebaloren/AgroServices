var fechasServicios = [];
window.onload = function () {
  console.log("inicio");
  buscarFechasServicios();
  buscarServiciosActivos();
};

//segundo grafico
function buscarServiciosActivos() {
  $.ajax({
    url: "../../Graficos/buscarServiciosActivos",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (servicios) {
      console.log(servicios);
      servicios.forEach((servicio) => {
        $("#servicioUnico").append(
          `<option value="${servicio.servicioID}">${servicio.descripcion}</option>`
        );
      });
      actualizarGraphServicioUnico();
    },
  });
}

function actualizarGraphServicioUnico() {
  var anio = $("#anioServicioUnico").val();
  var servicioID = $("#servicioUnico").val();
  $.ajax({
    url: "../../Graficos/GraficoServicioUnico",
    data: { servicioID: servicioID, anio: anio },
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      GraficoServicioUnico(data);
    },
  });
}

function GraficoServicioUnico(data) {
  var nombresMeses = [
    "enero",
    "febrero",
    "marzo",
    "abril",
    "mayo",
    "junio",
    "julio",
    "agosto",
    "septiembre",
    "octubre",
    "noviembre",
    "diciembre",
  ];
  var labelsFinal = [];
  labelsFinal = data.labels.map(function (label) {
    return nombresMeses[label - 1] || "mes-desconocido";
  });
  console.log(labelsFinal);

  const ctx = document.getElementById("GraphServicioUnico");

  if (window.graphServicioUnico) {
    window.graphServicioUnico.destroy();
  }

  window.graphServicioUnico = new Chart(ctx, {
    type: "bar",
    data: {
      labels: labelsFinal,
      datasets: [
        {
          label: "Cantidad de solicitudes",
          data: data.count,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 4,
        },
      ],
    },
    options: {
      scales: {},
    },
  });
}

// primer grafico

function buscarFechasServicios() {
  $.ajax({
    url: "../../Graficos/BuscarFechaServicios",
    data: {},
    type: "GET",
    dataType: "json",
    success: function (fechas) {
      $("#anioServicioUnico").empty();
      fechasServicios = fechas;
      fechas.forEach((fecha) => {
        $("#anioServicio").append(
          `<option value="${fecha[0]}">${fecha[0]}</option>`
        );
        
        $("#anioServicioUnico").append(
          `<option value="${fecha[0]}">${fecha[0]}</option>`
        );
      });
      actualizarMesServicio(0);
    },
  });
}

function actualizarMesServicio(anio = 0) {
  $("#mesServicio").empty();
  $("#mesServicio").append(`<option value="0">Todo el año</option>`);
  if (anio != 0) {
    fechasServicios.forEach((fecha) => {
      if (fecha[0] == anio) {
        console.log("fecha");
        console.log(fecha);
        fecha[1] = fecha[1].sort();
        console.log(fecha);
        fecha[1].forEach((mes) => {
          $("#mesServicio").append(
            `<option value="${mes}">${obtenerNombreMes(mes)}</option>`
          );
        });
      }
    });
  } else {
    var meses = [];
    fechasServicios.forEach((fecha) => {
      fecha[1] = fecha[1].sort();
      fecha[1].forEach((mes) => {
        if (!meses.includes(mes)) {
          meses.push(mes);
          $("#mesServicio").append(
            `<option value="${mes}">${obtenerNombreMes(mes)}</option>`
          );
        }
      });
    });
  }
  buscarDatosServicio();
}

function obtenerNombreMes(numeroMes) {
  const meses = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre",
  ];
  return meses[numeroMes - 1] || "";
}

function buscarDatosServicio() {
  var anio = $("#anioServicio").val();
  var mes = $("#mesServicio").val();
  $.ajax({
    url: "../../Graficos/GraficoServicios",
    data: { anio: anio, mes: mes },
    type: "GET",
    dataType: "json",
    success: function (data) {
      console.log(data);
      GraficoServicios(data);
    },
  });
}

function GraficoServicios(data) {
  const ctx = document.getElementById("GraphServicios");

  if (window.myPieChart) {
    window.myPieChart.destroy();
  }

  window.myPieChart = new Chart(ctx, {
    type: "pie",
    data: {
      labels: data.labels,
      datasets: [
        {
          label: "Cantidad de Solicitudes",
          data: data.count,
          backgroundColor: [
            "rgba(255, 99, 132, 0.2)",
            "rgba(255, 159, 64, 0.2)",
            "rgba(255, 205, 86, 0.2)",
            "rgba(75, 192, 192, 0.2)",
            "rgba(54, 162, 235, 0.2)",
            "rgba(153, 102, 255, 0.2)",
            "rgba(201, 203, 207, 0.2)",
          ],
          borderColor: [
            "rgb(255, 99, 132)",
            "rgb(255, 159, 64)",
            "rgb(255, 205, 86)",
            "rgb(75, 192, 192)",
            "rgb(54, 162, 235)",
            "rgb(153, 102, 255)",
            "rgb(201, 203, 207)",
          ],
          borderWidth: 4,
        },
      ],
    },
    options: {
      scales: {},
    },
  });
}
