using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
// using Microsoft.AspNet.Identity;


namespace AgroServices.Controllers;

public class PublicacionesController : Controller
{
    private readonly ILogger<PublicacionesController> _logger;
    private AgroServicesDbContext _contexto;

    public PublicacionesController(ILogger<PublicacionesController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Formulario()
    {
        var servicios = _contexto.Servicios.Where(x => x.Eliminado == false).ToList();

        var seleccionServicio = new Servicio()
        {
            ServicioID = 0,
            descripcion = "[SELECCIONE UN SERVICIO]",
        };
        servicios.Add(seleccionServicio);

        ViewBag.ServicioID = new SelectList(servicios.OrderBy(p => p.descripcion), "ServicioID", "descripcion", 0);
        return View();
    }

    public IActionResult VistaPublicacion()
    {
        return View();
    }

    // public IActionResult Buscador()
    // {
    //     return View();
    // }

    public JsonResult BuscarServicios()
    {
        var servicios = _contexto.Servicios.Where(x => x.Eliminado == false).ToList();
        _contexto.SaveChanges();
        return Json(servicios);
    }

    public JsonResult BuscarTagsActivos(int publicacionID)
    {
        var etiquetas = _contexto.Etiquetas.Where(x => x.PublicacionID == publicacionID).ToList();
        _contexto.SaveChanges();
        return Json(etiquetas);
    }

    public JsonResult BuscarImagenes(int publicacionID = 0)
    {
        var imagenes = _contexto.Imagenes.Where(x => x.PublicacionID == publicacionID).ToList();
        foreach (var item in imagenes)
        {
            if (item.Img != null)
            {
                item.ImagenBase64 = System.Convert.ToBase64String(item.Img);
            }
        }
        _contexto.SaveChanges();
        return Json(imagenes);
    }



    public JsonResult BuscarPublicaciones(int publicacionID = 0)
    {
        var publicaciones = _contexto.Publicaciones.ToList();

        if (publicacionID > 0)
        {
            publicaciones = publicaciones.Where(p => p.PublicacionID == publicacionID).OrderBy(p => p.Titulo).ToList();
        }

        _contexto.SaveChanges();
        return Json(publicaciones);
    }


    public JsonResult GuardarPublicacion(int publicacionID, string titulo, string descripcion, bool esOferta, int usuarioID)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(titulo) || !string.IsNullOrEmpty(descripcion) || !esOferta)
        {
            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if (publicacionID == 0)
            {
                var hoy = DateTime.Now;
                //DECLARAMOS EL OBJETO DANDO EL VALOR
                var PublicacionGuardar = new Publicacion
                {
                    Titulo = titulo,
                    Descripcion = descripcion,
                    EsOferta = esOferta,
                    UsuarioID = usuarioID,
                    Fecha = hoy
                };
                _contexto.Add(PublicacionGuardar);

                _contexto.SaveChanges();
                resultado = "Crear";
            }
            else
            {
                //crear variable que guarde el objeto segun el id deseado
                var publicacionEditar = _contexto.Publicaciones.Find(publicacionID);
                if (publicacionEditar != null)
                {
                    publicacionEditar.Titulo = titulo;
                    publicacionEditar.PublicacionID = publicacionID;
                    publicacionEditar.EsOferta = esOferta;
                    publicacionEditar.Descripcion = descripcion;
                    _contexto.SaveChanges();
                    resultado = "crear";
                }
            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }

    public JsonResult GuardarTag(int publicacionID, int servicioID, bool eliminado)
    {
        string resultado = "Error";

        if (publicacionID > 0 || servicioID > 0)
        {
            var tags = _contexto.Etiquetas.Where(x => x.PublicacionID == publicacionID && x.ServicioID == servicioID).ToList();

            //SI ES 0 QUIERE DECIR QUE NO EXISTE EL ELEMENTO
            if (tags.Count == 0 && eliminado == false)
            {
                //DECLARAMOS EL OBJETO DANDO EL VALOR
                var EtiquetaGuardar = new Etiqueta
                {
                    ServicioID = servicioID,
                    PublicacionID = publicacionID,
                    Eliminado = false
                };
                _contexto.Add(EtiquetaGuardar);
                _contexto.SaveChanges();
                resultado = "Crear";
            }
            else
            {
                var etiquetaEditar = _contexto.Etiquetas.Find(tags[0].EtiquetaID);
                if (eliminado == true)
                {
                    if (etiquetaEditar != null)
                    {
                        etiquetaEditar.Eliminado = true;
                        _contexto.SaveChanges();
                        resultado = "editar";
                    }
                }
                else
                {
                    if (etiquetaEditar != null)
                    {
                        etiquetaEditar.Eliminado = false;
                        _contexto.SaveChanges();
                        resultado = "editar";
                    }
                }
            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }

    public JsonResult GuardarImagen(int ImagenID, IFormFile imagen, int publicacionID)
    {
        bool resultado = false;
        if (imagen != null && imagen.Length > 0)
        {
            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO LA CATEGORIA
            if (ImagenID == 0)
            {
                //DECLAMOS EL OBJETO DANDO EL VALOR
                var imagenGuardar = new Imagen {
                    PublicacionID = publicacionID
                };

                byte[] imagenBinaria = null;
                using (var fs1 = imagen.OpenReadStream())
                using (var ms1 = new MemoryStream())
                {
                    fs1.CopyTo(ms1);
                    imagenBinaria = ms1.ToArray();
                }
                imagenGuardar.Img = imagenBinaria;
                imagenGuardar.TipoImagen = imagen.ContentType;
                imagenGuardar.NombreImagen = imagen.FileName;
                


                _contexto.Add(imagenGuardar);
                _contexto.SaveChanges();
                resultado = true;
            }
            else
            {
                //crear variable que guarde el objeto segun el id deseado
                var ImagenEditar = _contexto.Imagenes.Find(ImagenID);
                if (ImagenEditar != null)
                {
                    if (imagen != null && imagen.Length > 0)
                    {
                        byte[] imagenBinaria = null;
                        using (var fs1 = imagen.OpenReadStream())
                        using (var ms1 = new MemoryStream())
                        {
                            fs1.CopyTo(ms1);
                            imagenBinaria = ms1.ToArray();
                        }
                        ImagenEditar.Img = imagenBinaria;
                        ImagenEditar.TipoImagen = imagen.ContentType;
                        ImagenEditar.NombreImagen = imagen.FileName;
                    }
                    _contexto.SaveChanges();
                    resultado = true;
                }
            }
        }

        return Json(resultado);
    }

    public IActionResult Index()
    {
        return View();
    }
}
