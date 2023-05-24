using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class ValoracionesController : Controller
{
    private readonly ILogger<ValoracionesController> _logger;
    private AgroServicesDbContext _contexto;

    public ValoracionesController(ILogger<ValoracionesController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

    // Busca provincias para la tabla
    public JsonResult BuscarValoraciones(int valoracionID = 0, bool Deshabilitar = false)
    {
        var valoraciones = _contexto.Valoraciones.ToList();
        
        if (valoracionID > 0)
        {   
            valoraciones = valoraciones.Where(p => p.ValoracionID == valoracionID).OrderBy(p => p.Nombre).ToList();
        }
        
        _contexto.SaveChanges();
        return Json(valoraciones);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarValoracion(int valoracionID, string nombre)
    {
        string resultado = "Error";

        
        if (!string.IsNullOrEmpty(nombre)){

               
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
                    if(valoracionID == 0){
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                        var valoracionOriginal = _contexto.Valoraciones.Where(c => c.Nombre == nombre).FirstOrDefault();
                        if(valoracionOriginal == null){
                        
                            //DECLAMOS EL OBJETO DANDO EL VALOR
                            var ValoracionGuardar = new Valoracion{
                                Nombre = nombre
                            };
                            _contexto.Add(ValoracionGuardar);
                            _contexto.SaveChanges();
                            resultado = "Crear";

                        }
                        else{
                            resultado = "repetir";
                        }
                    }
                    else{
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
                        var valoracionOriginal = _contexto.Valoraciones.Where(c => c.Nombre == nombre && c.ValoracionID != valoracionID).Count();
                        // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                        if(valoracionOriginal == 0){
                            //crear variable que guarde el objeto segun el id deseado
                            var valoracionEditar = _contexto.Valoraciones.Find(valoracionID);
                            if(valoracionEditar != null){
                                valoracionEditar.Nombre = nombre;
                                valoracionEditar.ValoracionID = valoracionID;
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

