﻿// <auto-generated />
using System;
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
    [Migration("20231022081342_PublicacionesEtiquetas")]
    partial class PublicacionesEtiquetas
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.16")
                .HasAnnotation("Relational:MaxIdentifierLength", 128);

            SqlServerModelBuilderExtensions.UseIdentityColumns(modelBuilder, 1L, 1);

            modelBuilder.Entity("AgroServices.Models.Etiqueta", b =>
                {
                    b.Property<int>("EtiquetaID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("EtiquetaID"), 1L, 1);

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<int>("PublicacionID")
                        .HasColumnType("int");

                    b.Property<int>("ServicioID")
                        .HasColumnType("int");

                    b.HasKey("EtiquetaID");

                    b.HasIndex("ServicioID");

                    b.ToTable("Etiquetas");
                });

            modelBuilder.Entity("AgroServices.Models.Imagen", b =>
                {
                    b.Property<int>("ImagenID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ImagenID"), 1L, 1);

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<byte[]>("Img")
                        .HasColumnType("varbinary(max)");

                    b.Property<string>("NombreImagen")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("PublicacionID")
                        .HasColumnType("int");

                    b.Property<string>("TipoImagen")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ImagenID");

                    b.HasIndex("PublicacionID");

                    b.ToTable("Imagenes");
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

            modelBuilder.Entity("AgroServices.Models.Notificacion", b =>
                {
                    b.Property<int>("NotificacionID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("NotificacionID"), 1L, 1);

                    b.Property<bool>("Check")
                        .HasColumnType("bit");

                    b.Property<string>("Descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<string>("Link")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("NotificacionID");

                    b.ToTable("Notificaciones");
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

                    b.Property<int>("Contador")
                        .HasColumnType("int");

                    b.Property<string>("Descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<bool>("EsOferta")
                        .HasColumnType("bit");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<string>("Resumen")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Titulo")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("PublicacionID");

                    b.HasIndex("UsuarioID");

                    b.ToTable("Publicaciones");
                });

            modelBuilder.Entity("AgroServices.Models.Servicio", b =>
                {
                    b.Property<int>("ServicioID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("ServicioID"), 1L, 1);

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<string>("descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.HasKey("ServicioID");

                    b.ToTable("Servicios");
                });

            modelBuilder.Entity("AgroServices.Models.Solicitud", b =>
                {
                    b.Property<int>("SolicitudID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("SolicitudID"), 1L, 1);

                    b.Property<string>("Descripcion")
                        .HasColumnType("nvarchar(max)");

                    b.Property<int>("Estado")
                        .HasColumnType("int");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<int>("PublicacionID")
                        .HasColumnType("int");

                    b.Property<int>("UsuarioID")
                        .HasColumnType("int");

                    b.HasKey("SolicitudID");

                    b.HasIndex("PublicacionID");

                    b.ToTable("Solicitudes");
                });

            modelBuilder.Entity("AgroServices.Models.Usuario", b =>
                {
                    b.Property<int>("UsuarioID")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    SqlServerPropertyBuilderExtensions.UseIdentityColumn(b.Property<int>("UsuarioID"), 1L, 1);

                    b.Property<string>("ASP_UserID")
                        .HasColumnType("nvarchar(max)");

                    b.Property<string>("Apellido")
                        .HasColumnType("nvarchar(max)");

                    b.Property<bool>("Eliminado")
                        .HasColumnType("bit");

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

                    b.Property<int>("LocalidadID")
                        .HasColumnType("int");

                    b.Property<string>("Nombre")
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

                    b.Property<DateTime>("Fecha")
                        .HasColumnType("datetime2");

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

            modelBuilder.Entity("AgroServices.Models.Etiqueta", b =>
                {
                    b.HasOne("AgroServices.Models.Servicio", "Servicio")
                        .WithMany("Etiquetas")
                        .HasForeignKey("ServicioID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Servicio");
                });

            modelBuilder.Entity("AgroServices.Models.Imagen", b =>
                {
                    b.HasOne("AgroServices.Models.Publicacion", "Publicaciones")
                        .WithMany("Imagenes")
                        .HasForeignKey("PublicacionID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Publicaciones");
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

            modelBuilder.Entity("AgroServices.Models.Solicitud", b =>
                {
                    b.HasOne("AgroServices.Models.Publicacion", "Publicaciones")
                        .WithMany("Solicitudes")
                        .HasForeignKey("PublicacionID")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Publicaciones");
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
                    b.Navigation("Imagenes");

                    b.Navigation("Solicitudes");

                    b.Navigation("Valoraciones");
                });

            modelBuilder.Entity("AgroServices.Models.Servicio", b =>
                {
                    b.Navigation("Etiquetas");
                });

            modelBuilder.Entity("AgroServices.Models.Usuario", b =>
                {
                    b.Navigation("Publicaciones");
                });
#pragma warning restore 612, 618
        }
    }
}
