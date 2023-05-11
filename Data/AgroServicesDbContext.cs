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

    // public DbSet<Categoria> Categorias { get; set; }




}
