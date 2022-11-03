using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class SimulationSchemaChanges : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "StackTrace",
                table: "Battles",
                newName: "DefendingStrategySnapshot");

            migrationBuilder.AlterColumn<string>(
                name: "BoilerplateCode",
                table: "Games",
                type: "longtext",
                nullable: true,
                oldClrType: typeof(string),
                oldType: "longtext")
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HelperCode",
                table: "Games",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "AttackerStrategySnapshot",
                table: "Battles",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<bool>(
                name: "IsTestSubmission",
                table: "Battles",
                type: "tinyint(1)",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "StackTrace",
                table: "BattleGames",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BoilerplateCode", "LongDescription" },
                values: new object[] { "\n                    const step(state, actions) => {\n                        return null;\n                    }\n\n                    export default step;\n                ", "\nThe goal of this game is to advance a 1-piece past your opponent’s last rank (equivalently, if you start your turn with a 1-piece at the opponent’s end of the board, you win), or capture all of your opponent’s 1-pieces\nThe game is played on a 10x10 board. The starting configuration of pieces is as follows:\nThis is player 1’s pieces from player 1’s POV. Player 2 has the same pieces (lower left corner is a 3)\nAn N-piece moves exactly N squares in any direction, horizontally, vertically, or diagonally. 2, 3, and 4-pieces may jump over any number of friendly or enemy pieces\nCaptures occur when a piece lands on an enemy piece. The lower ranked piece is removed. If both have the same rank, both are removed. Yes, you can suicide your own piece as a move.\n                " });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BoilerplateCode", "LongDescription" },
                values: new object[] { "\n                    const step(state, actions) => {\n                        return null;\n                    }\n\n                    export default step;\n                ", "\nCheckers is a board game played between two people on an 8x8 checked board.\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \nBlah blah blah\n                " });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "BoilerplateCode", "DeletedOn", "LongDescription" },
                values: new object[] { "\n                    const step(state, actions) => {\n                        return null;\n                    }\n\n                    export default step;\n                ", new DateTime(2022, 10, 18, 17, 29, 31, 597, DateTimeKind.Utc).AddTicks(9990), "\nChess is a board game played between two people on an 8x8 checked board like the one shown below.\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \nBlah blah blah\n                " });

            migrationBuilder.InsertData(
                table: "Strategies",
                columns: new[] { "Id", "CreatedByUserId", "CreatedOn", "DeletedOn", "GameId", "Name", "SourceCode", "Status", "UpdatedOn", "Version" },
                values: new object[] { new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"), new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, 1, "Stock Easy AI", null, 1, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), 0 });

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"));

            migrationBuilder.DropColumn(
                name: "HelperCode",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "AttackerStrategySnapshot",
                table: "Battles");

            migrationBuilder.DropColumn(
                name: "IsTestSubmission",
                table: "Battles");

            migrationBuilder.DropColumn(
                name: "StackTrace",
                table: "BattleGames");

            migrationBuilder.RenameColumn(
                name: "DefendingStrategySnapshot",
                table: "Battles",
                newName: "StackTrace");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "BoilerplateCode",
                keyValue: null,
                column: "BoilerplateCode",
                value: "");

            migrationBuilder.AlterColumn<string>(
                name: "BoilerplateCode",
                table: "Games",
                type: "longtext",
                nullable: false,
                oldClrType: typeof(string),
                oldType: "longtext",
                oldNullable: true)
                .Annotation("MySql:CharSet", "utf8mb4")
                .OldAnnotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BoilerplateCode", "LongDescription" },
                values: new object[] { "\r\n                    const step(state, actions) => {\r\n                        return null;\r\n                    }\r\n\r\n                    export default step;\r\n                ", "\r\nThe goal of this game is to advance a 1-piece past your opponent’s last rank (equivalently, if you start your turn with a 1-piece at the opponent’s end of the board, you win), or capture all of your opponent’s 1-pieces\r\nThe game is played on a 10x10 board. The starting configuration of pieces is as follows:\r\nThis is player 1’s pieces from player 1’s POV. Player 2 has the same pieces (lower left corner is a 3)\r\nAn N-piece moves exactly N squares in any direction, horizontally, vertically, or diagonally. 2, 3, and 4-pieces may jump over any number of friendly or enemy pieces\r\nCaptures occur when a piece lands on an enemy piece. The lower ranked piece is removed. If both have the same rank, both are removed. Yes, you can suicide your own piece as a move.\r\n                " });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BoilerplateCode", "LongDescription" },
                values: new object[] { "\r\n                    const step(state, actions) => {\r\n                        return null;\r\n                    }\r\n\r\n                    export default step;\r\n                ", "\r\nCheckers is a board game played between two people on an 8x8 checked board.\r\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \r\nBlah blah blah\r\n                " });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "BoilerplateCode", "DeletedOn", "LongDescription" },
                values: new object[] { "\r\n                    const step(state, actions) => {\r\n                        return null;\r\n                    }\r\n\r\n                    export default step;\r\n                ", new DateTime(2022, 10, 5, 15, 33, 53, 358, DateTimeKind.Utc).AddTicks(2344), "\r\nChess is a board game played between two people on an 8x8 checked board like the one shown below.\r\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \r\nBlah blah blah\r\n                " });

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
