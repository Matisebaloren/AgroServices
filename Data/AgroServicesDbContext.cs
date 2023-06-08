using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using AgroServices.Models;


namespace AgroServices.Data;

public class AgroServicesDbContext : DbContext
{
    public AgroServicesDbContext(DbContextOptions<AgroServicesDbContext> options)
        : base(options)
    {

    }

    public DbSet<Provincia> Provincias { get; set; }

    public DbSet<Usuario> Usuarios { get; set; }

    public DbSet<Publicacion> Publicaciones { get; set; }

    public DbSet<Valoracion> Valoraciones { get; set; }

    public DbSet<Imagen> Imagenes { get; set; }

    public DbSet<Localidad> Localidades { get; set; }

    public DbSet<Solicitud> Solicitudes { get; set; }

    public DbSet<Servicio> Servicios { get; set; }

    public DbSet<Notificacion> Notificaciones { get; set; }



}
