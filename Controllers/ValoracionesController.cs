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

    // public JsonResult GuardarValoracion(int usuarioID, string contenido)
    // {
    //     string resultado = "Error";
    //     //DECLARAMOS EL OBJETO DANDO EL VALOR
    //     var ValoracionGuardar = new Valoracion
    //     {
    //         id_usuario = usuarioID,
    //         contenido = contenido
    //     };
    //     _contexto.Add(ValoracionGuardar);
    //     _contexto.SaveChanges();
    //     resultado = "Crear";




    //     else
    //     {
    //         resultado = "faltas";
    //     }

    //     return Json(resultado);
    // }

}

