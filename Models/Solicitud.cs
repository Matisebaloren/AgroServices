using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Solicitud
    {
        [Key]
        public int SolicitudID { get; set; }

        // public string? Email { get; set; }

        public string? Descripcion { get; set; }

        [DataType(DataType.Date)]
        public DateTime Fecha { get; set; }

        public int PublicacionID { get; set; }

        public virtual Publicacion? Publicaciones { get; set; }

        public int UsuarioID { get; set; }

        public int Estado { get; set; } //0: Creado, 1: Rechazado, 2: Aceptado, 3: Terminado
    }
}