using Microsoft.EntityFrameworkCore;
using AVA.API.Helpers;
using AVA.API.Models;

namespace AVA.API.Data;

public static class SeedData
{
    public static ModelBuilder HasSeedData(this ModelBuilder builder)
    {
        return builder.HasExampleUsers();
    }

    private static ModelBuilder HasExampleUsers(this ModelBuilder builder)
    {
        var marcusId = Guid.NewGuid();
        var marcusSalt = SecurityHelpers.GenerateSalt();
        var kyleId = Guid.NewGuid();
        var kyleSalt = SecurityHelpers.GenerateSalt();
        builder.Entity<User>().HasData(
            new User
            {
                Id = marcusId,
                FirstName = "Marcus",
                LastName = "Orciuch",
                Username = "marcus",
                Password = SecurityHelpers.GenerateHashedPassword("password", marcusSalt.AsBytes),
                Salt = marcusSalt.AsString,
                Active = true
            },
            new User
            {
                Id = kyleId,
                FirstName = "Kyle",
                LastName = "Orciuch",
                Username = "kyle",
                Password = SecurityHelpers.GenerateHashedPassword("password", kyleSalt.AsBytes),
                Salt = kyleSalt.AsString,
                Active = true
            }
        );

        return builder;
    }
}