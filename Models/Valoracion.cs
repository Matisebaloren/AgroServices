using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Valoracion
    {
        [Key]
        public int ValoracionID { get; set; }

        public string? Contenido { get; set; }

        public int Puntuacion { get; set; }

        public int PublicacionID { get; set; }

        public virtual Publicacion? Publicaciones { get; set; }

        public int UsuarioID { get; set; }
    }
}