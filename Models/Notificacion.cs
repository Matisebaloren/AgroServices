using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Notificacion
    {
        [Key]

        public int NotificacionID { get; set; }

        public bool Check { get; set; }

        public string? Descripcion { get; set; }

        public int UsuarioID { get; set; }

        public virtual Usuario? Usuarios { get; set; }

        public bool Eliminado { get; set; }
    }
}