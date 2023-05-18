using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class ProvinciasController : Controller
{
    private readonly ILogger<ProvinciasController> _logger;
    private AgroServicesDbContext _contexto;

    public ProvinciasController(ILogger<ProvinciasController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

    public JsonResult BuscarProvincias(int provinciaID = 0, bool Deshabilitar = false)
    {
        var provincias = _contexto.Provincias.ToList();
        
        if (provinciaID > 0)
        {   
            provincias = provincias.Where(c => c.ProvinciaID == provinciaID).OrderBy(c => c.nombre).ToList();
        }
        //Validacion para saber si estamos deshabilitando una provincia 
        
        _contexto.SaveChanges();
        return Json(provincias);
    }
}
