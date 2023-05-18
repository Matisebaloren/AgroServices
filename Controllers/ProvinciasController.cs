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

}
