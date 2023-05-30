using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class ConsultasController : Controller
{
private readonly ILogger<ConsultasController> _logger;
    private AgroServicesDbContext _contexto;

    public ConsultasController(ILogger<ConsultasController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

    
}

