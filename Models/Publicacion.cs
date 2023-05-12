using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Publicacion
    {
      [Key]
        public int PublicacionID { get; set; }

        public bool ClasificacionOferta { get; set; }

        public int Titulo { get; set; }

        public string? Descripcion { get; set; }

        public int UsuarioID { get; set; }

        public virtual Usuario? Usuarios { get; set;}

         public virtual ICollection<Valoracion>? Valoraciones { get; set; }

         public virtual ICollection<Consulta>? Consultas { get; set; }
 
    }
}