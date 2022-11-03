using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class AdditionalStrategyField : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "IsPrivate",
                table: "Strategies",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeletedOn",
                value: new DateTime(2022, 11, 3, 4, 17, 12, 576, DateTimeKind.Utc).AddTicks(7860));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "PJ1u6maNbtZ4cxaNICnmcLHeNJ3uQLAzfe6MoNBbWeo=", "xzuXuFgxyjoAbY6aQ0LNcg==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "WyLM6aC8b1lDEYKcxG5W7J5xDnngfkKByJ7T3S0xG1I=", "/8QRer8+sF/grcVkear+nw==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "IKM5JJOKXl9KWlEfBENfhnf5XmQc+oxermUY7eFhRuE=", "i0VO3wHJytqUsJOCpATnEQ==" });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "IsPrivate",
                table: "Strategies");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                column: "DeletedOn",
                value: new DateTime(2022, 10, 5, 15, 33, 53, 358, DateTimeKind.Utc).AddTicks(2344));

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "0EyoBaU5G5RKqDQ9GWEvv2uEMhZsj9mfreCfSRKlzWM=", "gyG3jTvLAN5xs35sC++N0w==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "HdKkOjw0kt6hW3dgev78+5PcPCltspMlk0m7ssUOWCM=", "MyxZoNvnA9W8g38CjwYvSw==" });

            migrationBuilder.UpdateData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                columns: new[] { "Password", "Salt" },
                values: new object[] { "q70yWSmKYTbPRf8xo3BcjAXj/fU/axL5qURJOdLjT/0=", "nuQWgXy76L3Ek1eEBOCIqQ==" });
        }
    }
}
