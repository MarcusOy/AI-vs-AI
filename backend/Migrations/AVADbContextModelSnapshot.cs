﻿// <auto-generated />
using System;
using AVA.API.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;

#nullable disable

namespace AVA.Migrations
{
    [DbContext(typeof(AVADbContext))]
    partial class AVADbContextModelSnapshot : ModelSnapshot
    {
        protected override void BuildModel(ModelBuilder modelBuilder)
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

                    b.Property<string>("AttackerStrategySnapshot")
                        .HasColumnType("longtext");

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

                    b.Property<string>("DefendingStrategySnapshot")
                        .HasColumnType("longtext");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("IsTestSubmission")
                        .HasColumnType("tinyint(1)");

                    b.Property<int>("Iterations")
                        .HasColumnType("int");

                    b.Property<string>("Name")
                        .IsRequired()
                        .HasMaxLength(100)
                        .HasColumnType("varchar(100)");

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

                    b.Property<int>("AttackerPawnsLeft")
                        .HasColumnType("int");

                    b.Property<int>("AttackerPiecesLeft")
                        .HasColumnType("int");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<int>("DefenderPawnsLeft")
                        .HasColumnType("int");

                    b.Property<int>("DefenderPiecesLeft")
                        .HasColumnType("int");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<bool>("DidAttackerWin")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("FinalBoard")
                        .HasColumnType("longtext");

                    b.Property<bool>("IsAttackerWhite")
                        .HasColumnType("tinyint(1)");

                    b.Property<string>("StackTrace")
                        .HasColumnType("longtext");

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
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Name = "1234 Chess",
                            ShortDescription = "To be populated by Initialization Service.",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 2,
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Name = "Checkers",
                            ShortDescription = "To be populated by Initialization Service.",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        },
                        new
                        {
                            Id = 3,
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Name = "Chess",
                            ShortDescription = "To be populated by Initialization Service.",
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified)
                        });
                });

            modelBuilder.Entity("AVA.API.Models.StarterCode", b =>
                {
                    b.Property<int>("GameId")
                        .HasColumnType("int");

                    b.Property<int>("Type")
                        .HasColumnType("int");

                    b.Property<int>("Language")
                        .HasColumnType("int");

                    b.Property<string>("Code")
                        .HasColumnType("longtext");

                    b.Property<DateTime>("CreatedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime?>("DeletedOn")
                        .HasColumnType("datetime(6)");

                    b.Property<DateTime>("UpdatedOn")
                        .HasColumnType("datetime(6)");

                    b.HasKey("GameId", "Type", "Language");

                    b.ToTable("StarterCode");
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

                    b.Property<int>("Language")
                        .HasColumnType("int");

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

                    b.HasData(
                        new
                        {
                            Id = new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"),
                            CreatedByUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            GameId = 1,
                            IsPrivate = false,
                            Language = 0,
                            Name = "Stock Easy AI (Java)",
                            Status = 1,
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Version = 0
                        },
                        new
                        {
                            Id = new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7"),
                            CreatedByUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            GameId = 1,
                            IsPrivate = false,
                            Language = 0,
                            Name = "Stock Medium AI (Java)",
                            Status = 1,
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Version = 0
                        },
                        new
                        {
                            Id = new Guid("ecce68c3-9ce0-466c-a7b5-5bf7affd5189"),
                            CreatedByUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
                            CreatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            GameId = 1,
                            IsPrivate = false,
                            Language = 0,
                            Name = "Stock Hard AI (Java)",
                            Status = 1,
                            UpdatedOn = new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified),
                            Version = 0
                        });
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
                            Password = "YjasCROT8HzlSoRBIQN5wlieAW2fg/lvCTuVOX9E6vo=",
                            Salt = "ky+fPO3g//LlBkCBFgLMdA==",
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
                            Password = "NYGUpmbuttfQdsPdYFPFkL60ZIwa7VWYqSe+uPn/8ks=",
                            Salt = "NKVAn2IO+gPFQaZw59rpZg==",
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
                            Password = "RHE5rbS5JaInIi/Jrds2uwd4NRUECvmBPtfjx+1J2G4=",
                            Salt = "UEUtg/ImhiAkyQt0+qiZLQ==",
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

            modelBuilder.Entity("AVA.API.Models.StarterCode", b =>
                {
                    b.HasOne("AVA.API.Models.Game", "Game")
                        .WithMany("StarterCode")
                        .HasForeignKey("GameId")
                        .OnDelete(DeleteBehavior.Cascade)
                        .IsRequired();

                    b.Navigation("Game");
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
                    b.Navigation("StarterCode");

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
