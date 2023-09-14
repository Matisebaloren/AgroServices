using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Models;
using AgroServices.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Components.Forms;

namespace AgroServices.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<HomeController> _logger;

    private AgroServicesDbContext _contexto;
    private readonly ApplicationDbContext _contextUsuario;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public HomeController(ILogger<HomeController> logger, AgroServicesDbContext contexto, ApplicationDbContext contextUsuario, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _logger = logger;
        _contexto = contexto;
        _contextUsuario = contextUsuario;
        _userManager = userManager;
        _rolManager = rolManager;

    }

    public async Task<IActionResult> Index()
    {
        await InicializarPermisosUsuario();
        return View();
    }

    public async Task<JsonResult> InicializarPermisosUsuario()
    {
        //CREAR ROLES SI NO EXISTEN
        var adminExiste = _contextUsuario.Roles.Where(r => r.Name == "Administrador").SingleOrDefault();
        if (adminExiste == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("Administrador"));
        }

        var usuarioExiste = _contextUsuario.Roles.Where(r => r.Name == "usuarioComun").SingleOrDefault();
        if (usuarioExiste == null)
        {
            var roleResult = await _rolManager.CreateAsync(new IdentityRole("usuarioComun"));
        }
        //CREAR USUARIO PRINCIPAL
        bool creado = false;
        //BUSCAR POR MEDIO DE CORREO ELECTRONICO SI EXISTE EL USUARIO
        var administrador = _contextUsuario.Users.Where(u => u.Email == "administrador@administrador.com").FirstOrDefault();
        if (administrador == null)
        {
            var user = new IdentityUser { UserName = "AgroAdmin", Email = "administrador@administrador.com" };
            var result = await _userManager.CreateAsync(user, "password");

            //CON ESE USUARIO QUE TERMINA DE CREAR, LE ASIGNAMOS EL ROL CORRESPONDIENTE
            await _userManager.AddToRoleAsync(user, "Administrador");
            creado = result.Succeeded;
        }
        administrador = _contextUsuario.Users.Where(u => u.Email == "administrador@administrador.com").FirstOrDefault();
        if (administrador != null)
        {
            var administradorUsuario = _contexto.Usuarios.Where(u => u.ASP_UserID == administrador.Id).FirstOrDefault();
            if (administradorUsuario == null)
            {
                var UsuarioGuardar = new Usuario
                {
                    ASP_UserID = administrador.Id,
                    LocalidadID = 1,
                    Fecha = DateTime.Now
                };
                _contexto.Add(UsuarioGuardar);
                _contexto.SaveChanges();
            }


        }

        // //CODIGO PARA BUSCAR EL USUARIO EN CASO DE NECESITARLO
        // var superusuario = _contextUsuario.Users.Where(r => r.Email == "usuario@sistema.com").SingleOrDefault();
        // if (superusuario != null)
        // {

        //     //var personaSuperusuario = _contexto.Personas.Where(r => r.UsuarioID == superusuario.Id).Count();

        //     var usuarioID = superusuario.Id;

        // }

        return Json(creado);
    }


    public IActionResult Privacy()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }


}
