// using System.Diagnostics;
// using Microsoft.AspNetCore.Mvc;
// using AgroServices.Data;
// using AgroServices.Models;
// using Microsoft.AspNetCore.Mvc.Rendering;
// using Microsoft.AspNetCore.Identity;
// using Microsoft.EntityFrameworkCore;

// namespace AgroServices.Controllers;

// public class SolicitudesController : Controller
// {
//     private readonly UserManager<IdentityUser> _userManager;
//     private readonly ILogger<SolicitudesController> _logger;
//     private AgroServicesDbContext _contexto;


//     public SolicitudesController(ILogger<SolicitudesController> logger, AgroServicesDbContext contexto, UserManager<IdentityUser> userManager)
//     {
//         _logger = logger;
//         _contexto = contexto;
//         _userManager = userManager;
//     }

//     public IActionResult Index()
//     {
//         var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
//         if (usuarioIDActual == null)
//         {
//             return RedirectToAction("Index", "Home");
//         }
//         return View();
//     }

//     public JsonResult BuscarSolicitud(int tipo = 0, int visto = 0)
//     {
//         var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
//         if (usuarioIDActual == null)
//         {
//             return Json(new { error = "Usuario no autenticado" });
//         }

//         var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
//         if (usuario == null)
//         {
//             return Json(new { error = "Usuario no encontrado" });
//         }

//         var solicitudes = _contexto.Solicitudes
//             .Where(s => s.UsuarioID == usuario.UsuarioID || s.Publicaciones.UsuarioID == usuario.UsuarioID)
//             .Distinct()
//             .ToList();
//         return Json(new { solicitudes = solicitudes, usuario = usuario });
//     }


//     public JsonResult GuardarSolicitud(int publicacionID, string descripcion)
//     {
//         var publicacion = _contexto.Publicaciones.FirstOrDefault(u => u.PublicacionID == publicacionID);
//         var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
//         if (usuarioIDActual == null)
//         {
//             return Json(false);
//         }
//         var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
//         if (usuario == null)
//         {
//             return Json(new { error = "Usuario no encontrado" });
//         }

//         string resultado = "Error";
//         //DECLARAMOS EL OBJETO DANDO EL VALOR
//         var SolicitudGuardar = new Solicitud
//         {
//             Descripcion = descripcion,
//             UsuarioID = usuario.UsuarioID,
//             PublicacionID = publicacionID,
//             Fecha = DateTime.Now,
//             Estado = 0
//         };
//         _contexto.Add(SolicitudGuardar);
//         _contexto.SaveChanges();
//         resultado = "Crear";
//         return Json(resultado);
//     }

//     public IActionResult Notificaciones()
//     {
//         var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
//         if (usuarioIDActual == null)
//         {
//             return RedirectToAction("Index", "Home");
//         }
//         var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);
//         if (usuario == null)
//         {
//             return RedirectToAction("Index", "Home");
//         }
        
//         var notificaciones = _contexto.Notificaciones.Where(n => n.UsuarioID == usuario.UsuarioID).ToList();
//         return View(notificaciones);
//     }

//     public JsonResult GuardarNotificacion(int usuarioID, int publicacionID, string descripcion, string link)
//     {
//         //DECLARAMOS EL OBJETO DANDO EL VALOR
//         var NotificacionGuardar = new Notificacion
//         {
//             UsuarioID = usuarioID,
//             Link = link,
//             Descripcion = descripcion,
//             Check = false
//         };
//         _contexto.Add(NotificacionGuardar);
//         _contexto.SaveChanges();
//         return Json(true);
//     }
// }
