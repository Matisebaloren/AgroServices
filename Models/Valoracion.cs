using AgroServices.Models;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Valoracion
    {
        [Key]
        public int ValoracionID { get; set; }

        public string? Contenido { get; set; }

        public int Puntuacion { get; set; }

        [DataType(DataType.Date)]
        public DateTime Fecha { get; set; }

        public int PublicacionID { get; set; }
         [JsonIgnore]
        public virtual Publicacion? Publicaciones { get; set; }

        public int UsuarioID { get; set; }
    }
}

public class VistaValoracion{
    public int ValoracionID { get; set; }

    public string? Contenido { get; set; }

    public int Puntuacion { get; set; }

    [DataType(DataType.Date)]
    public DateTime Fecha { get; set; }

   
    public int PublicacionID { get; set; }

    public int UsuarioID { get; set; }

    public string Username { get; set; }
}