window.onload = BuscarPublicaciones();

function BuscarPublicaciones() {
  $("#tbody-publicaciones").empty();

  $.ajax({
    url: "../../Publicaciones/BuscarPublicaciones",
    data: { },
    type: "GET",
    dataType: "json",
    success: function (publicaciones) {
      $("#tbody-publicaciones").empty();
      let item = "";
      var ListaServicios = "";
      $.ajax({
        url: "../../Publicaciones/BuscarServicios",
        data: {},
        type: "GET",
        dataType: "json",
        success: function (servicios) {
          ListaServicios = servicios;
          console.log(ListaServicios);
        },
        error: function (xhr, status) {
          alert("Error al cargar servicios");
        },
      });
      $.each(publicaciones, function (index, publicacion) {
        $.ajax({
          url: "../../Publicaciones/BuscarTagsActivos",
          data: { publicacionID: publicacion.publicacionID },
          type: "GET",
          dataType: "json",
          success: function (tags) {
            let tagstring = "";
            $.each(tags, function (key, tag) {
              let search = ListaServicios.find(
                (s) => s.servicioID == tag.servicioID
              );
              tagstring += " - " + search.descripcion;
              console.log(tagstring);
            });

            $.ajax({
              url: "../../Publicaciones/BuscarImagenes",
              data: { publicacionID: publicacion.publicacionID },
              type: "GET",
              dataType: "json",
              success: function (imagenes) {
                let img = "";
                let col = "";
                if (imagenes.length > 0) {
                  console.log("imagen:" + imagenes);
                  img = `<div class="col-12 col-md-6 itemImg mb-3"><img src="data:${imagenes[0].tipoImagen};base64, ${imagenes[0].imagenBase64}" style="width: 100%; height: 100%;"/></div>`;
                  col = "col-md-6";
                }
                $.each(imagenes, function (key, tag) {
                  console.log(tag);
                });
                console.log(publicacion.publicacionID + tagstring);
                item = `
                    <tr>
                        <td>
                        <a onclick=Vista(${publicacion.publicacionID}) asp-route-id="0" class="row mx-2 itemA">
                        
                        ${img}
                            
                            <div class="col-12 ${col}">
                                <h3>${publicacion.titulo}</h3>
                                <p class="badge bg-primary text-wrap">${tagstring}</p>
                                <p>${publicacion.descripcion}</p>
                            </div>
                        </a>
                        </td>
                    </tr>
                    `;
                $("#tbody-publicaciones").append(`
                            ${item}
                        `);
              },
              error: function (xhr, status) {
                alert("Error al cargar publicaciones");
              },
            });
          },
          error: function (xhr, status) {
            alert("Error al cargar tags");
          },
        });
      });
    },
    error: function (xhr, status) {
      alert("Error al cargar publicaciones");
    },
  });
}

function Vista(publicacionID) {
  console.log(publicacionID);
  window.location.href =
    `../../Publicaciones/VistaPublicacion/` + publicacionID;
}
