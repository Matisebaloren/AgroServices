using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models{

    public class Usuario
    {
        [Key]
        public int UsuarioID { get; set; }

        public string? Nombre { get; set; }

        public string? Apellido { get; set; }

        public int LocalidadID { get; set; }

        public bool Eliminado { get; set; }

        public virtual Localidad? Localidades { get; set; }

        public virtual ICollection<Publicacion>? Publicaciones { get; set; }
 
    }
}