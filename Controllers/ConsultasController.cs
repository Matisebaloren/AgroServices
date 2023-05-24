using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class ConsultasController : Controller
{
private readonly ILogger<ConsultasController> _logger;
    private AgroServicesDbContext _contexto;

    public ConsultasController(ILogger<ConsultasController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

    // Busca provincias para la tabla
    public JsonResult BuscarConsultas(int consultaID = 0, bool Deshabilitar = false)
    {
        var consultas = _contexto.Consultas.ToList();
        
        if (consultaID > 0)
        {   
            consultas = consultas.Where(p => p.ConsultaID == consultaID).OrderBy(p => p.Nombre).ToList();
        }
        
        _contexto.SaveChanges();
        return Json(consultas);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarConsulta(int consultaID, string nombre)
    {
        string resultado = "Error";

        
        if (!string.IsNullOrEmpty(nombre)){

               
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
                    if(consultaID == 0){
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                        var consultaOriginal = _contexto.Consultas.Where(c => c.Nombre == nombre).FirstOrDefault();
                        if(consultaOriginal == null){
                        
                            //DECLAMOS EL OBJETO DANDO EL VALOR
                            var ConsultaGuardar = new Consulta{
                                Nombre = nombre
                            };
                            _contexto.Add(ConsultaGuardar);
                            _contexto.SaveChanges();
                            resultado = "Crear";

                        }
                        else{
                            resultado = "repetir";
                        }
                    }
                    else{
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
                        var consultaOriginal = _contexto.Consultas.Where(c => c.Nombre == nombre && c.ConsultaID != consultaID).Count();
                        // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                        if(consultaOriginal == 0){
                            //crear variable que guarde el objeto segun el id deseado
                            var consultaEditar = _contexto.Consultas.Find(consultaID);
                            if(consultaEditar != null){
                                consultaEditar.Nombre = nombre;
                                consultaEditar.ConsultaID = consultaID;
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

