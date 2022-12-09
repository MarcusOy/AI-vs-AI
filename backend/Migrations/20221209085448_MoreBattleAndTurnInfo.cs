using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class MoreBattleAndTurnInfo : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "PrintInfo",
                table: "Turns",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "TestSuiteResult",
                table: "Battles",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "O8jLtI1NVu1ql3HRV/nVG5ChDk0VJvxdHgxGbfyeiKk=", "J+ngHLhwlA0qQcxzXc2ROQ==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "DvfJsoaEtwapRt5quVh9lfoI8T5X0+Sy95WXBhPCcm0=", "z2Cxsu1uUMmJGlI97+bCkw==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "w976r1jTd2s92sBQUNXf3cgFcys4EzRyWTmyw5ynu5s=", "4mJGCAG3c4jkAUkDcyg6tQ==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "PrintInfo",
                table: "Turns");

            migrationBuilder.DropColumn(
                name: "TestSuiteResult",
                table: "Battles");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "RHE5rbS5JaInIi/Jrds2uwd4NRUECvmBPtfjx+1J2G4=", "UEUtg/ImhiAkyQt0+qiZLQ==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "NYGUpmbuttfQdsPdYFPFkL60ZIwa7VWYqSe+uPn/8ks=", "NKVAn2IO+gPFQaZw59rpZg==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "YjasCROT8HzlSoRBIQN5wlieAW2fg/lvCTuVOX9E6vo=", "ky+fPO3g//LlBkCBFgLMdA==" });
        }
    }
}
