using AgroServices.Models;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AgroServices.Models
{
  public class Publicacion
  {
    [Key]
    public int PublicacionID { get; set; }

    public bool EsOferta { get; set; }

    public string? Titulo { get; set; }

    public string? Resumen { get; set; }

    public string? Descripcion { get; set; }

    [DataType(DataType.Date)]
    public DateTime Fecha { get; set; }

    public int UsuarioID { get; set; }

    // cantidad de veces que se valido el servicio
    public int Contador { get; set; }

    public virtual Usuario? Usuario { get; set; }

    public bool Eliminado { get; set; }
    public bool Habilitado { get; set; }


    // [NotMapped]
    // public List<Etiqueta>? Etiquetas { get; set; }
    // [NotMapped]
    // public int Valoracion { get; set; }
    // [NotMapped]
    // public int TotalValoraciones { get; set; }
    public virtual ICollection<Valoracion>? Valoraciones { get; set; }

    public virtual ICollection<Solicitud>? Solicitudes { get; set; }

    public virtual ICollection<Imagen>? Imagenes { get; set; }

  }
}

public class VistaPublicacion
{
  public int PublicacionID { get; set; }
  public bool EsOferta { get; set; }
  public string? Titulo { get; set; }
  public string? Resumen { get; set; }
  public string? Descripcion { get; set; }

  [DataType(DataType.Date)]
  public DateTime Fecha { get; set; }
  public int UsuarioID { get; set; }
  public string? UsuarioNombre { get; set; }
  public int Contador { get; set; } // cantidad de veces que se valido el servicio
  public bool Eliminado { get; set; }
  public bool Propia { get; set; }
  public bool PuedeValorar { get; set; }
  public List<VistaServicio>? Servicios { get; set; }
  public List<VistaValoracion>? Valoraciones { get; set; }
  public int ValoracionPuntaje { get; set; }
  public int ValoracionesCantidad { get; set; }
  public List<VistaImagen>? Imagenes { get; set; }
  public int PuntajeRelevancia { get; set; }
}

