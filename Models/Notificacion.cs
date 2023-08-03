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

        // public string? Link { get; set; }

        //para que cuando clickes en la noti te envie a la publicación
        public int PublicacionID { get; set; }

        //usuario que causo la notificacion
        public int UsuarioID { get; set; }

        public bool Eliminado { get; set; }
    }
}