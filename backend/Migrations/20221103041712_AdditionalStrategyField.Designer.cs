﻿// <auto-generated />
using System;
using AVA.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AVA.Migrations
{
    [DbContext(typeof(AVADbContext))]
    [Migration("20221103041712_AdditionalStrategyField")]
    partial class AdditionalStrategyField
    {
        protected override void BuildTargetModel(ModelBuilder modelBuilder)
        {
#pragma warning disable 612, 618
            modelBuilder
                .HasAnnotation("ProductVersion", "6.0.7")
                .HasAnnotation("Relational:MaxIdentifierLength", 64);

            modelBuilder.Entity("AVA.API.Models.AuthToken", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("ExpiresOn")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid?>("ReplacedByTokenId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime?>("RevokedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Token")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Type")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<Guid>("UserId")
                        .HasColumnType("char(36)");

                    b.HasKey("Id");

                    b.HasIndex("ReplacedByTokenId");

                    b.HasIndex("UserId");

                    b.ToTable("AuthTokens");
                });

            modelBuilder.Entity("AVA.API.Models.Battle", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<int>("AttackerWins")
                        .HasColumnType("int");

                    b.Property<Guid>("AttackingStrategyId")
                        .HasColumnType("char(36)");

                    b.Property<int>("BattleStatus")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("DefenderWins")
                        .HasColumnType("int");

                    b.Property<Guid>("DefendingStrategyId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Iterations")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("StackTrace")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("AttackingStrategyId");

                    b.HasIndex("DefendingStrategyId");

                    b.ToTable("Battles");
                });

            modelBuilder.Entity("AVA.API.Models.BattleGame", b =>
                {
                    b.Property<Guid>("BattleId")
                        .HasColumnType("char(36)");

                    b.Property<int>("GameNumber")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("DidAttackerWin")
                        .HasColumnType("tinyint(1)");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.HasKey("BattleId", "GameNumber");

                    b.ToTable("BattleGames");
                });

            modelBuilder.Entity("AVA.API.Models.BugReport", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("CreatedByUserId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Description")
                        .IsRequired()
                        .HasMaxLength(5000)
                        .HasColumnType("varchar(5000)");

                    b.Property<string>("Regarding")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.HasIndex("CreatedByUserId");

                    b.ToTable("BugReports");
                });

            modelBuilder.Entity("AVA.API.Models.Game", b =>
                {
                    b.Property<int>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("int");

                    b.Property<string>("BoilerplateCode")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("LongDescription")
                        .HasMaxLength(2000)
                        .HasColumnType("varchar(2000)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("ShortDescription")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.HasKey("Id");

                    b.ToTable("Games");

                    b.HasData(
                        new
                        {
                            Id = 1,
                            BoilerplateCode = "\r\n                    const step(state, actions) => {\r\n                        return null;\r\n                    }\r\n\r\n                    export default step;\r\n                ",
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            LongDescription = "\r\nThe goal of this game is to advance a 1-piece past your opponent’s last rank (equivalently, if you start your turn with a 1-piece at the opponent’s end of the board, you win), or capture all of your opponent’s 1-pieces\r\nThe game is played on a 10x10 board. The starting configuration of pieces is as follows:\r\nThis is player 1’s pieces from player 1’s POV. Player 2 has the same pieces (lower left corner is a 3)\r\nAn N-piece moves exactly N squares in any direction, horizontally, vertically, or diagonally. 2, 3, and 4-pieces may jump over any number of friendly or enemy pieces\r\nCaptures occur when a piece lands on an enemy piece. The lower ranked piece is removed. If both have the same rank, both are removed. Yes, you can suicide your own piece as a move.\r\n                ",
                            Name = "1234 Chess",
                            ShortDescription = "Advance a 1-piece past your opponent's last rank.",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2,
                            BoilerplateCode = "\r\n                    const step(state, actions) => {\r\n                        return null;\r\n                    }\r\n\r\n                    export default step;\r\n                ",
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            LongDescription = "\r\nCheckers is a board game played between two people on an 8x8 checked board.\r\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \r\nBlah blah blah\r\n                ",
                            Name = "Checkers",
                            ShortDescription = "Eliminate all of your opponents pieces by jumping over them.",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 3,
                            BoilerplateCode = "\r\n                    const step(state, actions) => {\r\n                        return null;\r\n                    }\r\n\r\n                    export default step;\r\n                ",
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            DeletedOn = new DateTime(2022, 11, 3, 4, 17, 12, 576, DateTimeKind.Utc).AddTicks(7860),
                            LongDescription = "\r\nChess is a board game played between two people on an 8x8 checked board like the one shown below.\r\nEach player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. \r\nBlah blah blah\r\n                ",
                            Name = "Chess",
                            ShortDescription = "Eliminate all of your opponents pieces by jumping over them.",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        });
                });

            modelBuilder.Entity("AVA.API.Models.Strategy", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<Guid>("CreatedByUserId")
                        .HasColumnType("char(36)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("GameId")
                        .HasColumnType("int");

                    b.Property<bool>("IsPrivate")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("SourceCode")
                        .HasColumnType("longtext");

                    b.Property<int>("Status")
                        .HasColumnType("int");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("Version")
                        .HasColumnType("int");

                    b.HasKey("Id");

                    b.HasIndex("CreatedByUserId");

                    b.HasIndex("GameId");

                    b.ToTable("Strategies");
                });

            modelBuilder.Entity("AVA.API.Models.Turn", b =>
                {
                    b.Property<Guid>("BattleId")
                        .HasColumnType("char(36)");

                    b.Property<int>("BattleGameNumber")
                        .HasColumnType("int");

                    b.Property<int>("TurnNumber")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsAttackTurn")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("TurnData")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.HasKey("BattleId", "BattleGameNumber", "TurnNumber");

                    b.ToTable("Turns");
                });

            modelBuilder.Entity("AVA.API.Models.User", b =>
                {
                    b.Property<Guid>("Id")
                        .ValueGeneratedOnAdd()
                        .HasColumnType("char(36)");

                    b.Property<bool>("Active")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("Bio")
                        .HasMaxLength(2000)
                        .HasColumnType("varchar(2000)");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Email")
                        .IsRequired()
                        .HasMaxLength(254)
                        .HasColumnType("varchar(254)");

                    b.Property<int?>("FavoriteGameId")
                        .HasColumnType("int");

                    b.Property<string>("FirstName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("LastName")
                        .IsRequired()
                        .HasMaxLength(50)
                        .HasColumnType("varchar(50)");

                    b.Property<string>("Password")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<string>("Salt")
                        .IsRequired()
                        .HasColumnType("longtext");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<string>("Username")
                        .IsRequired()
                        .HasMaxLength(15)
                        .HasColumnType("varchar(15)");

                    b.HasKey("Id");

                    b.HasIndex("FavoriteGameId");

                    b.ToTable("Users");

                    b.HasData(
                        new
                        {
                            Id = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                            Active = true,
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "marcus.orciuch@gmail.com",
                            FirstName = "System",
                            LastName = "User",
                            Password = "IKM5JJOKXl9KWlEfBENfhnf5XmQc+oxermUY7eFhRuE=",
                            Salt = "i0VO3wHJytqUsJOCpATnEQ==",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Username = "system"
                        },
                        new
                        {
                            Id = new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                            Active = true,
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "morciuch@purdue.edu",
                            FirstName = "Marcus",
                            LastName = "Orciuch",
                            Password = "WyLM6aC8b1lDEYKcxG5W7J5xDnngfkKByJ7T3S0xG1I=",
                            Salt = "/8QRer8+sF/grcVkear+nw==",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Username = "marcus"
                        },
                        new
                        {
                            Id = new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                            Active = true,
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Email = "korciuch@purdue.edu",
                            FirstName = "Kyle",
                            LastName = "Orciuch",
                            Password = "PJ1u6maNbtZ4cxaNICnmcLHeNJ3uQLAzfe6MoNBbWeo=",
                            Salt = "xzuXuFgxyjoAbY6aQ0LNcg==",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Username = "kyle"
                        });
                });

            modelBuilder.Entity("AVA.API.Models.AuthToken", b =>
                {
                    b.HasOne("AVA.API.Models.AuthToken", "ReplacedByToken")
                        .WithMany()
                        .HasForeignKey("ReplacedByTokenId");

                    b.HasOne("AVA.API.Models.User", "User")
                        .WithMany("Tokens")
                        .HasForeignKey("UserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("ReplacedByToken");

                    b.Navigation("User");
                });

            modelBuilder.Entity("AVA.API.Models.Battle", b =>
                {
                    b.HasOne("AVA.API.Models.Strategy", "AttackingStrategy")
                        .WithMany("AttackerBattles")
                        .HasForeignKey("AttackingStrategyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("AVA.API.Models.Strategy", "DefendingStrategy")
                        .WithMany("DefenderBattles")
                        .HasForeignKey("DefendingStrategyId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("AttackingStrategy");

                    b.Navigation("DefendingStrategy");
                });

            modelBuilder.Entity("AVA.API.Models.BattleGame", b =>
                {
                    b.HasOne("AVA.API.Models.Battle", "Battle")
                        .WithMany("BattleGames")
                        .HasForeignKey("BattleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Battle");
                });

            modelBuilder.Entity("AVA.API.Models.BugReport", b =>
                {
                    b.HasOne("AVA.API.Models.User", "CreatedByUser")
                        .WithMany("BugReports")
                        .HasForeignKey("CreatedByUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CreatedByUser");
                });

            modelBuilder.Entity("AVA.API.Models.Strategy", b =>
                {
                    b.HasOne("AVA.API.Models.User", "CreatedByUser")
                        .WithMany("Strategies")
                        .HasForeignKey("CreatedByUserId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("AVA.API.Models.Game", "Game")
                        .WithMany("Strategies")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("CreatedByUser");

                    b.Navigation("Game");
                });

            modelBuilder.Entity("AVA.API.Models.Turn", b =>
                {
                    b.HasOne("AVA.API.Models.Battle", "Battle")
                        .WithMany()
                        .HasForeignKey("BattleId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.HasOne("AVA.API.Models.BattleGame", "BattleGame")
                        .WithMany("Turns")
                        .HasForeignKey("BattleId", "BattleGameNumber")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Battle");

                    b.Navigation("BattleGame");
                });

            modelBuilder.Entity("AVA.API.Models.User", b =>
                {
                    b.HasOne("AVA.API.Models.Game", "FavoriteGame")
                        .WithMany("UsersWhoFavorited")
                        .HasForeignKey("FavoriteGameId");

                    b.Navigation("FavoriteGame");
                });

            modelBuilder.Entity("AVA.API.Models.Battle", b =>
                {
                    b.Navigation("BattleGames");
                });

            modelBuilder.Entity("AVA.API.Models.BattleGame", b =>
                {
                    b.Navigation("Turns");
                });

            modelBuilder.Entity("AVA.API.Models.Game", b =>
                {
                    b.Navigation("Strategies");

                    b.Navigation("UsersWhoFavorited");
                });

            modelBuilder.Entity("AVA.API.Models.Strategy", b =>
                {
                    b.Navigation("AttackerBattles");

                    b.Navigation("DefenderBattles");
                });

            modelBuilder.Entity("AVA.API.Models.User", b =>
                {
                    b.Navigation("BugReports");

                    b.Navigation("Strategies");

                    b.Navigation("Tokens");
                });
#pragma warning restore 612, 618
        }
    }
}
