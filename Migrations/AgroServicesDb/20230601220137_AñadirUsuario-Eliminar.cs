using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class AñadirUsuarioEliminar : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Clasificacion",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "Localidad",
                table: "Usuarios");

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Usuarios",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Usuarios");

            migrationBuilder.AddColumn<int>(
                name: "Clasificacion",
                table: "Usuarios",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Localidad",
                table: "Usuarios",
                type: "nvarchar(max)",
                nullable: true);
        }
    }
}
