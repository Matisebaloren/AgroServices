using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;


namespace AgroServices.Controllers;

public class PublicacionesController : Controller
{
    private readonly ILogger<PublicacionesController> _logger;
    private AgroServicesDbContext _contexto;

    public PublicacionesController(ILogger<PublicacionesController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Formulario()
    {
        var servicios = _contexto.Servicios.ToList();
        // ViewBag.ServicioID = new SelectList(servicios, "ServicioID", "descripcion");
        return View(servicios);
    }

    public IActionResult VistaPublicacion()
    {
        return View();
    }

    public IActionResult Buscador()
    {
        return View();
    }

    public IActionResult Index()
    {

        return View();
    }


}
