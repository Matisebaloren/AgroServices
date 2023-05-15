using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class modificar_modelo_localidad : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Localidades_Provincias_ProvinciaID",
                table: "Localidades");

            migrationBuilder.AlterColumn<int>(
                name: "ProvinciaID",
                table: "Localidades",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Localidades_Provincias_ProvinciaID",
                table: "Localidades",
                column: "ProvinciaID",
                principalTable: "Provincias",
                principalColumn: "ProvinciaID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Localidades_Provincias_ProvinciaID",
                table: "Localidades");

            migrationBuilder.AlterColumn<int>(
                name: "ProvinciaID",
                table: "Localidades",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddForeignKey(
                name: "FK_Localidades_Provincias_ProvinciaID",
                table: "Localidades",
                column: "ProvinciaID",
                principalTable: "Provincias",
                principalColumn: "ProvinciaID");
        }
    }
}
