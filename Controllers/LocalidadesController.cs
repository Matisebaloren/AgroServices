using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

namespace AgroServices.Controllers;

public class LocalidadesController : Controller
{
    private readonly ILogger<LocalidadesController> _logger;
    private AgroServicesDbContext _contexto;

    public LocalidadesController(ILogger<LocalidadesController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        var provincias = _contexto.Provincias.Where(c => c.Eliminado == false).ToList(); 
        ViewBag.ProvinciaID = new SelectList(provincias, "ProvinciaID", "descripcion");       
        return View();
    }

     // Busca localidades para la tabla
    public JsonResult BuscarLocalidades(int localidadID = 0)
    {
        var localidades = _contexto.Localidades.ToList();
        
        if (localidadID > 0)
        {   
            localidades = localidades.Where(p => p.LocalidadID == localidadID).OrderBy(p => p.Nombre).ToList();
        }
        
        _contexto.SaveChanges();
        return Json(localidades);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarLocalidad(int localidadID, string nombre, int provinciaID)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(nombre)){     
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if(localidadID == 0){
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                var localidadOriginal = _contexto.Localidades.Where(c => c.Nombre == nombre).FirstOrDefault();
                if(localidadOriginal == null){
                
                    //DECLARAMOS EL OBJETO DANDO EL VALOR
                    var LocalidadGuardar = new Localidad{
                        Nombre = nombre,
                        ProvinciaID = provinciaID
                    };
                    _contexto.Add(LocalidadGuardar);
                    _contexto.SaveChanges();
                    resultado = "Crear";

                }
                else{
                    resultado = "repetir";
                }
            }
            else{
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
                var localidadOriginal = _contexto.Localidades.Where(c => c.Nombre == nombre && c.LocalidadID != localidadID).Count();
                // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                if(localidadOriginal == 0){
                    //crear variable que guarde el objeto segun el id deseado
                    var localidadEditar = _contexto.Localidades.Find(localidadID);
                    if(localidadEditar != null){
                        localidadEditar.Nombre = nombre;
                        localidadEditar.LocalidadID = localidadID;
                        localidadEditar.ProvinciaID = provinciaID;
                        _contexto.SaveChanges();
                        resultado = "Crear";
                    }
                    
                }
                else{
                    resultado = "repetir";
                }
            }                          
        }
        else{
            resultado = "faltas";
        }

        return Json(resultado);
    }


    public JsonResult Deshabilitar(int localidadID){
     String resultado = "error";
     var localidad = _contexto.Localidades.Where(c => c.LocalidadID == localidadID).FirstOrDefault();
    // var categoriaDeshabilitada = _contexto.Categorias.Where(c => c.Eliminado == true && c.CategoriaID == localidad.Categoria.CategoriaID).Count();
    // var servicios = _contexto.Servicios.Where(s => s.Eliminado == false && s.LocalidadID == localidadID).Count();
   
        if (localidad.Eliminado == true)
        {
            localidad.Eliminado = false;
            
        }
        else
        {
            localidad.Eliminado = true;
            
        }
        resultado = "cambiar";
            
        _contexto.SaveChanges();
    
     return Json(resultado);
    }
}
