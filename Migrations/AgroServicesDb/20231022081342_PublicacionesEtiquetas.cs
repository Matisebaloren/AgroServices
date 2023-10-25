using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class PublicacionesEtiquetas : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateIndex(
                name: "IX_Etiquetas_ServicioID",
                table: "Etiquetas",
                column: "ServicioID");

            migrationBuilder.AddForeignKey(
                name: "FK_Etiquetas_Servicios_ServicioID",
                table: "Etiquetas",
                column: "ServicioID",
                principalTable: "Servicios",
                principalColumn: "ServicioID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Etiquetas_Servicios_ServicioID",
                table: "Etiquetas");

            migrationBuilder.DropIndex(
                name: "IX_Etiquetas_ServicioID",
                table: "Etiquetas");
        }
    }
}
