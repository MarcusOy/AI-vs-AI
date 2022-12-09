using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class EloField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Elo",
                table: "Strategies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "AyFDDlKhjkGAM2heh4tGxLrRKyKXjjTsq9hHeqFhWyc=", "qWqwqxvOYuGe2Bxol8Q6ag==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "pZhK1kS+NTnVZfhArmIDZzcJyy3WO8Ri8Hbgp9zbDaY=", "kPlxweFSz7ZkE6tkmArZ8A==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "MaFytUGjUNcjQoY9PtA0MAty4Q4CXr3i7ARKSauCobA=", "ZqkheuV2bLD+nuiQLyQDOQ==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Elo",
                table: "Strategies");

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "wsgwvU0CJ7694v2TvBMbC7FRZ1l6GaUH/9dwDq0s41M=", "P9biM/UD/gXUU/IYuw9HIA==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "XnMOvV2EM1vzfa8dnRRfyoV1OHgcPwC+YB7rhdxFEHg=", "CmdkZduCBhU+jZHXVRNiKw==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "t6AgeRhND2Za6hb1d0wHZMM/5Xs9m4Pc8tcCdgMNNjo=", "ZJg76QyA1SzWVnAdBXkuaQ==" });
        }
    }
}
