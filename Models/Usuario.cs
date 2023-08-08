using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models{

    public class Usuario
    {
        [Key]
        public int UsuarioID { get; set; }

        public string? ASP_UserID { get; set; }

        public string? Nombre { get; set; }

        public string? Apellido { get; set; }

        public int LocalidadID { get; set; }

        [DataType(DataType.Date)]
        public DateTime Fecha { get; set; }

        public bool Eliminado { get; set; }

        public virtual Localidad? Localidades { get; set; }

        public virtual ICollection<Publicacion>? Publicaciones { get; set; }
 
    }
}

public class VistaUsuario{

    public int UsuarioID { get; set; }

    public string? Nombre { get; set; }

    public string? Apellido { get; set; }

    public int LocalidadID { get; set; }

    public string LocalidadDescripcion { get; set; }

    [DataType(DataType.Date)]
    public DateTime Fecha { get; set; }

    public int ProvinciaID { get; set; }

    public string ProvinciaDescripcion { get; set; }

    public bool Eliminado { get; set; }

    public string Telefono { get; set; }

    public string? Email { get; set; }

    public string? Username { get; set; }
}