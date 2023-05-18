using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class UsuariosController : Controller
{
    private readonly ILogger<UsuariosController> _logger;

    private AgroServicesDbContext _contexto;

    public UsuariosController(ILogger<UsuariosController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

}
