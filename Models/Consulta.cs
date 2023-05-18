using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Consulta
    {
        [Key]

        public int ConsultaID { get; set; }

        public string? Respuesta { get; set; }

        public string? Contenido { get; set; }

        public int UsuarioID { get; set; }

        public int PublicacionID { get; set; }

        public virtual Publicacion? Publicacion { get; set; }
    }
}