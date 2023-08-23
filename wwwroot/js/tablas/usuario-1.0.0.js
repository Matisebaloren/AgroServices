window.onload = BuscarUsuarios();

function BuscarUsuarios() {
  console.log("prueba uno");

  $("#tbody-usuarios").empty();

  $.ajax({
    // la URL para la petición
    url: "../../Usuarios/BuscarUsuarios",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: {},
    // especifica si será una petición POST o GET
    type: "GET",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función

    success: function (usuarios) {
      $("#tbody-usuarios").empty();
      let BotonDeshabilitado = "";
      $.each(usuarios, function (index, usuario) {
        if (usuario.eliminado == true) {
          BotonDeshabilitado = `
                    <tr class="table-danger" >
                        <td> ${usuario.username} </td>
                        <td> ${usuario.email} </td>
                        <td> ${usuario.apellido ? usuario.apellido : ''}, ${usuario.nombre ? usuario.nombre : ''}</td>
                        <td> ${usuario.telefono}</td>
                        <td> ${usuario.localidadDescripcion}, ${usuario.provinciaDescripcion}</td>
                        <td class=" text-end">
                            <a class="btn btn-eliminar btn-habilitar" onClick="DeshabilitarUsuario('${usuario.usuarioID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
        } else {
          BotonDeshabilitado = `
                    <tr>
                        <td class=" danger" > ${usuario.username} </td>
                        <td class=" danger" > ${usuario.email} </td>
                        <td class=" danger"> ${usuario.apellido ? usuario.apellido+"," : '----'}${usuario.nombre ? usuario.nombre : ''}</td>
                        <td class=" danger"> ${usuario.telefono ? usuario.telefono : ""}</td>
                        <td class=" danger"> ${usuario.localidadDescripcion}, ${usuario.provinciaDescripcion}</td>
                        
                        <td class=" text-end">
                            <a class="btn btn-eliminar" onClick="DeshabilitarUsuario('${usuario.usuarioID}')" role="button"></a>
                        </td>
                    </tr>
                    `;
// boton editar: <a class="btn btn-eliminar btn-editar" onClick="BuscarUsuario(${usuario.usuarioID})" role="button"></a>

        }
        $("#tbody-usuarios").append(`
                    ${BotonDeshabilitado}
                `);
      });
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert("Error al cargar usuarios");
    },

    // código a ejecutar sin importar si la petición falló o no
    complete: function (xhr, status) {
      //alert('Petición realizada');
    },
  });
}

function VaciarFormulario() {
  $("#Nombre").val("");
  $("#UsuarioID").val(0);
  document.getElementById("tituloModal").innerHTML = "Agregar Usuario";
}

function BuscarUsuario(usuarioID) {
  console.log("buscarUsuario");
  $.ajax({
    // la URL para la petición
    url: "../../Usuarios/BuscarUsuarios",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: { usuarioID: usuarioID },
    // especifica si será una petición POST o GET
    type: "GET",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (usuarios) {
      if (usuarios.length == 1) {
        let usuario = usuarios[0];
        console.log(usuario);
        $("#UsuarioID").val(usuario.usuarioID);
        $("#Nombre").val(usuario.nombre);
        $("#Apellido").val(usuario.apellido);
        // $("#Telefono").val(usuario.telefono);
        $("#LocalidadID").val(usuario.localidadID);
        document.getElementById("tituloModal").innerHTML = "Editar Usuario";
        $("#ModalUsuario").modal("show");
      }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert("Error al cargar servicios");
      document.getElementById("alerta").innerHTML = "Error al cargar usuario";
    },

    // código a ejecutar sin importar si la petición falló o no
    complete: function (xhr, status) {
      console.log("Petición realizada");
    },
  });
}

function GuardarUsuario() {
  //JAVASCRIPT{}
  let usuarioID = $("#UsuarioID").val();
  let nombre = $("#Nombre").val();
  let apellido = $("#Apellido").val();
  // let telefono = $("#Telefono").val();
  let localidadID = $("#LocalidadID").val();
  console.log(nombre + " " + localidadID);
  $.ajax({
    // la URL para la petición
    url: "../../Usuarios/GuardarUsuario",
    // la información a enviar
    // (también es posible utilizar una cadena de datos)
    data: {
      usuarioID: usuarioID,
      localidadID: localidadID,
      nombre: nombre,
      apellido: apellido,
    },
    // especifica si será una petición POST o GET
    type: "POST",
    // el tipo de información que se espera de respuesta
    dataType: "json",
    // código a ejecutar si la petición es satisfactoria;
    // la respuesta es pasada como argumento a la función
    success: function (resultado) {
      console.log(resultado);
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      if (resultado == "faltas") {
        Toast.fire({
          icon: "error",
          title: "Complete todos los campos",
        });
      }
      if (resultado == "repetir") {
        Toast.fire({
          icon: "error",
          title: "El usuario ya existe",
        });
      }
      if (resultado == "Crear") {
        $("#ModalUsuario").modal("hide");
        BuscarUsuarios();
      }
    },

    // código a ejecutar si la petición falla;
    // son pasados como argumentos a la función
    // el objeto de la petición en crudo y código de estatus de la petición
    error: function (xhr, status) {
      alert("Disculpe, existió un problema");
    },
  });
}
