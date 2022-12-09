using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class StarterCode : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "BoilerplateCode",
                table: "Games");

            migrationBuilder.DropColumn(
                name: "HelperCode",
                table: "Games");

            migrationBuilder.AddColumn<int>(
                name: "Language",
                table: "Strategies",
                type: "int",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.CreateTable(
                name: "StarterCode",
                columns: table => new
                {
                    Type = table.Column<int>(type: "int", nullable: false),
                    Language = table.Column<int>(type: "int", nullable: false),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    Code = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StarterCode", x => new { x.GameId, x.Type, x.Language });
                    table.ForeignKey(
                        name: "FK_StarterCode_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "LongDescription", "ShortDescription" },
                values: new object[] { null, "To be populated by Initialization Service." });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "LongDescription", "ShortDescription" },
                values: new object[] { null, "To be populated by Initialization Service." });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "DeletedOn", "LongDescription", "ShortDescription" },
                values: new object[] { null, null, "To be populated by Initialization Service." });

            migrationBuilder.UpdateData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"),
                column: "Name",
                value: "Stock Easy AI (Java)");

            migrationBuilder.UpdateData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("ecce68c3-9ce0-466c-a7b5-5bf7affd5189"),
                column: "Name",
                value: "Stock Hard AI (Java)");

            migrationBuilder.UpdateData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7"),
                column: "Name",
                value: "Stock Medium AI (Java)");

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

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "StarterCode");

            migrationBuilder.DropColumn(
                name: "Language",
                table: "Strategies");

            migrationBuilder.AddColumn<string>(
                name: "BoilerplateCode",
                table: "Games",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.AddColumn<string>(
                name: "HelperCode",
                table: "Games",
                type: "longtext",
                nullable: true)
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 1,
                columns: new[] { "BoilerplateCode", "LongDescription", "ShortDescription" },
                values: new object[] { "\n                    const step(state, actions) => {\n                        return null;\n                    }\n\n                    export default step;\n                ", "\nThe goal of this game is to advance a 1-piece past your opponent’s last rank (equivalently, if you start your turn with a 1-piece at the opponent’s end of the board, you win), or capture all of your opponent’s 1-pieces\nThe game is played on a 10x10 board. The starting configuration of pieces is as follows:\nThis is player 1’s pieces from player 1’s POV. Player 2 has the same pieces (lower left corner is a 3)\nAn N-piece moves exactly N squares in any direction, horizontally, vertically, or diagonally. 2, 3, and 4-pieces may jump over any number of friendly or enemy pieces\nCaptures occur when a piece lands on an enemy piece. The lower ranked piece is removed. If both have the same rank, both are removed. Yes, you can suicide your own piece as a move.\n                ", "Advance a 1-piece past your opponent's last rank." });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 2,
                columns: new[] { "BoilerplateCode", "LongDescription", "ShortDescription" },
                values: new object[] { "\n                    const step(state, actions) => {\n                        return null;\n                    }\n\n                    export default step;\n                ", "\nCheckers is a board game played between two people on an 8x8 checked board.\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \nBlah blah blah\n                ", "Eliminate all of your opponents pieces by jumping over them." });

            migrationBuilder.UpdateData(
                table: "Games",
                keyColumn: "Id",
                keyValue: 3,
                columns: new[] { "BoilerplateCode", "DeletedOn", "LongDescription", "ShortDescription" },
                values: new object[] { "\n                    const step(state, actions) => {\n                        return null;\n                    }\n\n                    export default step;\n                ", new DateTime(2022, 11, 4, 15, 27, 58, 607, DateTimeKind.Utc).AddTicks(4570), "\nChess is a board game played between two people on an 8x8 checked board like the one shown below.\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \nBlah blah blah\n                ", "Eliminate all of your opponents pieces by jumping over them." });

            migrationBuilder.UpdateData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"),
                column: "Name",
                value: "Stock Easy AI");

            migrationBuilder.UpdateData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("ecce68c3-9ce0-466c-a7b5-5bf7affd5189"),
                column: "Name",
                value: "Stock Hard AI");

            migrationBuilder.UpdateData(
                table: "Strategies",
                keyColumn: "Id",
                keyValue: new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7"),
                column: "Name",
                value: "Stock Medium AI");

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
