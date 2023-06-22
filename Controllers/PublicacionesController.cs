using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;
// using Microsoft.AspNet.Identity;


namespace AgroServices.Controllers;

public class PublicacionesController : Controller
{
    private readonly ILogger<PublicacionesController> _logger;
    private AgroServicesDbContext _contexto;

    public PublicacionesController(ILogger<PublicacionesController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Formulario()
    {
        var servicios = _contexto.Servicios.Where(x => x.Eliminado == false).ToList();

        var seleccionServicio = new Servicio()
        {
            ServicioID = 0,
            descripcion = "[SELECCIONE UN SERVICIO]",
        };
        servicios.Add(seleccionServicio);

        ViewBag.ServicioID = new SelectList(servicios.OrderBy(p => p.descripcion), "ServicioID", "descripcion", 0);
        return View();
    }

    public IActionResult VistaPublicacion()
    {
        return View();
    }

    // public IActionResult Buscador()
    // {
    //     return View();
    // }

    public JsonResult BuscarServicios()
    {
        var servicios = _contexto.Servicios.Where(x => x.Eliminado == false).ToList();

        _contexto.SaveChanges();
        return Json(servicios);
    }

    public JsonResult BuscarPublicaciones(int publicacionID = 0)
    {
        var publicaciones = _contexto.Publicaciones.ToList();

        if (publicacionID > 0)
        {
            publicaciones = publicaciones.Where(p => p.PublicacionID == publicacionID).OrderBy(p => p.Titulo).ToList();
        }

        _contexto.SaveChanges();
        return Json(publicaciones);
    }

    public JsonResult GuardarPublicacion(int publicacionID, string titulo, string descripcion, bool esOferta, int usuarioID)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(titulo) || !string.IsNullOrEmpty(descripcion) || !esOferta)
        {
            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if (publicacionID == 0)
            {
                var hoy = DateTime.Now;
                //DECLARAMOS EL OBJETO DANDO EL VALOR
                var PublicacionGuardar = new Publicacion
                {
                    Titulo = titulo,
                    Descripcion = descripcion,
                    EsOferta = esOferta,
                    UsuarioID = usuarioID,
                    Fecha = hoy
                };
                _contexto.Add(PublicacionGuardar);

                _contexto.SaveChanges();
                resultado = "Crear";
            }
            else
            {
                //crear variable que guarde el objeto segun el id deseado
                var publicacionEditar = _contexto.Publicaciones.Find(publicacionID);
                if (publicacionEditar != null)
                {
                    publicacionEditar.Titulo = titulo;
                    publicacionEditar.PublicacionID = publicacionID;
                    publicacionEditar.EsOferta = esOferta;
                    publicacionEditar.Descripcion = descripcion;
                    _contexto.SaveChanges();
                    resultado = "crear";
                }
            }
        }
        else
        {
            resultado = "faltas";
        }

        return Json(resultado);
    }

    public IActionResult Index()
    {
        return View();
    }
}
