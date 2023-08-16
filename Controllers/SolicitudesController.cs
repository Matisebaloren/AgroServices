using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;



// private readonly NombreProyectoContext _context;


namespace AgroServices.Controllers;

public class SolicitudesController : Controller
{
    // private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<SolicitudesController> _logger;
    private AgroServicesDbContext _contexto;



    public SolicitudesController(ILogger<SolicitudesController> logger, AgroServicesDbContext contexto, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _contexto = contexto;
        // _userManager = userManager;
    }

    public JsonResult GuardarSolicitud(int usuarioID, int publicacionID, string contenido)
    {
        string resultado = "Error";
        //DECLARAMOS EL OBJETO DANDO EL VALOR
        var SolicitudGuardar = new Solicitud
        {
            UsuarioID = usuarioID,
            PublicacionID = publicacionID,
            Fecha = DateTime.Now,
            estado = 0
        };
        _contexto.Add(SolicitudGuardar);
        _contexto.SaveChanges();
        resultado = "Crear";

        return Json(resultado);
    }

}
