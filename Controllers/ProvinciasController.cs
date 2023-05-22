using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

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

    public IActionResult Index()
    {
        return View();
    }

    // Busca provincias para la tabla
    public JsonResult BuscarProvincias(int provinciaID = 0, bool Deshabilitar = false)
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

    public JsonResult GuardarProvincia(int provinciaID, string nombre)
    {
        string resultado = "Error";

        
        if (!string.IsNullOrEmpty(nombre)){

               
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
                    if(provinciaID == 0){
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                        var provinciaOriginal = _contexto.Provincias.Where(c => c.Nombre == nombre).FirstOrDefault();
                        if(provinciaOriginal == null){
                        
                            //DECLAMOS EL OBJETO DANDO EL VALOR
                            var ProvinciaGuardar = new Provincia{
                                Nombre = nombre
                            };
                            _contexto.Add(ProvinciaGuardar);
                            _contexto.SaveChanges();
                            resultado = "Crear";

                        }
                        else{
                            resultado = "repetir";
                        }
                    }
                    else{
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
                        var provinciaOriginal = _contexto.Provincias.Where(c => c.Nombre == nombre && c.ProvinciaID != provinciaID).Count();
                        // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                        if(provinciaOriginal == 0){
                            //crear variable que guarde el objeto segun el id deseado
                            var provinciaEditar = _contexto.Provincias.Find(provinciaID);
                            if(provinciaEditar != null){
                                provinciaEditar.Nombre = nombre;
                                provinciaEditar.ProvinciaID = provinciaID;
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



    // public JsonResult GuardarProvincia(int provinciaID, string descripcion)
    // {
    //     string resultado = "error";

    //     if (!string.IsNullOrEmpty(descripcion)){

               
    //                     //SI ES 0 QUIERE DECIR QUE ESTA CREANDO LA CATEGORIA
    //                 if(provinciaID == 0){
    //                     //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION
    //                     var provinciaOriginal = _contexto.Provincias.Where(c => c.Descripcion == descripcion).FirstOrDefault();
    //                     if(provinciaOriginal == null){
    //                   //DECLAMOS EL OBJETO DANDO EL VALOR
    //                     var provinciaGuardar = new Provincia{
    //                         Descripcion = descripcion
    //                     };
    //                     _contexto.Add(provinciaGuardar);
    //                     _contexto.SaveChanges();
    //                     resultado = "crear";

    //                     }
    //                     else{
    //                        resultado = "repetir";
    //                     }
    //                 }
    //                 else{
    //                     //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
    //                     var provinciaOriginal = _contexto.Provincias.Where(c => c.Descripcion == descripcion && c.ProvinciaID != provinciaID).FirstOrDefault();
    //                     if(provinciaOriginal == null){
    //                         //crear variable que guarde el objeto segun el id deseado
    //                         var provinciaEditar = _contexto.Provincias.Find(provinciaID);
    //                         if(provinciaEditar != null){
    //                             provinciaEditar.Descripcion = descripcion;
    //                             _contexto.SaveChanges();
    //                              resultado = "crear";
    //                         }
    //                     }
    //                     else{
    //                         resultado = "repetir";
    //                     }
    //                 }                          
    //     }
    //     else{
    //         resultado = "faltas";
    //     }


    //     //falta el de eliminar

    //     return Json(resultado);
    // }
}
