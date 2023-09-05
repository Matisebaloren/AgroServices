using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Transactions;



namespace AgroServices.Controllers;

public class NotificacionesController : Controller
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<NotificacionesController> _logger;
    private AgroServicesDbContext _contexto;



    public NotificacionesController(ILogger<NotificacionesController> logger, AgroServicesDbContext contexto, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
    }
    public IActionResult Index()
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

        var notificaciones = _contexto.Notificaciones.Where(n => n.UsuarioID == usuario.UsuarioID).ToList();
        return View();
    }

    public JsonResult BuscarNotificacion(int tipo = 0, int visto = 0)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual == null)
        {
            return Json(new { error = "Usuario no autenticado" });
        }

        var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
        if (usuario == null)
        {
            return Json(new { error = "Usuario no encontrado" });
        }

        var notificaciones = _contexto.Notificaciones.Where(s => s.UsuarioID == usuario.UsuarioID).ToList();
        return Json(new { notificaciones = notificaciones});
    }

    public JsonResult GuardarNotificacion(int usuarioID, int publicacionID, string descripcion, string link)
    {
        //DECLARAMOS EL OBJETO DANDO EL VALOR
        var NotificacionGuardar = new Notificacion
        {
            UsuarioID = usuarioID,
            Link = link,
            Descripcion = descripcion,
            Check = false
        };
        _contexto.Add(NotificacionGuardar);
        _contexto.SaveChanges();
        return Json(true);
    }
    public IActionResult Solicitudes()
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual == null)
        {
            return RedirectToAction("Index", "Home");
        }
        return View();
    }

    public JsonResult BuscarSolicitud(int tipo = 0, int visto = 0)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual == null)
        {
            return Json(new { error = "Usuario no autenticado" });
        }

        var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
        if (usuario == null)
        {
            return Json(new { error = "Usuario no encontrado" });
        }

        var solicitudes = _contexto.Solicitudes.Include(s => s.Publicaciones)
            .Where(s => s.UsuarioID == usuario.UsuarioID || s.Publicaciones.UsuarioID == usuario.UsuarioID)
            .Select(s => new
            {
                s.SolicitudID,
                s.Descripcion,
                s.Estado,
                s.Fecha,
                s.PublicacionID,
                s.UsuarioID,
                PublicacionTitulo = s.Publicaciones.Titulo
            })
            .Distinct()
            .ToList();
        solicitudes = solicitudes.OrderByDescending(s => s.Fecha).ToList();
        return Json(new { solicitudes = solicitudes, usuario = usuario });
    }


    // public JsonResult GuardarSolicitud(int publicacionID, string descripcion)
    // {
    //     var publicacion = _contexto.Publicaciones.FirstOrDefault(u => u.PublicacionID == publicacionID);
    //     var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
    //     if (usuarioIDActual == null)
    //     {
    //         return Json(false);
    //     }
    //     var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
    //     if (usuario == null)
    //     {
    //         return Json(new { error = "Usuario no encontrado" });
    //     }

    //     string resultado = "Error";
    //     //DECLARAMOS EL OBJETO DANDO EL VALOR
    //     var SolicitudGuardar = new Solicitud
    //     {
    //         Descripcion = descripcion,
    //         UsuarioID = usuario.UsuarioID,
    //         PublicacionID = publicacionID,
    //         Fecha = DateTime.Now,
    //         Estado = 0
    //     };
    //     _contexto.Add(SolicitudGuardar);
    //     _contexto.SaveChanges();
    //     resultado = "Crear";
    //     return Json(resultado);
    // }


    public JsonResult GuardarSolicitud(int publicacionID, string descripcion)
    {
        using (var scope = new TransactionScope())
        {
            try
            {
                var publicacion = _contexto.Publicaciones.FirstOrDefault(u => u.PublicacionID == publicacionID);
                var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
                if (usuarioIDActual == null || publicacion == null)
                {
                    return Json(false);
                }
                var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
                if (usuario == null)
                {
                    return Json(new { error = "Usuario no encontrado" });
                }

                string resultado = "Error";

                // 1. Crear la solicitud
                var SolicitudGuardar = new Solicitud
                {
                    Descripcion = descripcion,
                    UsuarioID = publicacion.UsuarioID,
                    PublicacionID = publicacionID,
                    Fecha = DateTime.Now,
                    Estado = 0
                };
                _contexto.Add(SolicitudGuardar);
                _contexto.SaveChanges();

                resultado = "Crear";

                // 2. Crear la notificación relacionada
                var NotificacionGuardar = new Notificacion
                {
                    UsuarioID = 0,
                    Link = "Enlace de la notificación",
                    Descripcion = "Descripción de la notificación",
                    Check = false
                };
                _contexto.Add(NotificacionGuardar);
                _contexto.SaveChanges();

                // 3. Confirmar la transacción
                scope.Complete();

                return Json(resultado);
            }
            catch (Exception ex)
            {
                // Manejar la excepción aquí, registrar errores o mostrar mensajes de error según tus necesidades
                // Realizar un rollback manual de la transacción
                scope.Dispose();

                return Json(new { error = "Error al guardar la solicitud: " + ex.Message });
            }
        }
    }




    // public JsonResult ValidarUsuarios(int solicitudID = 0)
    // {
    //     var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
    //     if (usuarioIDActual == null)
    //     {
    //         return Json(new { error = "registrado no encontrado" });
    //     }
    //     var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
    //     if (usuario == null)
    //     {
    //         return Json(new { error = "Usuario no encontrado" });
    //     }
    //     return Json(true);
    // }

    public JsonResult CancelarSolicitud(int solicitudID)
    {
        // var resultadoValidacion = ValidarUsuarios();
        // if (!(bool)resultadoValidacion.Value)
        // {
        //     return resultadoValidacion; // Devuelve el resultado de la validación
        // }
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual == null)
        {
            return Json(new { error = "registrado no encontrado" });
        }
        var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
        if (usuario == null)
        {
            return Json(new { error = "Usuario no encontrado" });
        }

        var solicitud = _contexto.Solicitudes.Include(s => s.Publicaciones).FirstOrDefault(s => s.SolicitudID == solicitudID);
        if (solicitud != null)
        {
            if (usuario.UsuarioID == solicitud.SolicitudID)
            {
                solicitud.Estado = 1;
            }
            else if (usuario.UsuarioID == solicitud.Publicaciones.UsuarioID)
            {
                solicitud.Estado = 2;
            }
            _contexto.SaveChanges();
            return Json(true);
        }
        else
        {
            return Json(new { error = "Solicitud no encontrada" });
        }
    }
}
