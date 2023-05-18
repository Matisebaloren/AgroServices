using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Localidad
    {
        [Key]
        public int LocalidadID { get; set; }

        public string? Nombre { get; set; }

        public int ProvinciaID { get; set; }

        public virtual Provincia? provincias { get; set; }

        public virtual ICollection<Usuario>? Usuarios { get; set; }

    }

}

