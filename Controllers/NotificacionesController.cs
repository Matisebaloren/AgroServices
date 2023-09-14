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

        // var notificaciones = _contexto.Notificaciones.Where(n => n.UsuarioID == usuario.UsuarioID).ToList();
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

        var notificaciones = _contexto.Notificaciones.Where(s => s.UsuarioID == usuario.UsuarioID).OrderBy(s => s.Fecha).ToList();
        return Json(new { notificaciones = notificaciones });
    }

    public JsonResult GuardarNotificacion(int usuarioID, string descripcion, string link)
    {
        //DECLARAMOS EL OBJETO DANDO EL VALOR
        var NotificacionGuardar = new Notificacion
        {
            UsuarioID = usuarioID,
            Link = link,
            Descripcion = descripcion,
            Check = false,
            Fecha = DateTime.Now
            //falta publiID
        };
        _contexto.Add(NotificacionGuardar);
        _contexto.SaveChanges();
        return Json(true);
    }

    public void NotificacionCheck(int notificacionID)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual == null)
        {
            return;
        }

        var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
        if (usuario == null)
        {
            return;

        }

        var notificacion = _contexto.Notificaciones.FirstOrDefault(s => s.NotificacionID == notificacionID);
        if (notificacion != null)
        {
            notificacion.Check = true;
            _contexto.SaveChanges();
        }

    }

    // SOLICITUDES

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


    public JsonResult GuardarSolicitud(int publicacionID, string descripcion)
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
        using (var scope = new TransactionScope())
        {
            try
            {


                // 1. Crear la solicitud
                var SolicitudGuardar = new Solicitud
                {
                    Descripcion = descripcion,
                    UsuarioID = usuario.UsuarioID,
                    PublicacionID = publicacionID,
                    Fecha = DateTime.Now,
                    Estado = 0
                };
                _contexto.Add(SolicitudGuardar);
                _contexto.SaveChanges();

                resultado = "Crear";

                // 2. Crear la notificación relacionada
                GuardarNotificacion(publicacion.UsuarioID, "Nueva solicitud de la publicación " + publicacion.Titulo + ", Por favor, revísala.", "../../Notificaciones/Solicitudes/" + SolicitudGuardar.SolicitudID);
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




    public JsonResult ValidarUsuarios(int solicitudID = 0)
    {
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
        return Json(usuario);
    }

    public JsonResult ModificarSolicitud(int solicitudID, int estadoNuevo)
    {
        // var resultadoValidacion = ValidarUsuarios();
        // if (!(bool)resultadoValidacion.Value)
        // {
        //     return Json(new { error = "Usuario Invalido" }); // Devuelve el resultado de la validación
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
        if (solicitud != null && solicitud.Estado != 1 && solicitud.Estado != 2)
        {
            if (usuario.UsuarioID == solicitud.UsuarioID)
            {
                solicitud.Estado = 1; // Cancelado
            }
            else if (usuario.UsuarioID == solicitud.Publicaciones.UsuarioID)
            {
                if (estadoNuevo == 1)
                {
                    solicitud.Estado = 2; // Rechazado
                }
                else
                {
                    solicitud.Estado = estadoNuevo; // si es 3 se acepta y si es 4 se concreta
                }
            }
            _contexto.SaveChanges();
            return Json(true);
        }
        else
        {
            return Json(new { error = "Solicitud Invalida" });
        }
    }
}
