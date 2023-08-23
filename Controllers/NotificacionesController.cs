using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;



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
        return View(notificaciones);
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

}
