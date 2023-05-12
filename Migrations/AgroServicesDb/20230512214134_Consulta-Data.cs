using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AgroServices.Migrations.AgroServicesDb
{
    public partial class ConsultaData : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consulta_Publicaciones_PublicacionID",
                table: "Consulta");

            migrationBuilder.DropForeignKey(
                name: "FK_Consulta_Usuarios_UsuarioID",
                table: "Consulta");

            migrationBuilder.DropForeignKey(
                name: "FK_Valoracion_Publicaciones_PublicacionID",
                table: "Valoracion");

            migrationBuilder.DropForeignKey(
                name: "FK_Valoracion_Usuarios_UsuarioID",
                table: "Valoracion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Valoracion",
                table: "Valoracion");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Consulta",
                table: "Consulta");

            migrationBuilder.RenameTable(
                name: "Valoracion",
                newName: "Valoraciones");

            migrationBuilder.RenameTable(
                name: "Consulta",
                newName: "Consultas");

            migrationBuilder.RenameIndex(
                name: "IX_Valoracion_UsuarioID",
                table: "Valoraciones",
                newName: "IX_Valoraciones_UsuarioID");

            migrationBuilder.RenameIndex(
                name: "IX_Valoracion_PublicacionID",
                table: "Valoraciones",
                newName: "IX_Valoraciones_PublicacionID");

            migrationBuilder.RenameIndex(
                name: "IX_Consulta_UsuarioID",
                table: "Consultas",
                newName: "IX_Consultas_UsuarioID");

            migrationBuilder.RenameIndex(
                name: "IX_Consulta_PublicacionID",
                table: "Consultas",
                newName: "IX_Consultas_PublicacionID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Valoraciones",
                table: "Valoraciones",
                column: "ValoracionID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Consultas",
                table: "Consultas",
                column: "ConsultaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Consultas_Publicaciones_PublicacionID",
                table: "Consultas",
                column: "PublicacionID",
                principalTable: "Publicaciones",
                principalColumn: "PublicacionID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Consultas_Usuarios_UsuarioID",
                table: "Consultas",
                column: "UsuarioID",
                principalTable: "Usuarios",
                principalColumn: "UsuarioID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Valoraciones_Publicaciones_PublicacionID",
                table: "Valoraciones",
                column: "PublicacionID",
                principalTable: "Publicaciones",
                principalColumn: "PublicacionID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Valoraciones_Usuarios_UsuarioID",
                table: "Valoraciones",
                column: "UsuarioID",
                principalTable: "Usuarios",
                principalColumn: "UsuarioID",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Consultas_Publicaciones_PublicacionID",
                table: "Consultas");

            migrationBuilder.DropForeignKey(
                name: "FK_Consultas_Usuarios_UsuarioID",
                table: "Consultas");

            migrationBuilder.DropForeignKey(
                name: "FK_Valoraciones_Publicaciones_PublicacionID",
                table: "Valoraciones");

            migrationBuilder.DropForeignKey(
                name: "FK_Valoraciones_Usuarios_UsuarioID",
                table: "Valoraciones");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Valoraciones",
                table: "Valoraciones");

            migrationBuilder.DropPrimaryKey(
                name: "PK_Consultas",
                table: "Consultas");

            migrationBuilder.RenameTable(
                name: "Valoraciones",
                newName: "Valoracion");

            migrationBuilder.RenameTable(
                name: "Consultas",
                newName: "Consulta");

            migrationBuilder.RenameIndex(
                name: "IX_Valoraciones_UsuarioID",
                table: "Valoracion",
                newName: "IX_Valoracion_UsuarioID");

            migrationBuilder.RenameIndex(
                name: "IX_Valoraciones_PublicacionID",
                table: "Valoracion",
                newName: "IX_Valoracion_PublicacionID");

            migrationBuilder.RenameIndex(
                name: "IX_Consultas_UsuarioID",
                table: "Consulta",
                newName: "IX_Consulta_UsuarioID");

            migrationBuilder.RenameIndex(
                name: "IX_Consultas_PublicacionID",
                table: "Consulta",
                newName: "IX_Consulta_PublicacionID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Valoracion",
                table: "Valoracion",
                column: "ValoracionID");

            migrationBuilder.AddPrimaryKey(
                name: "PK_Consulta",
                table: "Consulta",
                column: "ConsultaID");

            migrationBuilder.AddForeignKey(
                name: "FK_Consulta_Publicaciones_PublicacionID",
                table: "Consulta",
                column: "PublicacionID",
                principalTable: "Publicaciones",
                principalColumn: "PublicacionID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Consulta_Usuarios_UsuarioID",
                table: "Consulta",
                column: "UsuarioID",
                principalTable: "Usuarios",
                principalColumn: "UsuarioID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Valoracion_Publicaciones_PublicacionID",
                table: "Valoracion",
                column: "PublicacionID",
                principalTable: "Publicaciones",
                principalColumn: "PublicacionID",
                onDelete: ReferentialAction.Cascade);

            migrationBuilder.AddForeignKey(
                name: "FK_Valoracion_Usuarios_UsuarioID",
                table: "Valoracion",
                column: "UsuarioID",
                principalTable: "Usuarios",
                principalColumn: "UsuarioID",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
