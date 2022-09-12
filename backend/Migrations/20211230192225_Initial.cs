using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Snappy.API.Migrations
{
    public partial class Initial : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    FirstName = table.Column<string>(type: "TEXT", nullable: true),
                    LastName = table.Column<string>(type: "TEXT", nullable: true),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    Password = table.Column<string>(type: "TEXT", nullable: false),
                    Salt = table.Column<string>(type: "TEXT", nullable: false),
                    PublicKey = table.Column<string>(type: "TEXT", nullable: true),
                    TwoFactorKey = table.Column<string>(type: "TEXT", nullable: true),
                    Active = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuthTokens",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Token = table.Column<string>(type: "TEXT", nullable: false),
                    ExpiresOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    RevokedOn = table.Column<DateTime>(type: "TEXT", nullable: true),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReplacedByTokenId = table.Column<Guid>(type: "TEXT", nullable: true),
                    CreatedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "TEXT", nullable: true)
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
                });

            migrationBuilder.CreateTable(
                name: "Messages",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    MessageKey = table.Column<string>(type: "TEXT", nullable: false),
                    MessagePayload = table.Column<string>(type: "TEXT", nullable: false),
                    SenderCopyKey = table.Column<string>(type: "TEXT", nullable: false),
                    SenderCopyPayload = table.Column<string>(type: "TEXT", nullable: false),
                    SenderId = table.Column<Guid>(type: "TEXT", nullable: false),
                    ReceiverId = table.Column<Guid>(type: "TEXT", nullable: false),
                    CreatedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedOn = table.Column<DateTime>(type: "TEXT", nullable: false),
                    DeletedOn = table.Column<DateTime>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Messages", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Messages_Users_ReceiverId",
                        column: x => x.ReceiverId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_Messages_Users_SenderId",
                        column: x => x.SenderId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Active", "CreatedOn", "DeletedOn", "FirstName", "LastName", "Password", "PublicKey", "Salt", "TwoFactorKey", "UpdatedOn", "Username" },
                values: new object[] { new Guid("38d82377-b3d6-4145-b273-c136e065f57e"), true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Kyle", "Orciuch", "pt5uYBTPlBOB0FPkdUADV+EXZa0NGVfpLLV1nz12QTY=", "key", "f1TMfCrv5mqRvgesXJxZDA==", "XBFPGKVHXGAC2AEHUOX6TW2VVCFT5WPZ", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "kyle" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Active", "CreatedOn", "DeletedOn", "FirstName", "LastName", "Password", "PublicKey", "Salt", "TwoFactorKey", "UpdatedOn", "Username" },
                values: new object[] { new Guid("63a43564-4c33-409d-a356-d75539368e98"), true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Marcus", "Orciuch", "eLGL40Qg6iUeWes+myszBd2PffhxlUm/AabyPUU+bY0=", "key", "HecjrZFEgdYjbRqnBUfXyg==", "XV2XSYXNWLTN75I7RYYOPHWRCJE3AYDY", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "marcus" });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "Active", "CreatedOn", "DeletedOn", "FirstName", "LastName", "Password", "PublicKey", "Salt", "TwoFactorKey", "UpdatedOn", "Username" },
                values: new object[] { new Guid("70c6700f-f48d-4621-bc1e-b6b2d7429381"), true, new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), null, "Patrick", "Mansour", "8RDm00xtXA0fJn7bvhpyjoDftXQzlaWifReqNGg/Lak=", "key", "l16coAX0dhAITQOhJcne3A==", "OUB26D5PPSKOPW6RFRKM2MHTETI2WW76", new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified), "patrick" });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "CreatedOn", "DeletedOn", "MessageKey", "MessagePayload", "ReceiverId", "SenderCopyKey", "SenderCopyPayload", "SenderId", "UpdatedOn" },
                values: new object[] { new Guid("18ee49f3-f3d9-4b72-8114-61b95b513135"), new DateTime(2021, 12, 30, 19, 24, 25, 239, DateTimeKind.Utc).AddTicks(350), null, "messageKey", "Great as well!", new Guid("38d82377-b3d6-4145-b273-c136e065f57e"), "senderKey", "Great as well!", new Guid("63a43564-4c33-409d-a356-d75539368e98"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "CreatedOn", "DeletedOn", "MessageKey", "MessagePayload", "ReceiverId", "SenderCopyKey", "SenderCopyPayload", "SenderId", "UpdatedOn" },
                values: new object[] { new Guid("741022a5-ab14-48ab-ad81-50b4eeaf8b82"), new DateTime(2021, 12, 30, 19, 23, 25, 239, DateTimeKind.Utc).AddTicks(350), null, "messageKey", "I am doing great! Hbu?", new Guid("63a43564-4c33-409d-a356-d75539368e98"), "senderKey", "I am doing great! Hbu?", new Guid("38d82377-b3d6-4145-b273-c136e065f57e"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "CreatedOn", "DeletedOn", "MessageKey", "MessagePayload", "ReceiverId", "SenderCopyKey", "SenderCopyPayload", "SenderId", "UpdatedOn" },
                values: new object[] { new Guid("84f58382-cb2c-4d96-8670-fa3cd1232ce1"), new DateTime(2021, 12, 30, 19, 23, 25, 239, DateTimeKind.Utc).AddTicks(360), null, "messageKey", "Hi marcus, how are you doing?", new Guid("63a43564-4c33-409d-a356-d75539368e98"), "senderKey", "Hi kyle, how are you doing?", new Guid("70c6700f-f48d-4621-bc1e-b6b2d7429381"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "CreatedOn", "DeletedOn", "MessageKey", "MessagePayload", "ReceiverId", "SenderCopyKey", "SenderCopyPayload", "SenderId", "UpdatedOn" },
                values: new object[] { new Guid("8d89a700-e7d8-4097-8cbd-20ae7277c222"), new DateTime(2021, 12, 30, 19, 27, 25, 239, DateTimeKind.Utc).AddTicks(370), null, "messageKey", "Great as well!", new Guid("63a43564-4c33-409d-a356-d75539368e98"), "senderKey", "Great as well!", new Guid("70c6700f-f48d-4621-bc1e-b6b2d7429381"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "CreatedOn", "DeletedOn", "MessageKey", "MessagePayload", "ReceiverId", "SenderCopyKey", "SenderCopyPayload", "SenderId", "UpdatedOn" },
                values: new object[] { new Guid("bbe988ee-d420-4085-8cb8-92046bf8733a"), new DateTime(2021, 12, 30, 19, 22, 25, 239, DateTimeKind.Utc).AddTicks(340), null, "messageKey", "Hi kyle, how are you doing?", new Guid("38d82377-b3d6-4145-b273-c136e065f57e"), "senderKey", "Hi kyle, how are you doing?", new Guid("63a43564-4c33-409d-a356-d75539368e98"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.InsertData(
                table: "Messages",
                columns: new[] { "Id", "CreatedOn", "DeletedOn", "MessageKey", "MessagePayload", "ReceiverId", "SenderCopyKey", "SenderCopyPayload", "SenderId", "UpdatedOn" },
                values: new object[] { new Guid("fbf4a654-5822-4c14-a733-858072f26d99"), new DateTime(2021, 12, 30, 19, 25, 25, 239, DateTimeKind.Utc).AddTicks(360), null, "messageKey", "I am doing great! Hbu?", new Guid("70c6700f-f48d-4621-bc1e-b6b2d7429381"), "senderKey", "I am doing great! Hbu?", new Guid("63a43564-4c33-409d-a356-d75539368e98"), new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified) });

            migrationBuilder.CreateIndex(
                name: "IX_AuthTokens_ReplacedByTokenId",
                table: "AuthTokens",
                column: "ReplacedByTokenId");

            migrationBuilder.CreateIndex(
                name: "IX_AuthTokens_UserId",
                table: "AuthTokens",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_ReceiverId",
                table: "Messages",
                column: "ReceiverId");

            migrationBuilder.CreateIndex(
                name: "IX_Messages_SenderId",
                table: "Messages",
                column: "SenderId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "AuthTokens");

            migrationBuilder.DropTable(
                name: "Messages");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
