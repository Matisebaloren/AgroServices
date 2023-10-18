using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Authorization;


namespace AgroServices.Controllers;


public class ProvinciasController : Controller
{
    private readonly ILogger<ProvinciasController> _logger;
    private AgroServicesDbContext _contexto;

    public ProvinciasController(ILogger<ProvinciasController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    [Authorize(Roles = "Administrador")]
    public IActionResult Index()
    {
        return View();
    }

    // Busca provincias para la tabla
    public JsonResult BuscarProvincias(int provinciaID = 0)
    {
        var provincias = _contexto.Provincias.ToList();

        if (provinciaID > 0)
        {
            provincias = provincias.Where(p => p.ProvinciaID == provinciaID).OrderBy(p => p.Nombre).ToList();
        }

        _contexto.SaveChanges();
        return Json(provincias);
    }

    // crea o modifica elemento de la base de datos
    [Authorize(Roles = "Administrador")]
    public JsonResult GuardarProvincia(int provinciaID, string nombre)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(nombre))
        {
            nombre = nombre.Trim();          
            //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if (provinciaID == 0)
            {
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                var provinciaOriginal = _contexto.Provincias.Where(c => c.Nombre == nombre).FirstOrDefault();
                if (provinciaOriginal == null)
                {

                    //DECLARAMOS EL OBJETO DANDO EL VALOR
                    var ProvinciaGuardar = new Provincia
                    {
                        Nombre = nombre
                    };
                    _contexto.Add(ProvinciaGuardar);
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
                var provinciaOriginal = _contexto.Provincias.Where(c => c.Nombre == nombre && c.ProvinciaID != provinciaID).Count();
                // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                if (provinciaOriginal == 0)
                {
                    //crear variable que guarde el objeto segun el id deseado
                    var provinciaEditar = _contexto.Provincias.Find(provinciaID);
                    if (provinciaEditar != null)
                    {
                        provinciaEditar.Nombre = nombre;
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

    [Authorize(Roles = "Administrador")]
    public JsonResult Deshabilitar(int provinciaID)
    {
        String resultado = "error";
        var provincia = _contexto.Provincias.Where(c => c.ProvinciaID == provinciaID).FirstOrDefault();
        // var categoriaDeshabilitada = _contexto.Categorias.Where(c => c.Eliminado == true && c.CategoriaID == provincia.Categoria.CategoriaID).Count();
        // var servicios = _contexto.Servicios.Where(s => s.Eliminado == false && s.ProvinciaID == provinciaID).Count();

        if (provincia.Eliminado == true)
        {
            provincia.Eliminado = false;

        }
        else
        {
            provincia.Eliminado = true;

        }
        resultado = "cambiar";

        _contexto.SaveChanges();

        return Json(resultado);
    }
}
