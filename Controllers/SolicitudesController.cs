using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.AspNetCore.Identity;



// private readonly NombreProyectoContext _context;


namespace AgroServices.Controllers;

public class SolicitudesController : Controller
{
    private readonly UserManager<IdentityUser> _userManager;
    private readonly ILogger<SolicitudesController> _logger;
    private AgroServicesDbContext _contexto;



    public SolicitudesController(ILogger<SolicitudesController> logger, AgroServicesDbContext contexto, UserManager<IdentityUser> userManager)
    {
        _logger = logger;
        _contexto = contexto;
        _userManager = userManager;
    }

    public IActionResult Index()
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
        return View();
    }

    // public IActionResult Crear()
    // {
    //     return View();
    // }

    // Busca solicitudes para la tabla
    public JsonResult BuscarSolicitudes(int solicitudID = 0, int usuarioID = 0)
    {
        List<Solicitud> lista_Solicitudes = new List<Solicitud>();
        var solicitudes = _contexto.Solicitudes.ToList();
        // var publicaciones = _contexto.Publicaciones.ToList();

        if (usuarioID > 0)
        {
            // foreach (var item in publicaciones)
            // {
            //     var seleccion = solicitudes.Where(s => s.PublicacionID == item.PublicacionID).FirstOrDefault();
            //     if (seleccion != null)
            //     {
            //         // solicitudes = solicitudes.Where(s => s.PublicacionID != item.PublicacionID).ToList();
            //         lista_Servicios.Add(seleccion);
            //     }
            // }
            // solicitudes = lista_Servicios;
        }
        if (solicitudID > 0)
        {
            solicitudes = solicitudes.Where(p => p.SolicitudID == solicitudID).OrderBy(p => p.Descripcion).ToList();
        }

        _contexto.SaveChanges();
        return Json(solicitudes);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarSolicitud(string descripcion, int usuarioID, int publicacionID, int solicitudID = 0)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(descripcion))
        {
            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if (solicitudID == 0)
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE


                //DECLARAMOS EL OBJETO DANDO EL VALOR
                var SolicitudGuardar = new Solicitud
                {
                    Descripcion = descripcion,
                    PublicacionID = publicacionID,
                    UsuarioID = usuarioID,
                    Fecha = DateTime.Now
                };
                _contexto.Add(SolicitudGuardar);
                _contexto.SaveChanges();
                resultado = "Crear";

            }
            else
            {

                //crear variable que guarde el objeto segun el id deseado
                var solicitudEditar = _contexto.Solicitudes.Find(solicitudID);
                if (solicitudEditar != null)
                {
                    solicitudEditar.Descripcion = descripcion;
                    _contexto.SaveChanges();
                    resultado = "Crear";
                }

            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }


    public JsonResult Deshabilitar(int solicitudID)
    {
        String resultado = "error";
        var solicitud = _contexto.Solicitudes.Where(c => c.SolicitudID == solicitudID).FirstOrDefault();
        // var categoriaDeshabilitada = _contexto.Categorias.Where(c => c.Eliminado == true && c.CategoriaID == solicitud.Categoria.CategoriaID).Count();
        // var solicitudes = _contexto.Solicitudes.Where(s => s.Eliminado == false && s.SolicitudID == solicitudID).Count();

        // if (solicitud.estado == true)
        // {
        //     solicitud.estado = false;

        // }
        // else
        // {
        //     solicitud.estado = true;

        // }
        // resultado = "cambiar";

        _contexto.SaveChanges();

        return Json(resultado);
    }
}
