using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class AñadirEliminadoaModelos : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioNombre",
                table: "Valoraciones");

            migrationBuilder.DropColumn(
                name: "UsuarioNombre",
                table: "Consultas");

            migrationBuilder.AddColumn<int>(
                name: "UsuarioID",
                table: "Valoraciones",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Publicaciones",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Provincias",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Localidades",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Consultas",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "UsuarioID",
                table: "Consultas",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "UsuarioID",
                table: "Valoraciones");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Publicaciones");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Provincias");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Localidades");

            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Consultas");

            migrationBuilder.DropColumn(
                name: "UsuarioID",
                table: "Consultas");

            migrationBuilder.AddColumn<string>(
                name: "UsuarioNombre",
                table: "Valoraciones",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "UsuarioNombre",
                table: "Consultas",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
