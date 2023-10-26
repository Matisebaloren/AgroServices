using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;
using MessagePack.Formatters;

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



    // public async Task<IActionResult> BuscarPublicacion(int publicacionID = 0)
    // public JsonResult BuscarPublicacion(int publicacionID = 0)
    // {
    //     var usuarioIDActual = _userManager.GetUserId(HttpContext.User);

    //     if (usuarioIDActual == null)
    //     {
    //         return Json(new { error = "Usuario no registrado" });
    //     }

    //     var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
    //     if (usuario == null)
    //     {
    //         return Json(new { error = "Usuario no inicializado" });
    //     }

    //     var publicacionBD = _contexto.Publicaciones
    //      .Where(p => p.PublicacionID == publicacionID && p.UsuarioID == usuario.UsuarioID)
    //      .FirstOrDefault();
    //     if (publicacionBD == null)
    //     {
    //         return Json(new { error = "Publicación Inválida" });
    //     }

    //     // var imagenes = BuscarImagenes(publicacionID); // Pasa el publicacionID a la función
    //     var etiquetas = _contexto.Etiquetas.Where(x => x.PublicacionID == publicacionID).ToList();
    //     var imagenes = BuscarImagenes(publicacionID);
    //     var resultado = new
    //     {

    //         Publicacion = new
    //         {
    //             PublicacionID = publicacionBD.PublicacionID,
    //             Titulo = publicacionBD.Titulo,
    //             Resumen = publicacionBD.Resumen,
    //             Descripcion = publicacionBD.Descripcion,
    //             EsOferta = publicacionBD.EsOferta
    //         },
    //         Etiquetas = etiquetas,
    //         // Imagenes = imagenes,
    //     };
    //     return Json(resultado);
    // }



    public async Task<IActionResult> VistaPublicacion(int? id = 0)
    {
        var publicacion = _contexto.Publicaciones.Include(p => p.Usuario).Where(p => p.PublicacionID == id).FirstOrDefault();
        // var usuario = _contexto.Usuarios.Where(u => u.UsuarioID == publicacion.UsuarioID).FirstOrDefault();
        if (publicacion != null && publicacion.Usuario != null)
        {
            var userAsp = await _userManager.FindByIdAsync(publicacion.Usuario.ASP_UserID);
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

    public async Task<JsonResult> BuscarPublicaciones2(int publicacionID = 0, int pagina = 1, int elementosPorPagina = 10, int validarUsuario = 0, bool masAntiguas = false, bool verficarValorar = false, int servicioID = 0)
    {
        List<Publicacion> publicaciones;
        var publicacionesMostrar = new List<VistaPublicacion>();
        int totalPublicaciones = 0;
        var skipPaginas = (pagina - 1) * elementosPorPagina;

        //validar usuario registrado
        var usuarioASPID_Actual = _userManager.GetUserId(HttpContext.User);
        var usuarioID_Actual = 0;
        if (usuarioASPID_Actual != null)
        {
            usuarioID_Actual = _contexto.Usuarios.Where(u => u.ASP_UserID == usuarioASPID_Actual).Select(u => u.UsuarioID).FirstOrDefault();
        }


        // si solamente es una publicacion
        if (publicacionID > 0)
        {
            publicaciones = _contexto.Publicaciones.Include(p => p.Usuario).Include(p => p.Valoraciones).Include(p => p.Imagenes).Where(p => p.PublicacionID == publicacionID).ToList();
        }
        else
        {
            // en caso de solo querer las de un usuario
            if (validarUsuario != 0)
            {
                totalPublicaciones = _contexto.Publicaciones.Where(p => p.UsuarioID == validarUsuario).Count();
                publicaciones = _contexto.Publicaciones.Include(p => p.Usuario).Include(p => p.Valoraciones).Include(p => p.Imagenes.Take(1)).Where(p => p.UsuarioID == validarUsuario).Skip(skipPaginas).Take(elementosPorPagina).ToList();
            }
            // en caso de buscar las primeras o ultimas
            else
            {
                totalPublicaciones = _contexto.Publicaciones.Count();
                if (masAntiguas == true)
                {
                    publicaciones = _contexto.Publicaciones.Include(p => p.Usuario).Include(p => p.Valoraciones).Include(p => p.Imagenes.Take(1)).OrderBy(p => p.Fecha).Skip(skipPaginas).Take(elementosPorPagina).ToList();
                }
                else
                {
                    publicaciones = _contexto.Publicaciones.Include(p => p.Usuario).Include(p => p.Valoraciones).Include(p => p.Imagenes.Take(1)).OrderByDescending(p => p.Fecha).Skip(skipPaginas).Take(elementosPorPagina).ToList();
                }
                if (servicioID > 0)
                {
                    var tagsValidos = _contexto.Etiquetas.Where(e => e.ServicioID == servicioID).Select(e => e.PublicacionID).ToList();
                    publicaciones = publicaciones.Where(p => tagsValidos.Contains(p.PublicacionID)).ToList();
                }
            }
        }

        foreach (var publicacion in publicaciones)
        {
            //etiquetas
            var etiquetasMostrar = new List<VistaServicio>();
            var etiquetas = _contexto.Etiquetas.Include(e => e.Servicio).Where(e => e.PublicacionID == publicacion.PublicacionID).GroupBy(e => e.ServicioID).Select(g => g.First()).ToList();
            foreach (var etiqueta in etiquetas)
            {
                var etiquetaMostrar = new VistaServicio
                {
                    ServicioID = etiqueta.ServicioID,
                    ServicioNombre = etiqueta.Servicio.descripcion,
                };
                etiquetasMostrar.Add(etiquetaMostrar);
            }

            //imagenes
            var imagenesMostrar = new List<VistaImagen>();
            foreach (var imagen in publicacion.Imagenes)
            {
                var imagenMostrar = new VistaImagen
                {
                    ImagenID = imagen.ImagenID,
                    ImagenBase64 = System.Convert.ToBase64String(imagen.Img),
                    TipoImagen = imagen.TipoImagen
                };
                imagenesMostrar.Add(imagenMostrar);
            }

            //usuarioASp para buscar el username
            var usuarioASP = await _userManager.FindByIdAsync(publicacion.Usuario.ASP_UserID);

            //valoraciones
            var valoracionPromedio = 0;
            var valoracionCount = 0;
            var valoracionesMostrar = new List<VistaValoracion>();
            if (publicacion.Valoraciones != null && publicacion.Valoraciones.Count() > 0)
            {
                valoracionPromedio = (int)Math.Round((double)publicacion.Valoraciones.Select(v => v.Puntuacion).Sum() / publicacion.Valoraciones.Count());
                valoracionCount = publicacion.Valoraciones.Count();
                foreach (var valoracion in publicacion.Valoraciones)
                {
                    var valoracion_usuario = _contexto.Usuarios.FirstOrDefault(u => u.UsuarioID == valoracion.UsuarioID);
                    var valoracion_usuarioASP = await _userManager.FindByIdAsync(valoracion_usuario.ASP_UserID);
                    var valoracionMostrar = new VistaValoracion
                    {
                        Contenido = valoracion.Contenido,
                        Puntuacion = valoracion.Puntuacion,
                        Fecha = valoracion.Fecha,
                        UsuarioID = valoracion.UsuarioID,
                        Username = valoracion_usuarioASP.UserName
                    };
                    valoracionesMostrar.Add(valoracionMostrar);
                }

            }

            var propia = false;
            if (usuarioID_Actual == publicacion.UsuarioID)
            {
                propia = true;
            }

            //puede valorar si interactuo con la publicacion
            var puedeValorar = false;
            if (verficarValorar == true && usuarioID_Actual != null)
            {
                var solicitudes = _contexto.Solicitudes.Where(s => s.UsuarioID == usuarioID_Actual && s.PublicacionID == publicacion.PublicacionID && s.Estado == 4 && (s.Valorado == 0 || s.Valorado == 2)).Count();
                if (solicitudes > 0)
                {
                    puedeValorar = true;
                }
            }

            var PublicacionMostrar = new VistaPublicacion
            {
                PublicacionID = publicacion.PublicacionID,
                EsOferta = publicacion.EsOferta,
                Titulo = publicacion.Titulo,
                Resumen = publicacion.Resumen,
                Descripcion = publicacion.Descripcion,
                Fecha = publicacion.Fecha,
                UsuarioID = publicacion.UsuarioID,
                UsuarioNombre = usuarioASP.UserName,
                Contador = publicacion.Contador,
                Eliminado = publicacion.Eliminado,
                Servicios = etiquetasMostrar,
                Valoraciones = valoracionesMostrar,
                ValoracionPuntaje = valoracionPromedio,
                ValoracionesCantidad = valoracionCount,
                Imagenes = imagenesMostrar,
                Propia = propia,
                PuedeValorar = puedeValorar,
            };
            publicacionesMostrar.Add(PublicacionMostrar);
        }

        int totalPaginas = (int)Math.Ceiling((double)totalPublicaciones / elementosPorPagina);
        return Json(new
        {
            lista = publicacionesMostrar,
            TotalPaginas = totalPaginas
        });
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
                        _contexto.Etiquetas.Remove(etiquetaEditar);
                        _contexto.SaveChanges();
                        resultado = "eliminar";
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

    public JsonResult GuardarPublicacion(int publicacionID, string titulo, string descripcion, bool esOferta, string resumen)
    {
        // >0: crear   0: editar   -1: faltan rellenar campos  -2: error
        int resultado = -2;
        var usuarioASPID_Actual = _userManager.GetUserId(HttpContext.User);
        var usuarioID_Actual = 0;
        if (usuarioASPID_Actual != null)
        {
            usuarioID_Actual = _contexto.Usuarios.Where(u => u.ASP_UserID == usuarioASPID_Actual).Select(u => u.UsuarioID).FirstOrDefault();
        }
        else { return Json(resultado); }


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
                    UsuarioID = usuarioID_Actual,
                    Resumen = resumen,
                    Fecha = hoy
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
                // Eliminar la imagen de la base de datos
                _contexto.Imagenes.Remove(ImagenEliminar);
                _contexto.SaveChanges();
                resultado = true;
            }
        }
        return Json(resultado);
    }

    public IActionResult Index(int? Id = 0)
    {
        ViewBag.Id = Id;
        return View();
    }

    // public async Task<JsonResult> BuscarValoracionesAsync(int publicacionID = 0)
    // {
    //     List<VistaValoracion> ValoracionesMostrar = new List<VistaValoracion>();
    //     var valoraciones = _contexto.Valoraciones.Where(p => p.PublicacionID == publicacionID).OrderByDescending(v => v.Fecha).ToList();
    //     foreach (var valoracion in valoraciones)
    //     {
    //         var usuario = _contexto.Usuarios.Where(u => u.UsuarioID == valoracion.UsuarioID).FirstOrDefault();
    //         var userAsp = await _userManager.FindByIdAsync(usuario.ASP_UserID);
    //         var ValoracionMostrar = new VistaValoracion
    //         {
    //             Username = userAsp.UserName,
    //             Contenido = valoracion.Contenido,
    //             Fecha = valoracion.Fecha,
    //             Puntuacion = valoracion.Puntuacion
    //         };
    //         ValoracionesMostrar.Add(ValoracionMostrar);
    //     }

    //     return Json(ValoracionesMostrar);
    // }


}
