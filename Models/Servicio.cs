using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models{

    public class Servicio
    {
        [Key]
        public int ServicioID { get; set; }

        public string? descripcion { get; set; }

        public bool Eliminado { get; set; }
 
    }
}
