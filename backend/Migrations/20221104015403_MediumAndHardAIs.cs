using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class MediumAndHardAIs : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Battles",
                type: "varchar(100)",
                maxLength: 100,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeletedOn",
                value: new DateTime(2022, 11, 4, 1, 54, 3, 289, DateTimeKind.Utc).AddTicks(9260));

            migrationBuilder.InsertData(
                table: "Strategies",
                columns: new[] { "Id", "CreatedByUserId", "CreatedOn", "DeletedOn", "GameId", "Name", "SourceCode", "Status", "UpdatedOn", "Version" },
                values: new object[,]
                {
                    { new Guid("ecce68c3-9ce0-466c-a7b5-5bf7affd5189"), new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1, "Stock Hard AI", null, 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0 },
                    { new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7"), new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1, "Stock Medium AI", null, 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0 }
                });

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("ecce68c3-9ce0-466c-a7b5-5bf7affd5189"));

            migrationBuilder.DeleteData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7"));

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Battles",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "varchar(100)",
                oldMaxLength: 100)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeletedOn",
                value: new DateTime(2022, 10, 18, 17, 29, 31, 597, DateTimeKind.Utc).AddTicks(9990));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "1g65sdIEDjWNobB/nrgfySTW+FFZ+ONzddjVZGr3Tv4=", "6X+QgYcdgIXaP4qtBfGvuw==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "bJb10DJGMBHqiPmzlqiOGw/WPEh1QSMiJAIO6sOCPSQ=", "7DKALLhR43AqqBtzmk5VbA==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "jhzcEjvhTx7ZUNuLPemZcIrNikxew+xnwK0xMAIrksI=", "4mDGDGfIBLXWpAYMssrnmg==" });
        }
    }
}
