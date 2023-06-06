using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Data;
using AgroServices.Models;
using Microsoft.AspNetCore.Mvc.Rendering;

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
        var localidades = _contexto.Localidades.Where(c => c.Eliminado == false).ToList(); 
        ViewBag.LocalidadID = new SelectList(localidades, "LocalidadID", "Nombre");       
        return View();
    }

     // Busca usuarios para la tabla
    public JsonResult BuscarUsuarios(int usuarioID = 0)
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

    public JsonResult GuardarUsuario(int usuarioID, string nombre, string apellido, int localidadID)
    {
        string resultado = "Error";

        //verificamos si Nombre esta completo
        if (!string.IsNullOrEmpty(nombre)){     
                        //SI ES 0 QUIERE DECIR QUE ESTA CREANDO EL ELEMENTO
            if(usuarioID == 0){
                //BUSCAMOS EN LA TABLA SI EXISTE UNA CON LA MISMO NOMBRE
                var usuarioOriginal = _contexto.Usuarios.Where(c => c.Nombre == nombre).FirstOrDefault();
                if(usuarioOriginal == null){
                
                    //DECLARAMOS EL OBJETO DANDO EL VALOR
                    var UsuarioGuardar = new Usuario{
                        Nombre = nombre,
                        Apellido = apellido,
                        LocalidadID = localidadID
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
                        usuarioEditar.UsuarioID = usuarioID;
                        usuarioEditar.Nombre = nombre;
                        usuarioEditar.UsuarioID = usuarioID;
                        usuarioEditar.LocalidadID = localidadID;
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


    public JsonResult Deshabilitar(int usuarioID){
     String resultado = "error";
     var usuario = _contexto.Usuarios.Where(c => c.UsuarioID == usuarioID).FirstOrDefault();
    // var categoriaDeshabilitada = _contexto.Categorias.Where(c => c.Eliminado == true && c.CategoriaID == usuario.Categoria.CategoriaID).Count();
    // var servicios = _contexto.Servicios.Where(s => s.Eliminado == false && s.UsuarioID == usuarioID).Count();
   
        if (usuario.Eliminado == true)
        {
            usuario.Eliminado = false;
            
        }
        else
        {
            usuario.Eliminado = true;
            
        }
        resultado = "cambiar";
            
        _contexto.SaveChanges();
    
     return Json(resultado);
    }
}

