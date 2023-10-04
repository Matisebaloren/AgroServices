using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Authorization;


namespace AgroServices.Controllers;


public class ServiciosController : Controller
{
    private readonly ILogger<ServiciosController> _logger;
    private AgroServicesDbContext _contexto;

    public ServiciosController(ILogger<ServiciosController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }
[Authorize(Roles = "Administrador")]
    public IActionResult Index()
    {
        return View();
    }

    // Busca servicios para la tabla
    public JsonResult BuscarServicios(int servicioID = 0)
    {
        var servicios = _contexto.Servicios.ToList();

        if (servicioID > 0)
        {
            servicios = servicios.Where(p => p.ServicioID == servicioID).OrderBy(p => p.descripcion).ToList();
        }

        _contexto.SaveChanges();
        return Json(servicios);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarServicio(int servicioID, string descripcion)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(descripcion))
        {
            descripcion = descripcion.Trim();

            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if (servicioID == 0)
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                var servicioOriginal = _contexto.Servicios.Where(c => c.descripcion == descripcion).FirstOrDefault();
                if (servicioOriginal == null)
                {

                    //DECLARAMOS EL OBJETO DANDO EL VALOR
                    var ServicioGuardar = new Servicio
                    {
                        descripcion = descripcion
                    };
                    _contexto.Add(ServicioGuardar);
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
                var servicioOriginal = _contexto.Servicios.Where(c => c.descripcion == descripcion && c.ServicioID != servicioID).Count();
                // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                if (servicioOriginal == 0)
                {
                    //crear variable que guarde el objeto segun el id deseado
                    var servicioEditar = _contexto.Servicios.Find(servicioID);
                    if (servicioEditar != null)
                    {
                        servicioEditar.descripcion = descripcion;
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


    public JsonResult Deshabilitar(int servicioID)
    {
        String resultado = "error";
        var servicio = _contexto.Servicios.Where(c => c.ServicioID == servicioID).FirstOrDefault();
        // var categoriaDeshabilitada = _contexto.Categorias.Where(c => c.Eliminado == true && c.CategoriaID == servicio.Categoria.CategoriaID).Count();
        // var servicios = _contexto.Servicios.Where(s => s.Eliminado == false && s.ServicioID == servicioID).Count();

        if (servicio.Eliminado == true)
        {
            servicio.Eliminado = false;

        }
        else
        {
            servicio.Eliminado = true;

        }
        resultado = "cambiar";

        _contexto.SaveChanges();

        return Json(resultado);
    }
}

