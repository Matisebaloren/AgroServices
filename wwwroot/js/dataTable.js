// new DataTable('#example', {
//     scrollX: true,
//     scrollY: false
// });

$(document).ready(function (){
    var table = $('#example').DataTable({
      'paging': true,
      'lengthChange': true,
      'searching': true,
      'ordering': true,
      'info': false,
      'autoWidth': false,
      'stateSave': true,
      'ajax': {
        'url': '../../Usuarios/BuscarUsuarios',
        'dataSrc': ''
    },
    'columns': [
        { 'data': 'username' },
        { 'data': 'email' },
        { 
            'data': null,
            'render': function (data, type, row) {
                var nombre = row.nombre || '-';
                var apellido = row.apellido || '-';
                return apellido + ' ' + nombre;
            }
        },
        { 
            'data': null,
            'render': function (data, type, row) {
                return row.telefono || '-';
            }
        },
        { 
            'data': null,
            'render': function (data, type, row) {
                var localidad = row.localidadDescripcion || '-';
                var provincia = row.provinciaDescripcion || '-';
                return localidad + ', ' + provincia;
            }
        },
        { 'data': null, 'defaultContent': '<a class="btn btn-eliminar" role="button"></a>' }
    ],
      'language': {
          "url": "/tabla_lenguaje_es.json"
      }         
  });
});
