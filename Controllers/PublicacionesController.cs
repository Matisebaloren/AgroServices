using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

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

    public IActionResult Index()
    {
        return View();
    }

    // Busca provincias para la tabla
    public JsonResult BuscarPublicaciones(int publicacionID = 0, bool Deshabilitar = false)
    {
        var publicaciones = _contexto.Publicaciones.ToList();
        
        if (publicacionID > 0)
        {   
            publicaciones = publicaciones.Where(p => p.PublicacionID == publicacionID).OrderBy(p => p.Nombre).ToList();
        }
        
        _contexto.SaveChanges();
        return Json(publicaciones);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarPublicacion(int publicacionID, string titulo, string descripcion, int usuarioID, bool clasificacionoferta )
    {
        string resultado = "Error";

        
        if (!string.IsNullOrEmpty(titulo && descripcion && usuarioID && clasificacionoferta)){

               
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
                    if(publicacionID == 0){
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                        // var publicacionOriginal = _contexto.Publicaciones.Where(c => c.Nombre == nombre).FirstOrDefault();
                        // if(publicacionOriginal == null){
                        
                            //DECLAMOS EL OBJETO DANDO EL VALOR
                            var PublicacionesGuardar = new Publicacion{
                                Titulo = titulo, 
                                Descripcion = descripcion,
                                UsuarioID = usuarioID,
                                ClasificacionOferta = clasificacionoferta
                            };
                            _contexto.Add(PublicacionesGuardar);
                            _contexto.SaveChanges();
                            resultado = "Crear";

                        // }
                        // else{
                        //     resultado = "repetir";
                        // }
                    }
                    else{
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
                        var publicacionOriginal = _contexto.Publicaciones.Where(c => c.Nombre == nombre && c.PublicacionID != publicacionID).Count();
                        // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                        if(publicacionOriginal == 0){
                            //crear variable que guarde el objeto segun el id deseado
                            var publicacionEditar = _contexto.Publicaciones.Find(publicacionID);
                            if(publicacionEditar != null){
                                publicacionEditar.Nombre = nombre;
                                publicacionEditar.PublicacionID = publicacionID;
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
