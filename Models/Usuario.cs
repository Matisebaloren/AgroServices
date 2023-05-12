using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models{

    public class Usuario
    {
        [Key]
        public int UsuarioID { get; set; }

        public string? Nombre { get; set; }

        public string? Apellido { get; set; }

        public int Clasificacion { get; set; }

        public  string? Telefono { get; set; }

        public string? Email { get; set; }

        public string? Localidad { get; set; }

        public int ProvinciaID { get; set; }

        public virtual Provincia? Provincias { get; set; }

        public virtual ICollection<Publicacion>? Publicaciones { get; set; }
 
    }
}