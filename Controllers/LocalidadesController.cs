using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

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
        return View();
    }

    // Busca provincias para la tabla
    public JsonResult BuscarLocalidades(int localidadID = 0, bool Deshabilitar = false)
    {
        var localidades = _contexto.Localidades.ToList();
        
        if (localidadID > 0)
        {   
            localidades = localidades.Where(l => l.LocalidadID == localidadID).OrderBy(l => l.Nombre).ToList();
        }
        
        _contexto.SaveChanges();
        return Json(localidades);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarLocalidad(int localidadID, string nombre)
    {
        string resultado = "Error";

        
        if (!string.IsNullOrEmpty(nombre)){

               
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
                    if(localidadID == 0){
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                        var provinciaOriginal = _contexto.Localidades.Where(c => c.Nombre == nombre).FirstOrDefault();
                        if(provinciaOriginal == null){
                        
                            //DECLAMOS EL OBJETO DANDO EL VALOR
                            var LocalidadGuardar = new Localidad{
                                Nombre = nombre
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
