using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Models;
using AgroServices.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Components.Forms;

namespace AgroServices.Controllers;

public class GraficosController : Controller
{
    private readonly ILogger<GraficosController> _logger;

    private AgroServicesDbContext _contexto;
    private readonly ApplicationDbContext _contextUsuario;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public GraficosController(ILogger<GraficosController> logger, AgroServicesDbContext contexto, ApplicationDbContext contextUsuario, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _logger = logger;
        _contexto = contexto;
        _contextUsuario = contextUsuario;
        _userManager = userManager;
        _rolManager = rolManager;

    }

    public async Task<IActionResult> Index()
    {
        return View();
    }

}
