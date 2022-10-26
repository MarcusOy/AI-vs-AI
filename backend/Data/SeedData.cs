using Microsoft.EntityFrameworkCore;
using AVA.API.Helpers;
using AVA.API.Models;

namespace AVA.API.Data;

public static class SeedData
{
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
                Id = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"),
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
                ShortDescription = "Advance a 1-piece past your opponent's last rank.",
                LongDescription = @"
The goal of this game is to advance a 1-piece past your opponent’s last rank (equivalently, if you start your turn with a 1-piece at the opponent’s end of the board, you win), or capture all of your opponent’s 1-pieces
The game is played on a 10x10 board. The starting configuration of pieces is as follows:
This is player 1’s pieces from player 1’s POV. Player 2 has the same pieces (lower left corner is a 3)
An N-piece moves exactly N squares in any direction, horizontally, vertically, or diagonally. 2, 3, and 4-pieces may jump over any number of friendly or enemy pieces
Captures occur when a piece lands on an enemy piece. The lower ranked piece is removed. If both have the same rank, both are removed. Yes, you can suicide your own piece as a move.
                ",
                BoilerplateCode = @"
                    const step(state, actions) => {
                        return null;
                    }

                    export default step;
                "
            },
            new Game
            {
                Id = 2,
                Name = "Checkers",
                ShortDescription = "Eliminate all of your opponents pieces by jumping over them.",
                LongDescription = @"
Checkers is a board game played between two people on an 8x8 checked board.
Each player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. 
Blah blah blah
                ",
                BoilerplateCode = @"
                    const step(state, actions) => {
                        return null;
                    }

                    export default step;
                "
            },
            new Game
            {
                Id = 3,
                Name = "Chess",
                ShortDescription = "Eliminate all of your opponents pieces by jumping over them.",
                LongDescription = @"
Chess is a board game played between two people on an 8x8 checked board like the one shown below.
Each player has 12 pieces that are like flat round disks that fit inside each of the boxes on the board. The pieces are placed on every other dark square and then staggered by rows, like shown on the board. 
Blah blah blah
                ",
                BoilerplateCode = @"
                    const step(state, actions) => {
                        return null;
                    }

                    export default step;
                ",
                DeletedOn = DateTime.UtcNow
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
                Name = "Stock Easy AI",
                GameId = 1,
                Status = StrategyStatus.Active,
                SourceCode = null,
                CreatedByUserId = new Guid("f9b1224c-c19b-474f-81ac-7666476fee51"), // system user
            }
        );

        return builder;
    }
}