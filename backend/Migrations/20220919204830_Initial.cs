using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AVA.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AlterDatabase()
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Games",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("MySql:ValueGenerationStrategy", MySqlValueGenerationStrategy.IdentityColumn),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ShortDescription = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LongDescription = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BoilerplateCode = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Games", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Username = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Email = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    FirstName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    LastName = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Password = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Salt = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Active = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "AuthTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Type = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Token = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    ExpiresOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    RevokedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true),
                    UserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    ReplacedByTokenId = table.Column<Guid>(type: "char(36)", nullable: true, collation: "ascii_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuthTokens", x => x.Id);
                    table.ForeignKey(
                        name: "FK_AuthTokens_AuthTokens_ReplacedByTokenId",
                        column: x => x.ReplacedByTokenId,
                        principalTable: "AuthTokens",
                        principalColumn: "Id");
                    table.ForeignKey(
                        name: "FK_AuthTokens_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BugReports",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Description = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Regarding = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedByUserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BugReports", x => x.Id);
                    table.ForeignKey(
                        name: "FK_BugReports_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Strategies",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    SourceCode = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    Status = table.Column<int>(type: "int", nullable: false),
                    Version = table.Column<int>(type: "int", nullable: false),
                    CreatedByUserId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    GameId = table.Column<int>(type: "int", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Strategies", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Strategies_Games_GameId",
                        column: x => x.GameId,
                        principalTable: "Games",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Strategies_Users_CreatedByUserId",
                        column: x => x.CreatedByUserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Battles",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    Name = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    BattleStatus = table.Column<int>(type: "int", nullable: false),
                    Iterations = table.Column<int>(type: "int", nullable: false),
                    AttackerWins = table.Column<int>(type: "int", nullable: false),
                    DefenderWins = table.Column<int>(type: "int", nullable: false),
                    StackTrace = table.Column<string>(type: "longtext", nullable: true)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    AttackingStrategyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DefendingStrategyId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Battles", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Battles_Strategies_AttackingStrategyId",
                        column: x => x.AttackingStrategyId,
                        principalTable: "Strategies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Battles_Strategies_DefendingStrategyId",
                        column: x => x.DefendingStrategyId,
                        principalTable: "Strategies",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "BattleGames",
                columns: table => new
                {
                    GameNumber = table.Column<int>(type: "int", nullable: false),
                    BattleId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    DidAttackerWin = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_BattleGames", x => new { x.BattleId, x.GameNumber });
                    table.ForeignKey(
                        name: "FK_BattleGames_Battles_BattleId",
                        column: x => x.BattleId,
                        principalTable: "Battles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.CreateTable(
                name: "Turns",
                columns: table => new
                {
                    TurnNumber = table.Column<int>(type: "int", nullable: false),
                    BattleId = table.Column<Guid>(type: "char(36)", nullable: false, collation: "ascii_general_ci"),
                    BattleGameNumber = table.Column<int>(type: "int", nullable: false),
                    IsAttackTurn = table.Column<bool>(type: "tinyint(1)", nullable: false),
                    TurnData = table.Column<string>(type: "longtext", nullable: false)
                        .Annotation("MySql:CharSet", "utf8mb4"),
                    CreatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "datetime(6)", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "datetime(6)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Turns", x => new { x.BattleId, x.BattleGameNumber, x.TurnNumber });
                    table.ForeignKey(
                        name: "FK_Turns_BattleGames_BattleId_BattleGameNumber",
                        columns: x => new { x.BattleId, x.BattleGameNumber },
                        principalTable: "BattleGames",
                        principalColumns: new[] { "BattleId", "GameNumber" },
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Turns_Battles_BattleId",
                        column: x => x.BattleId,
                        principalTable: "Battles",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                })
                .Annotation("MySql:CharSet", "utf8mb4");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Active", "CreatedOn", "DeletedOn", "Email", "FirstName", "LastName", "Password", "Salt", "UpdatedOn", "Username" },
                values: new object[] { new Guid("104d8f61-c4b4-4e08-9534-848dac332425"), true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Kyle", "Orciuch", "9omC/kK+zVKzfdX8QhvNfGpBFXIs7hXgyKdEClFCd0M=", "z+wbth/X2dPpMSxSffmr+g==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "kyle" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Active", "CreatedOn", "DeletedOn", "Email", "FirstName", "LastName", "Password", "Salt", "UpdatedOn", "Username" },
                values: new object[] { new Guid("1601abf9-f469-4e79-95fb-c1592b8bcef0"), true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, null, "Marcus", "Orciuch", "T4oCXhanOafoDFBJnqTIZ8+8AfqHliGcIvCHowE6fr8=", "66bhDOqtne7jeQBlUOHNBQ==", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "marcus" });

            migrationBuilder.CreateIndex(
                name: "IX_AuthTokens_ReplacedByTokenId",
                table: "AuthTokens",
                column: "ReplacedByTokenId");

            migrationBuilder.CreateIndex(
                name: "IX_AuthTokens_UserId",
                table: "AuthTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Battles_AttackingStrategyId",
                table: "Battles",
                column: "AttackingStrategyId");

            migrationBuilder.CreateIndex(
                name: "IX_Battles_DefendingStrategyId",
                table: "Battles",
                column: "DefendingStrategyId");

            migrationBuilder.CreateIndex(
                name: "IX_BugReports_CreatedByUserId",
                table: "BugReports",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Strategies_CreatedByUserId",
                table: "Strategies",
                column: "CreatedByUserId");

            migrationBuilder.CreateIndex(
                name: "IX_Strategies_GameId",
                table: "Strategies",
                column: "GameId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuthTokens");

            migrationBuilder.DropTable(
                name: "BugReports");

            migrationBuilder.DropTable(
                name: "Turns");

            migrationBuilder.DropTable(
                name: "BattleGames");

            migrationBuilder.DropTable(
                name: "Battles");

            migrationBuilder.DropTable(
                name: "Strategies");

            migrationBuilder.DropTable(
                name: "Games");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
