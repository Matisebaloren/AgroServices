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

        [DataType(DataType.Date)]
        public DateTime Fecha { get; set; }

        //para que cuando clickes en la noti te envie a la info relacionada
        public string? Link { get; set; }

        //usuario que causo la notificacion
        public int UsuarioID { get; set; }
    }
}