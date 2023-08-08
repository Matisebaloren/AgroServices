
            $(document).ready(function () {
            });
            var table = $('#example').DataTable({
                'paging': true,
                'lengthChange': true,
                'searching': true,
                'ordering': true,
                'info': false,
                'autoWidth': false,
                'stateSave': true,
                'language': {
                    "url": "/public/tabla_lenguaje_es.json"
                }
            });