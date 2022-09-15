using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using AVA.API.Models;

namespace AVA.API.Data;

public class AVADbContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<AuthToken> AuthTokens { get; set; }
    public DbSet<Game> Games { get; set; }
    public DbSet<Strategy> Strategies { get; set; }
    public DbSet<Battle> Battles { get; set; }
    public DbSet<BattleGame> BattleGames { get; set; }
    public DbSet<Turn> Turns { get; set; }
    public DbSet<BugReport> BugReports { get; set; }
    public string DbPath { get; }

    public AVADbContext(DbContextOptions<AVADbContext> options)
    : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        // Ensure seed data
        builder.HasSeedData();
    }

    public override int SaveChanges(bool acceptAllChangesOnSuccess)
    {
        OnBeforeSaving();
        return base.SaveChanges(acceptAllChangesOnSuccess);
    }

    public override async Task<int> SaveChangesAsync(
       bool acceptAllChangesOnSuccess,
       CancellationToken cancellationToken = default(CancellationToken)
    )
    {
        OnBeforeSaving();
        return (await base.SaveChangesAsync(acceptAllChangesOnSuccess,
                      cancellationToken));
    }

    private void OnBeforeSaving()
    {
        var entries = ChangeTracker.Entries();
        var utcNow = DateTime.UtcNow;

        foreach (var entry in entries)
        {
            // for entities that inherit from BaseEntity,
            // set UpdatedOn / CreatedOn appropriately
            if (entry.Entity is BaseEntity trackable)
            {
                switch (entry.State)
                {
                    case EntityState.Modified:
                        // set the updated date to "now"
                        trackable.UpdatedOn = utcNow;

                        // mark property as "don't touch"
                        // we don't want to update on a Modify operation
                        entry.Property("CreatedOn").IsModified = false;
                        break;

                    case EntityState.Added:
                        // set both updated and created date to "now"
                        trackable.CreatedOn = utcNow;
                        trackable.UpdatedOn = utcNow;
                        break;
                }
            }
        }
    }
}