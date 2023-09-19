using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

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

        if (usuarioIDActual == null)
        {
            return RedirectToAction("Index", "Home");
        }

        var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);

        if (usuario == null)
        {
            return RedirectToAction("Index", "Home");
        }

        if (id != 0)
        {
            var publicacion = _contexto.Publicaciones
                .FirstOrDefault(p => p.PublicacionID == id && p.UsuarioID == usuario.UsuarioID);

            if (publicacion == null)
            {
                return RedirectToAction("Index", "Home");
            }

            ViewBag.publicacionID = id;
        }

        return View("Formulario");
    }

    public async Task<IActionResult> BuscarPublicacion(int publicacionID = 0)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);

        if (usuarioIDActual == null)
        {
            return Json(new { error = "Usuario no registrado" });
        }

        var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
        if (usuario == null)
        {
            return Json(new { error = "Usuario no inicializado" });
        }

        var publicacionBD = _contexto.Publicaciones
         .Where(p => p.PublicacionID == publicacionID && p.UsuarioID == usuario.UsuarioID)
         .FirstOrDefault();
        if (publicacionBD == null)
        {
            return Json(new { error = "Publicación Inválida" });
        }

        // var imagenes = BuscarImagenes(publicacionID); // Pasa el publicacionID a la función
        var etiquetas = _contexto.Etiquetas.Where(x => x.PublicacionID == publicacionID).ToList();
        var resultado = new
        {
            Publicacion = new
            {
                PublicacionID = publicacionBD.PublicacionID,
                Titulo = publicacionBD.Titulo,
                Resumen = publicacionBD.Resumen,
                Descripcion = publicacionBD.Descripcion,
                EsOferta = publicacionBD.EsOferta
            },
            Etiquetas = etiquetas
        };
        return Json(resultado);
    }



    public async Task<IActionResult> VistaPublicacion(int? id = 0)
    {
        var publicacion = _contexto.Publicaciones.Where(p => p.PublicacionID == id).FirstOrDefault();
        var usuario = _contexto.Usuarios.Where(u => u.UsuarioID == publicacion.UsuarioID).FirstOrDefault();
        var userAsp = await _userManager.FindByIdAsync(usuario.ASP_UserID);
        ViewBag.username = userAsp.UserName;
        // Comprueba si el usuario esta registrado
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual != null)
        {
            var usuarioAspID = _contexto.Usuarios.Where(u => u.ASP_UserID == usuarioIDActual).FirstOrDefault();
            ViewBag.usuarioID = usuarioAspID.UsuarioID;
        }
        else
        {
            ViewBag.usuarioID = 0;
        }
        ViewBag.publicacion = publicacion;
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
        return Json(imagenes);
    }



    public JsonResult BuscarPublicaciones(int publicacionID = 0, int pagina = 1, int elementosPorPagina = 10, int limite = 0)
    {
        var publicaciones = _contexto.Publicaciones.ToList();
        publicaciones = publicaciones.OrderByDescending(p => p.Fecha).ToList();
        if (publicacionID > 0)
        {
            publicaciones = publicaciones.Where(p => p.PublicacionID == publicacionID).ToList();
            return Json(publicaciones);
        }
        // Calcular los índices para la paginación
        int totalPublicaciones = publicaciones.Count;
        int totalPaginas = (int)Math.Ceiling((double)totalPublicaciones / elementosPorPagina);
        int indiceInicial = (pagina - 1) * elementosPorPagina;

        // Obtener las publicaciones de la página actual
        var publicacionesPagina = publicaciones.Skip(indiceInicial).Take(elementosPorPagina).ToList();

        return Json(new
        {
            lista = publicacionesPagina,
            TotalPaginas = totalPaginas
        });
    }

    // anexar publi, img, tags
    public JsonResult GuardarPublicacion(int publicacionID, string titulo, string descripcion, bool esOferta, int usuarioID, string resumen)
    {
        // >0: crear   0: editar   -1: faltan rellenar campos  -2: error
        int resultado = -2;

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(titulo) || !string.IsNullOrEmpty(descripcion) || !esOferta || !string.IsNullOrEmpty(resumen))
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
                    Fecha = hoy,
                    Resumen = resumen
                };
                _contexto.Add(PublicacionGuardar);
                _contexto.SaveChanges();
                resultado = PublicacionGuardar.PublicacionID;
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
                    publicacionEditar.Resumen = resumen;
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
            var ImagenEliminar = _contexto.Imagenes.Find(ImagenID);
            if (ImagenEliminar != null)
            {
                _contexto.Imagenes.Remove(ImagenEliminar);
                ImagenEliminar.Eliminado = true;
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

    public async Task<JsonResult> BuscarValoracionesAsync(int publicacionID = 0)
    {
        List<VistaValoracion> ValoracionesMostrar = new List<VistaValoracion>();
        var valoraciones = _contexto.Valoraciones.Where(p => p.PublicacionID == publicacionID).OrderByDescending(v => v.Fecha).ToList();
        foreach (var valoracion in valoraciones)
        {
            var usuario = _contexto.Usuarios.Where(u => u.UsuarioID == valoracion.UsuarioID).FirstOrDefault();
            var userAsp = await _userManager.FindByIdAsync(usuario.ASP_UserID);
            var ValoracionMostrar = new VistaValoracion
            {
                Username = userAsp.UserName,
                Contenido = valoracion.Contenido,
                Fecha = valoracion.Fecha,
                Puntuacion = valoracion.Puntuacion
            };
            ValoracionesMostrar.Add(ValoracionMostrar);
        }

        return Json(ValoracionesMostrar);
    }


}
