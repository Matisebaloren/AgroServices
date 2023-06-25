using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class Imagene23623 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Img_public",
                table: "Imagenes",
                newName: "Img");

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Imagenes",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "NombreImagen",
                table: "Imagenes",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TipoImagen",
                table: "Imagenes",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Imagenes");

            migrationBuilder.DropColumn(
                name: "NombreImagen",
                table: "Imagenes");

            migrationBuilder.DropColumn(
                name: "TipoImagen",
                table: "Imagenes");

            migrationBuilder.RenameColumn(
                name: "Img",
                table: "Imagenes",
                newName: "Img_public");
        }
    }
}
