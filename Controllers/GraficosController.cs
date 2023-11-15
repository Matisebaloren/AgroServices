using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using AgroServices.Models;
using AgroServices.Data;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Components.Forms;
using Microsoft.EntityFrameworkCore;
using AgroServices.Migrations.AgroServicesDb;

namespace AgroServices.Controllers;

public class GraficosController : Controller
{
    private readonly ILogger<GraficosController> _logger;

    private AgroServicesDbContext _contexto;
    private readonly ApplicationDbContext _contextUsuario;
    private readonly UserManager<IdentityUser> _userManager;
    private readonly RoleManager<IdentityRole> _rolManager;

    public GraficosController(ILogger<GraficosController> logger, AgroServicesDbContext contexto, ApplicationDbContext contextUsuario, UserManager<IdentityUser> userManager, RoleManager<IdentityRole> rolManager)
    {
        _logger = logger;
        _contexto = contexto;
        _contextUsuario = contextUsuario;
        _userManager = userManager;
        _rolManager = rolManager;

    }

    public async Task<IActionResult> Index()
    {
        return View();
    }

    public JsonResult BuscarFechaServicios()
    {
        var fechas = new List<object[]>();

        var solicitudes = _contexto.Solicitudes.Select(e => new { anio = e.Fecha.Year, mes = e.Fecha.Month }).ToList();
        var agrupadas = solicitudes.GroupBy(key => key.anio).ToList();

        foreach (var grupo in agrupadas)
        {
            var meses = grupo.Select(g => g.mes).Distinct().OrderBy(m => m).ToArray();
            fechas.Add(new object[] { grupo.Key, meses });
        }
        fechas = fechas.OrderBy(f => (int)f[0]).ToList(); //ordenando por año
        return Json(fechas);
    }


    public JsonResult buscarServiciosActivos()
    {
        var servicios = _contexto.Servicios.Where(s => s.Eliminado != true).Select(s => new { servicioID = s.ServicioID, descripcion = s.descripcion }).ToList();
        return Json(servicios);
    }

    public JsonResult GraficoServicios(int anio = 0, int mes = 0)
    {
        var serviciosMostrar = new Dictionary<int, int>();
        var count = new List<int>();
        var labels = new List<string>();
        var publicacionesIDs = new List<int>();

        if (anio == 0)
        {
            publicacionesIDs = mes == 0
                ? _contexto.Solicitudes.Select(s => s.PublicacionID).ToList()
                : _contexto.Solicitudes.Where(s => s.Fecha.Month == mes).Select(s => s.PublicacionID).ToList();
        }
        else
        {
            publicacionesIDs = mes == 0
                ? _contexto.Solicitudes.Where(s => s.Fecha.Year == anio).Select(s => s.PublicacionID).ToList()
                : _contexto.Solicitudes.Where(s => s.Fecha.Year == anio && s.Fecha.Month == mes).Select(s => s.PublicacionID).ToList();
        }
        var publicaciones = publicacionesIDs.GroupBy(id => id).Select(grupo => new
        {
            PublicacionID = grupo.Key,
            Cantidad = grupo.Count()
        })
                .ToList();
        foreach (var item in publicaciones)
        {
            var serviciosPublicacion = _contexto.Etiquetas.Include(e => e.Servicio).Where(e => e.PublicacionID == item.PublicacionID).Select(e => new { ServicioID = e.ServicioID, Descripcion = e.Servicio.descripcion }).ToList();
            for (int i = 0; i < item.Cantidad; i++)
            {
                foreach (var servicioPublicacion in serviciosPublicacion)
                {
                    // var encontrado = serviciosMostrar.FindIndex(s => (int)s[0] == servicioPublicacion.ServicioID);
                    if (serviciosMostrar.TryGetValue(servicioPublicacion.ServicioID, out var cantidad))
                    {
                        // Si ya existe, incrementar la cantidad
                        serviciosMostrar[servicioPublicacion.ServicioID] = cantidad + 1;
                    }
                    else
                    {
                        // Si no existe, agregar nuevo elemento
                        serviciosMostrar.Add(servicioPublicacion.ServicioID, 1);
                    }
                }
            }
        }
        foreach (var sm in serviciosMostrar)
        {
            labels.Add(_contexto.Servicios.Find(sm.Key)?.descripcion ?? "-");
            count.Add(sm.Value);
        }

        return Json(new { Labels = labels, Count = count });
    }

    public JsonResult GraficoServicioUnico2(int servicioID = 0, int anio = 0)
    {
        if (anio == 0)
        {
            return Json(false);
        }
        var publicacionesIDs = _contexto.Solicitudes
                                .Where(s => s.Fecha.Year == anio)
                                .Select(s => new { PublicacionID = s.PublicacionID, Mes = s.Fecha.Month })
                                .ToList();

        var mesXCantidadMostrar = new Dictionary<int, int>
        {
            { 1, 0 },
            { 2, 0 },
            { 3, 0 },
            { 4, 0 },
            { 5, 0 },
            { 6, 0 },
            { 7, 0 },
            { 8, 0 },
            { 9, 0 },
            { 10, 0 },
            { 11, 0 },
            { 12, 0 }
        };
        foreach (var publicacion in publicacionesIDs)
        {
            var serviciosPublicacion = _contexto.Etiquetas
                                        .Count(e => e.PublicacionID == publicacion.PublicacionID && e.ServicioID == servicioID);
            if (serviciosPublicacion > 0)
            {
                mesXCantidadMostrar[publicacion.Mes]++;
            }
        }

        var labels = mesXCantidadMostrar.Keys.ToList();
        var count = mesXCantidadMostrar.Values.ToList();

        return Json(new { Labels = labels, Count = count });
    }


    public JsonResult GraficoServicioUnico(int servicioID = 0, int anio = 0)
    {
        if (anio == 0)
        {
            return Json(false);
        }
        var publicacionesIDs = _contexto.Etiquetas
                                .Where(s => s.ServicioID == servicioID)
                                .Select(s => s.PublicacionID)
                                .ToList();

        var mesXCantidadMostrar = new Dictionary<int, int>
        {
            { 1, 0 },
            { 2, 0 },
            { 3, 0 },
            { 4, 0 },
            { 5, 0 },
            { 6, 0 },
            { 7, 0 },
            { 8, 0 },
            { 9, 0 },
            { 10, 0 },
            { 11, 0 },
            { 12, 0 }
        };
        foreach (var publicacion in publicacionesIDs)
        {
            var solicitudes = _contexto.Solicitudes.Where(e => e.PublicacionID == publicacion && e.Fecha.Year == anio).Select(s => s.Fecha.Month).ToList();
            foreach (var item in solicitudes)
            {
                mesXCantidadMostrar[item]++;
            } 
        }

        var labels = mesXCantidadMostrar.Keys.ToList();
        var count = mesXCantidadMostrar.Values.ToList();

        return Json(new { Labels = labels, Count = count });
    }
}

