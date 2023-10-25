using AgroServices.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace AgroServices.Models
{
    public class Imagen
    {
        [Key]
        public int ImagenID { get; set; }

        public byte[]? Img { get; set; }

        public int PublicacionID { get; set; }

        [JsonIgnore]
        public virtual Publicacion? Publicaciones { get; set; }

        public string? TipoImagen { get; set; }
        public string? NombreImagen { get; set; }
        public bool Eliminado { get; set; }

        [NotMapped]
        public string? ImagenBase64 { get; set; }
    }
}

public class VistaImagen
    {
        public int ImagenID { get; set; }
        public string? TipoImagen { get; set; }
        public string? ImagenBase64 { get; set; }
    }