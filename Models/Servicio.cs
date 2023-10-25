using AgroServices.Models;
using System.ComponentModel.DataAnnotations;
using System.Text.Json.Serialization;

namespace AgroServices.Models
{

    public class Servicio
    {
        [Key]
        public int ServicioID { get; set; }

        public string? descripcion { get; set; }

        public bool Eliminado { get; set; }

        [JsonIgnore]
        public virtual ICollection<Etiqueta>? Etiquetas { get; set; }

    }
}

public class VistaServicio
    {
        [Key]
        public int ServicioID { get; set; }
        public string? ServicioNombre { get; set;}
    }