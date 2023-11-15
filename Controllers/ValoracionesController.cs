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

    // public JsonResult GuardarValoracion(int puntuacion, int publicacionID, string contenido)
    // {
        

    //     string resultado = "Error";

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

    //     var solicitud = _contexto.Solicitudes.FirstOrDefault(s => s.PublicacionID == publicacionID && s.UsuarioID == usuario.UsuarioID);
    //     if(solicitud.Valorado == 0){
    //        solicitud.Valorado = 1; 
    //     }
    //     if(solicitud.Valorado == 2){
    //        solicitud.Valorado = 3; 
    //     }
    //     _contexto.SaveChanges();

    //     if(puntuacion >= 0){
    //         return Json("Puntuacion0");
    //     }
    //     //verificamos si Nombre esta completo
    //     if (!string.IsNullOrEmpty(contenido))
    //     {
    //         contenido = contenido.Trim();
    //         //si puntuacion es mayor a 10 se setea a 10
    //         if(puntuacion > 10){
    //             puntuacion = 10;
    //         }
    //         //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
    //         if (publicacionID != 0)
    //         {
    //             //DECLARAMOS EL OBJETO DANDO EL VALOR
    //             var ValoracionGuardar = new Valoracion
    //             {
    //                 Puntuacion = puntuacion,
    //                 Contenido = contenido,
    //                 UsuarioID = usuario.UsuarioID,
    //                 Fecha = DateTime.Now,
    //                 PublicacionID = publicacionID
    //             };
    //             _contexto.Add(ValoracionGuardar);
    //             _contexto.SaveChanges();
    //             resultado = "Crear";
    //         }
    //         else
    //         {
    //             resultado = "sin publicacion";
    //         }
    //     }
    //     else
    //     {
    //         resultado = "faltas";
    //     }
    //     return Json(resultado);
    // }

    public JsonResult GuardarValoracion(int puntuacion, int publicacionID, string contenido)
{
    string resultado = "Error";

    var usuarioIDActual = _userManager.GetUserId(HttpContext.User);

    try
    {
        if (usuarioIDActual == null)
        {
            return Json(new { error = "registrado no encontrado" });
        }

        var usuario = _contexto.Usuarios.FirstOrDefault(u => u.ASP_UserID == usuarioIDActual);

        if (usuario == null)
        {
            return Json(new { error = "Usuario no encontrado" });
        }

        var solicitud = _contexto.Solicitudes.FirstOrDefault(s => s.PublicacionID == publicacionID && s.UsuarioID == usuario.UsuarioID && s.Valorado == 0);
        if(solicitud == null){
            return Json("Nulo");
        }
        if (solicitud.Valorado == 0)
        {
            solicitud.Valorado = 1;
        }

        if (solicitud.Valorado == 2)
        {
            solicitud.Valorado = 3;
        }

        _contexto.SaveChanges();

        if (puntuacion <= 0)
        {
            return Json("Puntuacion0");
        }

        if (!string.IsNullOrEmpty(contenido))
        {
            contenido = contenido.Trim();

            if (puntuacion > 10)
            {
                puntuacion = 10;
            }

            if (publicacionID != 0)
            {
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
    }
    catch (Exception ex)
    {
        resultado = "Error: " + ex.Message;
        // Aquí puedes registrar o manejar la excepción de alguna manera si es necesario.
    }

    return Json(resultado);
}
}

