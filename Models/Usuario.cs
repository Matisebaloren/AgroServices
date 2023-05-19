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

        public  string? Telefono { get; set; } //Preguntar si quitarlo

        public string? Email { get; set; }  //Preguntar si quitarlo

        public string? Localidad { get; set; }

        public int LocalidadID { get; set; }

        public virtual Localidad? Localidades { get; set; }

        public virtual ICollection<Publicacion>? Publicaciones { get; set; }
 
    }
}