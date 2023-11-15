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
        public int Valorado { get; set; } //0: sin valorar, 1: valorado solo por el participante, 2: valorado solo el dueño de la publi, 3: valorado por dos
    }
}

public class VistaSolicitud
{
    public int SolicitudID { get; set; }
    public string? Descripcion { get; set; }
    [DataType(DataType.Date)]
    public DateTime Fecha { get; set; }
    public int PublicacionID { get; set; }
    public string? PublicacionTitulo { get; set; }
    public int UsuarioID { get; set; }

    public int UsuarioIDSolicitante { get; set; }
    public string? userName { get; set; }
    public string? userNameSolicitante { get; set; }
     public string? emailSolicitante { get; set; }
    public int Estado { get; set; } //0: Creado, 1: Rechazado, 2: Aceptado, 3: Terminado
    public int Valorado { get; set; } //0: sin valorar, 1: valorado solo por el participante, 2: valorado solo el dueño de la publi, 3: valorado por dos
    public string? phone { get; set; } 
}