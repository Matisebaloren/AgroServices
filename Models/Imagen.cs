using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models
{
    public class Imagen
    {
      [Key]
        public int ImagenID { get; set; }

        public byte[]? Img_public { get; set; }

        public int UsuarioID { get; set; }

        public virtual Usuario? Usuario { get; set;}

        public bool Eliminado { get; set; }
 
    }
}