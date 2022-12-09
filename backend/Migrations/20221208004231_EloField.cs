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
                values: new object[] { "\r\n                    const step(state, actions) => {\r\n                        return null;\r\n                    }\r\n\r\n                    export default step;\r\n                ", new DateTime(2022, 12, 8, 0, 42, 31, 530, DateTimeKind.Utc).AddTicks(6282), "\r\nChess is a board game played between two people on an 8x8 checked board like the one shown below.\r\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \r\nBlah blah blah\r\n                " });

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
                values: new object[] { "\n                    const step(state, actions) => {\n                        return null;\n                    }\n\n                    export default step;\n                ", new DateTime(2022, 11, 4, 1, 54, 3, 289, DateTimeKind.Utc).AddTicks(9260), "\nChess is a board game played between two people on an 8x8 checked board like the one shown below.\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \nBlah blah blah\n                " });

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
