﻿// <auto-generated />
using AgroServices.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    [DbContext(typeof(AgroServicesDbContext))]
    [Migration("20230519213921_Añadir-Eliminado-a-Modelos")]
    partial class AñadirEliminadoaModelos
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("AgroServices.Models.Consulta", b =>
                {
                    b.Property<int>("ConsultaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ConsultaID"), 1L, 1);

                    b.Property<string>("Contenido")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<int>("PublicacionID")
                        .HasColumnType("int");

                    b.Property<string>("Respuesta")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("ConsultaID");

                    b.HasIndex("PublicacionID");

                    b.ToTable("Consultas");
                });

            modelBuilder.Entity("AgroServices.Models.Localidad", b =>
                {
                    b.Property<int>("LocalidadID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("LocalidadID"), 1L, 1);

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<string>("Nombre")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("ProvinciaID")
                        .HasColumnType("int");

                    b.HasKey("LocalidadID");

                    b.HasIndex("ProvinciaID");

                    b.ToTable("Localidades");
                });

            modelBuilder.Entity("AgroServices.Models.Provincia", b =>
                {
                    b.Property<int>("ProvinciaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ProvinciaID"), 1L, 1);

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<string>("Nombre")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ProvinciaID");

                    b.ToTable("Provincias");
                });

            modelBuilder.Entity("AgroServices.Models.Publicacion", b =>
                {
                    b.Property<int>("PublicacionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("PublicacionID"), 1L, 1);

                    b.Property<bool>("ClasificacionOferta")
                        .HasColumnType("bit");

                    b.Property<string>("Descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<int>("Titulo")
                        .HasColumnType("int");

                    b.Property<int>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("PublicacionID");

                    b.HasIndex("UsuarioID");

                    b.ToTable("Publicaciones");
                });

            modelBuilder.Entity("AgroServices.Models.Usuario", b =>
                {
                    b.Property<int>("UsuarioID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UsuarioID"), 1L, 1);

                    b.Property<string>("Apellido")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Clasificacion")
                        .HasColumnType("int");

                    b.Property<string>("Email")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Localidad")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("LocalidadID")
                        .HasColumnType("int");

                    b.Property<string>("Nombre")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Telefono")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("UsuarioID");

                    b.HasIndex("LocalidadID");

                    b.ToTable("Usuarios");
                });

            modelBuilder.Entity("AgroServices.Models.Valoracion", b =>
                {
                    b.Property<int>("ValoracionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ValoracionID"), 1L, 1);

                    b.Property<string>("Contenido")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PublicacionID")
                        .HasColumnType("int");

                    b.Property<int>("Puntuacion")
                        .HasColumnType("int");

                    b.Property<int>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("ValoracionID");

                    b.HasIndex("PublicacionID");

                    b.ToTable("Valoraciones");
                });

            modelBuilder.Entity("AgroServices.Models.Consulta", b =>
                {
                    b.HasOne("AgroServices.Models.Publicacion", "Publicacion")
                        .WithMany("Consultas")
                        .HasForeignKey("PublicacionID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Publicacion");
                });

            modelBuilder.Entity("AgroServices.Models.Localidad", b =>
                {
                    b.HasOne("AgroServices.Models.Provincia", "provincias")
                        .WithMany("Localidades")
                        .HasForeignKey("ProvinciaID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("provincias");
                });

            modelBuilder.Entity("AgroServices.Models.Publicacion", b =>
                {
                    b.HasOne("AgroServices.Models.Usuario", "Usuario")
                        .WithMany("Publicaciones")
                        .HasForeignKey("UsuarioID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Usuario");
                });

            modelBuilder.Entity("AgroServices.Models.Usuario", b =>
                {
                    b.HasOne("AgroServices.Models.Localidad", "Localidades")
                        .WithMany("Usuarios")
                        .HasForeignKey("LocalidadID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Localidades");
                });

            modelBuilder.Entity("AgroServices.Models.Valoracion", b =>
                {
                    b.HasOne("AgroServices.Models.Publicacion", "Publicaciones")
                        .WithMany("Valoraciones")
                        .HasForeignKey("PublicacionID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Publicaciones");
                });

            modelBuilder.Entity("AgroServices.Models.Localidad", b =>
                {
                    b.Navigation("Usuarios");
                });

            modelBuilder.Entity("AgroServices.Models.Provincia", b =>
                {
                    b.Navigation("Localidades");
                });

            modelBuilder.Entity("AgroServices.Models.Publicacion", b =>
                {
                    b.Navigation("Consultas");

                    b.Navigation("Valoraciones");
                });

            modelBuilder.Entity("AgroServices.Models.Usuario", b =>
                {
                    b.Navigation("Publicaciones");
                });
#pragma warning restore 612, 618
        }
    }
}
