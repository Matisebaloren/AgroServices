using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class ValoracionesController : Controller
{
    private readonly ILogger<ValoracionesController> _logger;

    private AgroServicesDbContext _contexto;

    public ValoracionesController(ILogger<ValoracionesController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

}
