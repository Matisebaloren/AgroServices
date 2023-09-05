using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class Notificaciones20 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Notificaciones");

            migrationBuilder.DropColumn(
                name: "PublicacionID",
                table: "Notificaciones");

            migrationBuilder.AddColumn<string>(
                name: "Link",
                table: "Notificaciones",
                type: "nvarchar(max)",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Link",
                table: "Notificaciones");

            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Notificaciones",
                type: "bit",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "PublicacionID",
                table: "Notificaciones",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }
    }
}
