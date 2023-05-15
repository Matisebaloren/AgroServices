using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class AñadirLocalidad : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Provincias_ProvinciaID",
                table: "Usuarios");

            migrationBuilder.RenameColumn(
                name: "ProvinciaID",
                table: "Usuarios",
                newName: "LocalidadID");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_ProvinciaID",
                table: "Usuarios",
                newName: "IX_Usuarios_LocalidadID");

            migrationBuilder.CreateTable(
                name: "Localidades",
                columns: table => new
                {
                    LocalidadID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Nombre = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    ProvinciaID = table.Column<int>(type: "int", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Localidades", x => x.LocalidadID);
                    table.ForeignKey(
                        name: "FK_Localidades_Provincias_ProvinciaID",
                        column: x => x.ProvinciaID,
                        principalTable: "Provincias",
                        principalColumn: "ProvinciaID");
                });

            migrationBuilder.CreateIndex(
                name: "IX_Localidades_ProvinciaID",
                table: "Localidades",
                column: "ProvinciaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Localidades_LocalidadID",
                table: "Usuarios",
                column: "LocalidadID",
                principalTable: "Localidades",
                principalColumn: "LocalidadID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Localidades_LocalidadID",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "Localidades");

            migrationBuilder.RenameColumn(
                name: "LocalidadID",
                table: "Usuarios",
                newName: "ProvinciaID");

            migrationBuilder.RenameIndex(
                name: "IX_Usuarios_LocalidadID",
                table: "Usuarios",
                newName: "IX_Usuarios_ProvinciaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Provincias_ProvinciaID",
                table: "Usuarios",
                column: "ProvinciaID",
                principalTable: "Provincias",
                principalColumn: "ProvinciaID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
