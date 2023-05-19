using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Provincia
    {
        [Key]
        public int ProvinciaID { get; set; }

        public string? Nombre { get; set; }

        public bool Eliminado { get; set; }

        public virtual ICollection<Localidad>? Localidades { get; set; }


    }

}

