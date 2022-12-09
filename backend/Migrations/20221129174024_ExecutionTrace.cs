using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class ExecutionTrace : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "AttackerStrategySnapshot",
                table: "Battles",
                newName: "AttackingStrategySnapshot");

            migrationBuilder.AddColumn<string>(
                name: "LinesExecuted",
                table: "Turns",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeletedOn",
                value: new DateTime(2022, 11, 29, 17, 40, 23, 834, DateTimeKind.Utc).AddTicks(5520));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "QSVo3MMFEPzhmHfoJUJz5oYpLVsk5ik2EUr+Aal3i18=", "/DLZNyWkWQ+YQaBRofEChA==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "cj6hXKy9D/53awoUq5GVcA0a+0n7dp9saqP/czUuQDs=", "UcVafX2k0G3qWWJRmYVbOA==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "NxegdB9QJobYw3z+7Bz6iT1zUhz1JcxAxlGiQCc3KjE=", "imEuHXSGxWyJuocJ0EBY+g==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "LinesExecuted",
                table: "Turns");

            migrationBuilder.RenameColumn(
                name: "AttackingStrategySnapshot",
                table: "Battles",
                newName: "AttackerStrategySnapshot");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeletedOn",
                value: new DateTime(2022, 11, 4, 15, 27, 58, 607, DateTimeKind.Utc).AddTicks(4570));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "ZqqCv+lHdiTwxWqoFbht06pgL4HAFsX1nnCdE6DYZwM=", "nQW1XsHPuL8urXcWGWAlmA==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "me4jHHeFwVIwCHln4/iGsvv/38VCkmt1Y8iDf9fVtRE=", "hbRJYOCRWTXHdLjbM1z78Q==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "+IIAO0R3334td3uKozQj81tru0Gk7ZyqObMcY2e93vs=", "pXvUNAefXm5O8DGfRR4Sog==" });
        }
    }
}
