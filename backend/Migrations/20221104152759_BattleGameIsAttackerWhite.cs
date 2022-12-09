using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class BattleGameIsAttackerWhite : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsAttackerWhite",
                table: "BattleGames",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsAttackerWhite",
                table: "BattleGames");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeletedOn",
                value: new DateTime(2022, 11, 4, 1, 54, 3, 289, DateTimeKind.Utc).AddTicks(9260));

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
