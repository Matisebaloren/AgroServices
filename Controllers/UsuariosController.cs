using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;

namespace AgroServices.Controllers;

public class UsuariosController : Controller
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<UsuariosController> _logger;
    private AgroServicesDbContext _contexto;

    public UsuariosController(ILogger<UsuariosController> logger, AgroServicesDbContext contexto, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
    }

    public IActionResult Index()
    {
        var localidades = _contexto.Localidades.Where(c => c.Eliminado == false).ToList();
        ViewBag.LocalidadID = new SelectList(localidades, "LocalidadID", "Nombre");
        return View();
    }


    public async Task<IActionResult> Perfil(int? id = 0)
    {
        var usuarioAsp = await _userManager.GetUserAsync(User);
        var usuario = new AgroServices.Models.Usuario();
        if (id == 0)
        {
            if (usuarioAsp == null)
            {
                return View("Perfil");
            }
            usuario = _contexto.Usuarios.Include(s => s.Localidades).Include(s => s.Localidades.provincias).Where(u => u.ASP_UserID == usuarioAsp.Id).FirstOrDefault();
        }
        else
        {
            usuario = _contexto.Usuarios.Include(s => s.Localidades).Include(s => s.Localidades.provincias).Where(u => u.UsuarioID == id).FirstOrDefault();
        }
        if (usuario != null)
        {
            var usuarioAspOther = await _userManager.FindByIdAsync(usuario.ASP_UserID);



            var ageDiff = DateTime.Now - usuario.Fecha;
            var age = "";
            if (ageDiff.TotalDays > 365)
            {
                var years = ageDiff.Days / 365;
                if (years < 2)
                {
                    age = years + " Año";
                }
                else
                {
                    age = years + " Años";
                }
            }
            else
            {
                age = ageDiff.Days + " dias y " + ageDiff.Hours + " horas";
            }

            // pasa la información del usuario a la vista si es necesario
            
            ViewBag.Ubication = usuario.Localidades.Nombre + ", " + usuario.Localidades.provincias.Nombre;
            ViewBag.UserName = usuarioAspOther.UserName;

            ViewBag.Age = age;
            if (usuarioAspOther == usuarioAsp)
            {
                ViewBag.Email = usuarioAspOther.Email;
                ViewBag.PhoneNumber = usuarioAspOther.PhoneNumber;
                ViewBag.PersonalName = usuario.Apellido + " " + usuario.Nombre;
            }

        }



        return View("Perfil");
    }

    /* public IActionResult VistaPublicacion(int? id = 0)
    {
        var usuarioIDActual = _userManager.GetUserId(HttpContext.User);
        if (usuarioIDActual != null)
        {
            var usuarioID = _contexto.Usuarios.Where(u => u.ASP_UserID == usuarioIDActual).FirstOrDefault();
            ViewBag.usuarioID = usuarioID.UsuarioID;
        }
        else
        {
            ViewBag.usuarioID = 0;
        }
        ViewBag.publicacionID = id;
        return View();
    } */
    /* public IActionResult Perfil()
    {
        return View();
    } */

    // Busca usuarios para la tabla
    public async Task<JsonResult> BuscarUsuarios(int usuarioID = 0)
    {
        var allUsers = await _userManager.Users.ToListAsync();
        List<VistaUsuario> UsuariosMostrar = new List<VistaUsuario>();
        var usuarios = _contexto.Usuarios.Include(u => u.Localidades)
            .Include(u => u.Localidades.provincias)
            .ToList();

        if (usuarioID > 0)
        {
            usuarios = usuarios.Where(p => p.UsuarioID == usuarioID).OrderBy(p => p.Nombre).ToList();
        }

        foreach (var usuario in usuarios)
        {
            var user = allUsers.Where(u => u.Id == usuario.ASP_UserID).FirstOrDefault();
            if (user != null)
            {
                var UsuarioMostrar = new VistaUsuario
                {
                    UsuarioID = usuario.UsuarioID,
                    Nombre = usuario.Nombre,
                    Apellido = usuario.Apellido,
                    LocalidadDescripcion = usuario.Localidades.Nombre,
                    LocalidadID = usuario.LocalidadID,
                    ProvinciaDescripcion = usuario.Localidades.provincias.Nombre,
                    Eliminado = usuario.Eliminado,
                    Telefono = user.PhoneNumber,
                    Email = user.Email,
                    Username = user.UserName


                };
                UsuariosMostrar.Add(UsuarioMostrar);
            }

        };

        return Json(UsuariosMostrar);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarUsuario(int usuarioID, string nombre, string apellido, int localidadID)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(nombre))
        {
            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if (usuarioID == 0)
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                var usuarioOriginal = _contexto.Usuarios.Where(c => c.Nombre == nombre).FirstOrDefault();
                if (usuarioOriginal == null)
                {

                    //DECLARAMOS EL OBJETO DANDO EL VALOR
                    var UsuarioGuardar = new Usuario
                    {
                        Nombre = nombre,
                        Apellido = apellido,
                        LocalidadID = localidadID
                    };
                    _contexto.Add(UsuarioGuardar);
                    _contexto.SaveChanges();
                    resultado = "Crear";

                }
                else
                {
                    resultado = "repetir";
                }
            }
            else
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
                var usuarioOriginal = _contexto.Usuarios.Where(c => c.Nombre == nombre && c.UsuarioID != usuarioID).Count();
                // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                if (usuarioOriginal == 0)
                {
                    //crear variable que guarde el objeto segun el id deseado
                    var usuarioEditar = _contexto.Usuarios.Find(usuarioID);
                    if (usuarioEditar != null)
                    {
                        usuarioEditar.Nombre = nombre;
                        usuarioEditar.Apellido = apellido;
                        usuarioEditar.LocalidadID = localidadID;
                        _contexto.SaveChanges();
                        resultado = "Crear";
                    }

                }
                else
                {
                    resultado = "repetir";
                }
            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }


    public JsonResult Deshabilitar(int usuarioID)
    {
        String resultado = "error";
        var usuario = _contexto.Usuarios.Where(c => c.UsuarioID == usuarioID).FirstOrDefault();
        // var categoriaDeshabilitada = _contexto.Categorias.Where(c => c.Eliminado == true && c.CategoriaID == usuario.Categoria.CategoriaID).Count();
        // var servicios = _contexto.Servicios.Where(s => s.Eliminado == false && s.UsuarioID == usuarioID).Count();

        if (usuario.Eliminado == true)
        {
            usuario.Eliminado = false;

        }
        else
        {
            usuario.Eliminado = true;

        }
        resultado = "cambiar";

        _contexto.SaveChanges();

        return Json(resultado);
    }
}

