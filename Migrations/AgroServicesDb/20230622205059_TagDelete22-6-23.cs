using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class TagDelete22623 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "Eliminado",
                table: "Etiquetas",
                type: "bit",
                nullable: false,
                defaultValue: false);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Eliminado",
                table: "Etiquetas");
        }
    }
}
