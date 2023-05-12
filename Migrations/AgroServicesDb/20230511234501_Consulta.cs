using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class Consulta : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Consulta",
                columns: table => new
                {
                    ConsultaID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Respuesta = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Contenido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    UsuarioID = table.Column<int>(type: "int", nullable: false),
                    PublicacionID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Consulta", x => x.ConsultaID);
                    table.ForeignKey(
                        name: "FK_Consulta_Publicaciones_PublicacionID",
                        column: x => x.PublicacionID,
                        principalTable: "Publicaciones",
                        principalColumn: "PublicacionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Consulta_Usuarios_UsuarioID",
                        column: x => x.UsuarioID,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Valoracion",
                columns: table => new
                {
                    ValoracionID = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Contenido = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Puntuacion = table.Column<int>(type: "int", nullable: false),
                    PublicacionID = table.Column<int>(type: "int", nullable: false),
                    UsuarioID = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Valoracion", x => x.ValoracionID);
                    table.ForeignKey(
                        name: "FK_Valoracion_Publicaciones_PublicacionID",
                        column: x => x.PublicacionID,
                        principalTable: "Publicaciones",
                        principalColumn: "PublicacionID",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Valoracion_Usuarios_UsuarioID",
                        column: x => x.UsuarioID,
                        principalTable: "Usuarios",
                        principalColumn: "UsuarioID",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Consulta_PublicacionID",
                table: "Consulta",
                column: "PublicacionID");

            migrationBuilder.CreateIndex(
                name: "IX_Consulta_UsuarioID",
                table: "Consulta",
                column: "UsuarioID");

            migrationBuilder.CreateIndex(
                name: "IX_Valoracion_PublicacionID",
                table: "Valoracion",
                column: "PublicacionID");

            migrationBuilder.CreateIndex(
                name: "IX_Valoracion_UsuarioID",
                table: "Valoracion",
                column: "UsuarioID");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Consulta");

            migrationBuilder.DropTable(
                name: "Valoracion");
        }
    }
}
