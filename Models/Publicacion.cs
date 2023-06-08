using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Publicacion
    {
      [Key]
        public int PublicacionID { get; set; }

        public bool ClasificacionOferta { get; set; }

        public string? Titulo { get; set; }

        public string? Descripcion { get; set; }
        
        [DataType(DataType.Date)]
        public DateTime Fecha { get; set; }

        public int UsuarioID { get; set; }

        public virtual Usuario? Usuario { get; set;}

        public bool Eliminado { get; set; }

        //imagen

        public virtual ICollection<Valoracion>? Valoraciones { get; set; }

        //  public virtual ICollection<Consulta>? Consultas { get; set; }

        public virtual ICollection<Solicitud>? Solicitudes { get; set; }
 
    }
}