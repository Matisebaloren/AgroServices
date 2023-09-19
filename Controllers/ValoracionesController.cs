using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
// using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;

namespace AgroServices.Controllers;

public class ValoracionesController : Controller
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<ValoracionesController> _logger;
    private AgroServicesDbContext _contexto;

    public ValoracionesController(ILogger<ValoracionesController> logger, AgroServicesDbContext contexto, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult BuscarValoraciones(int publicacionID = 0)
    {
        var valoraciones = _contexto.Valoraciones.Where(p => p.PublicacionID == publicacionID).OrderBy(v => v.Fecha).ToList();
        return Json(valoraciones);
    }

    public JsonResult GuardarValoracion(int puntuacion, int publicacionID, string contenido)
    {
        string resultado = "Error";

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
        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(contenido))
        {
            contenido = contenido.Trim();
            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if (publicacionID != 0)
            {
                //DECLARAMOS EL OBJETO DANDO EL VALOR
                var ValoracionGuardar = new Valoracion
                {
                    Puntuacion = puntuacion,
                    Contenido = contenido,
                    UsuarioID = usuario.UsuarioID,
                    Fecha = DateTime.Now,
                    PublicacionID = publicacionID
                };
                _contexto.Add(ValoracionGuardar);
                _contexto.SaveChanges();
                resultado = "Crear";
            }
            else
            {
                resultado = "sin publicacion";
            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }
}

