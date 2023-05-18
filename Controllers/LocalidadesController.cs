using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class LocalidadesController : Controller
{
    private readonly ILogger<LocalidadesController> _logger;

    private AgroServicesDbContext _contexto;

    public LocalidadesController(ILogger<LocalidadesController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

}
