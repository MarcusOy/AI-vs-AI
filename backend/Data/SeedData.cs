using Microsoft.EntityFrameworkCore;
using AVA.API.Helpers;
using AVA.API.Models;

namespace AVA.API.Data;

public static class SeedData
{
    public static Guid SystemUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51");
    public static ModelBuilder HasSeedData(this ModelBuilder builder)
    {
        return builder.HasExampleUsers()
            .HasGames()
            .HasStockStrategies();
    }

    private static ModelBuilder HasExampleUsers(this ModelBuilder builder)
    {
        var systemSalt = SecurityHelpers.GenerateSalt();
        var marcusSalt = SecurityHelpers.GenerateSalt();
        var kyleSalt = SecurityHelpers.GenerateSalt();

        builder.Entity<User>().HasData(
            new User
            {
                Id = SystemUserId,
                FirstName = "System",
                LastName = "User",
                Username = "system",
                Email = "marcus.orciuch@gmail.com",
                Password = SecurityHelpers.GenerateHashedPassword("!strong_password!", systemSalt.AsBytes), // TODO: make this dynamic
                Salt = systemSalt.AsString,
                Active = true
            },
            new User
            {
                Id = new Guid("47424124-8ee0-4897-a68e-66231b1b4534"),
                FirstName = "Marcus",
                LastName = "Orciuch",
                Username = "marcus",
                Email = "morciuch@purdue.edu",
                Password = SecurityHelpers.GenerateHashedPassword("password", marcusSalt.AsBytes),
                Salt = marcusSalt.AsString,
                Active = true
            },
            new User
            {
                Id = new Guid("45e74982-2aac-46d3-ad81-ce7c5a116a79"),
                FirstName = "Kyle",
                LastName = "Orciuch",
                Username = "kyle",
                Email = "korciuch@purdue.edu",
                Password = SecurityHelpers.GenerateHashedPassword("password", kyleSalt.AsBytes),
                Salt = kyleSalt.AsString,
                Active = true
            }
        );

        return builder;
    }

    private static ModelBuilder HasGames(this ModelBuilder builder)
    {
        builder.Entity<Game>().HasData(
            new Game
            {
                Id = 1,
                Name = "1234 Chess",
                ShortDescription = "To be populated by Initialization Service.",
            },
            new Game
            {
                Id = 2,
                Name = "Checkers",
                ShortDescription = "To be populated by Initialization Service.",
            },
            new Game
            {
                Id = 3,
                Name = "Chess",
                ShortDescription = "To be populated by Initialization Service.",
            }

        );
        return builder;
    }

    private static ModelBuilder HasStockStrategies(this ModelBuilder builder)
    {
        builder.Entity<Strategy>().HasData(
            new Strategy
            {
                Id = new Guid("27961240-5173-4a3d-860e-d4f2b236d35c"),
                Name = "Stock Easy AI (Java)",
                GameId = 1,
                Status = StrategyStatus.Active,
                SourceCode = null,
                CreatedByUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"), // system user
            },
            new Strategy
            {
                Id = new Guid("ff567412-30a5-444c-9ff8-437eda8a73a7"),
                Name = "Stock Medium AI (Java)",
                GameId = 1,
                Status = StrategyStatus.Active,
                SourceCode = null,
                CreatedByUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"), // system user
            },
            new Strategy
            {
                Id = new Guid("ecce68c3-9ce0-466c-a7b5-5bf7affd5189"),
                Name = "Stock Hard AI (Java)",
                GameId = 1,
                Status = StrategyStatus.Active,
                SourceCode = null,
                CreatedByUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"), // system user
            }
        );

        return builder;
    }
}