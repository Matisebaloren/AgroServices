using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class Publicacion : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Provincias_ProvinciasProvinciaID",
                table: "Usuarios");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_ProvinciasProvinciaID",
                table: "Usuarios");

            migrationBuilder.DropColumn(
                name: "ProvinciasProvinciaID",
                table: "Usuarios");

            migrationBuilder.RenameColumn(
                name: "Provincia",
                table: "Usuarios",
                newName: "ProvinciaID");

            migrationBuilder.CreateTable(
                name: "Publicaciones",
                columns: table => new
                {
                    PublicacionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    ClasificacionOferta = table.Column<bool>(type: "bit", nullable: false),
                    Titulo = table.Column<int>(type: "int", nullable: false),
                    Descripcion = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsuarioID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Publicaciones", x => x.PublicacionID);
                    table.ForeignKey(
                        name: "FK_Publicaciones_Usuarios_UsuarioID",
                        column: x => x.UsuarioID,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_ProvinciaID",
                table: "Usuarios",
                column: "ProvinciaID");

            migrationBuilder.CreateIndex(
                name: "IX_Publicaciones_UsuarioID",
                table: "Publicaciones",
                column: "UsuarioID");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Provincias_ProvinciaID",
                table: "Usuarios",
                column: "ProvinciaID",
                principalTable: "Provincias",
                principalColumn: "ProvinciaID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Usuarios_Provincias_ProvinciaID",
                table: "Usuarios");

            migrationBuilder.DropTable(
                name: "Publicaciones");

            migrationBuilder.DropIndex(
                name: "IX_Usuarios_ProvinciaID",
                table: "Usuarios");

            migrationBuilder.RenameColumn(
                name: "ProvinciaID",
                table: "Usuarios",
                newName: "Provincia");

            migrationBuilder.AddColumn<int>(
                name: "ProvinciasProvinciaID",
                table: "Usuarios",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Usuarios_ProvinciasProvinciaID",
                table: "Usuarios",
                column: "ProvinciasProvinciaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Usuarios_Provincias_ProvinciasProvinciaID",
                table: "Usuarios",
                column: "ProvinciasProvinciaID",
                principalTable: "Provincias",
                principalColumn: "ProvinciaID");
        }
    }
}
