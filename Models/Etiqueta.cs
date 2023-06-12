using AgroServices.Models;
using System.ComponentModel.DataAnnotations;

namespace AgroServices.Models{

    public class Etiqueta
    {
        [Key]
        public int EtiquetaID { get; set; }

        public int ServicioID { get; set; }

        public int PublicacionID { get; set; }
 
    }
}
