using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
// using Microsoft.AspNet.Identity;
using Microsoft.AspNetCore.Identity;



// private readonly NombreProyectoContext _context;


namespace AgroServices.Controllers;

public class PublicacionesController : Controller
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<PublicacionesController> _logger;
    private AgroServicesDbContext _contexto;

    public PublicacionesController(ILogger<PublicacionesController> logger, AgroServicesDbContext contexto, UserManager<IdentityUser> userManager
    )
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
    }


    public async Task<IActionResult> Formulario(int? id = 0)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual != null)
        {
            var usuarios = _contexto.Usuarios.Where(u => u.ASP_UserID == usuarioIDActual).FirstOrDefault();
            ViewBag.usuarioID = usuarios.UsuarioID;
        }
        else
        {
            ViewBag.usuarioID = 0;
        }
        ViewBag.publicacionID = id;

        var servicios = _contexto.Servicios.Where(x => x.Eliminado == false).ToList();
        var seleccionServicio = new Servicio()
        {
            ServicioID = 0,
            descripcion = "[SELECCIONE UN SERVICIO]",
        };
        servicios.Add(seleccionServicio);
        ViewBag.ServicioID = new SelectList(servicios.OrderBy(p => p.descripcion), "ServicioID", "descripcion", 0);
        return View("Formulario");
    }

    public IActionResult VistaPublicacion(int? id = 0)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual != null)
        {
            var usuarioID = _contexto.Usuarios.Where(u => u.ASP_UserID == usuarioIDActual).FirstOrDefault();
            ViewBag.usuarioID = usuarioID.UsuarioID;
        }
        else
        {
            ViewBag.usuarioID = 0;
        }
        ViewBag.publicacionID = id;
        return View();
    }

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
        var imagenes = _contexto.Imagenes.Where(x => x.PublicacionID == publicacionID && x.Eliminado != true).ToList();
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
        var publicaciones = _contexto.Publicaciones.OrderBy(p => p.Fecha).ToList();

        if (publicacionID > 0)
        {
            publicaciones = publicaciones.Where(p => p.PublicacionID == publicacionID).OrderBy(p => p.Titulo).ToList();
        }
        // foreach (var item in publicaciones)
        // {
        //     var hoy = item.Fecha.ToString("d");
        // }

        _contexto.SaveChanges();
        return Json(publicaciones);
    }


    public JsonResult GuardarPublicacion(int publicacionID, string titulo, string descripcion, bool esOferta, int usuarioID)
    {
        // >0: crear   0: editar   -1: faltan rellenar campos  -2: error
        int resultado = -2;

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

                var recienCreado = _contexto.Publicaciones.OrderByDescending(p => p.PublicacionID).FirstOrDefault();
                if (recienCreado != null)
                {
                    resultado = recienCreado.PublicacionID;
                };
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
                    resultado = 0;
                }
            }
        }
        else
        {
            resultado = -1;
        }

        return Json(resultado);
    }

    public JsonResult GuardarTag(int publicacionID, int servicioID, bool eliminado)
    {
        string resultado = "error";

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
                resultado = "crear";
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
                        resultado = "eliminar";
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

    public async Task<IActionResult> GuardarImagen(int ImagenID, IFormFile imagen, int publicacionID)
    {
        bool resultado = false;
        if (ImagenID == 0)
        {
            if (imagen != null && imagen.Length > 0)
            {
                //SI ES 0 QUIERE DECIR QUE ESTA CREANDO LA CATEGORIA

                //DECLAMOS EL OBJETO DANDO EL VALOR
                var imagenGuardar = new Imagen
                {
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

        }
        else
        {
            //crear variable que guarde el objeto segun el id deseado
            var ImagenEditar = _contexto.Imagenes.Find(ImagenID);
            if (ImagenEditar != null)
            {
                ImagenEditar.Eliminado = true;
                _contexto.SaveChanges();
                resultado = true;
            }
        }
        return Json(resultado);
    }

    public IActionResult Index()
    {
        return View();
    }
}
