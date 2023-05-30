using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;

namespace AgroServices.Controllers;

public class UsuariosController : Controller
{
    private readonly ILogger<UsuariosController> _logger;
    private AgroServicesDbContext _contexto;

    public UsuariosController(ILogger<UsuariosController> logger, AgroServicesDbContext contexto)
    {
        _logger = logger;
        _contexto = contexto;
    }

    public IActionResult Index()
    {
        return View();
    }

    // Busca provincias para la tabla
    public JsonResult BuscarUsuarios(int usuarioID = 0, bool Deshabilitar = false)
    {
        var usuarios = _contexto.Usuarios.ToList();
        
        if (usuarioID > 0)
        {   
            usuarios = usuarios.Where(p => p.UsuarioID == usuarioID).OrderBy(p => p.Nombre).ToList();
        }
        
        _contexto.SaveChanges();
        return Json(usuarios);
    }

    // crea o modifica elemento de la base de datos

    public JsonResult GuardarUsuario(int usuarioID, string nombre)
    {
        string resultado = "Error";

        
        if (!string.IsNullOrEmpty(nombre)){

               
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
                    if(usuarioID == 0){
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                        var usuarioOriginal = _contexto.Usuarios.Where(c => c.Nombre == nombre).FirstOrDefault();
                        if(usuarioOriginal == null){
                        
                            //DECLAMOS EL OBJETO DANDO EL VALOR
                            var UsuarioGuardar = new Usuario{
                                Nombre = nombre
                            };
                            _contexto.Add(UsuarioGuardar);
                            _contexto.SaveChanges();
                            resultado = "Crear";

                        }
                        else{
                            resultado = "repetir";
                        }
                    }
                    else{
                        //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMA DESCRIPCION Y DISTINTO ID DE REGISTRO AL QUE ESTAMOS EDITANDO
                        var usuarioOriginal = _contexto.Usuarios.Where(c => c.Nombre == nombre && c.UsuarioID != usuarioID).Count();
                        // var categoriaIguales = categoriaOriginal.Where(c => c.CategoriaID == categoriaID).Count();
                        if(usuarioOriginal == 0){
                            //crear variable que guarde el objeto segun el id deseado
                            var usuarioEditar = _contexto.Usuarios.Find(usuarioID);
                            if(usuarioEditar != null){
                                usuarioEditar.Nombre = nombre;
                                usuarioEditar.UsuarioID = usuarioID;
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

