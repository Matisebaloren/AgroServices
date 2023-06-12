using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Imagen
    {
      [Key]
        public int ImagenID { get; set; }

        public byte[]? Img_public { get; set; }

        public int PublicacionID { get; set; }

        public virtual Publicacion? Publicaciones { get; set;}

        // public bool Eliminado { get; set; }
 
    }
}