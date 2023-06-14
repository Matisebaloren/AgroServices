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

        public Tipo_estado estado { get; set; }

        public enum Tipo_estado{
            solicitado = 0,
            aprovado = 1,
            valorado = 2
        }
    }
}