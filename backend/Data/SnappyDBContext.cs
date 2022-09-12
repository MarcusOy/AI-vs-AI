using System.Text.Json.Serialization;
using Microsoft.EntityFrameworkCore;
using Snappy.API.Models;

namespace Snappy.API.Data;

public class SnappyDBContext : DbContext
{
    public DbSet<User> Users { get; set; }
    public DbSet<AuthToken> AuthTokens { get; set; }
    public DbSet<Message> Messages { get; set; }

    public string DbPath { get; }

    public SnappyDBContext(DbContextOptions<SnappyDBContext> options)
    : base(options)
    { }

    protected override void OnModelCreating(ModelBuilder builder)
    {
        builder.Entity<User>()
            .HasMany(u => u.MessagesSent)
            .WithOne(m => m.Sender)
            .HasForeignKey(m => m.SenderId);
        builder.Entity<User>()
            .HasMany(u => u.MessagesReceived)
            .WithOne(m => m.Receiver)
            .HasForeignKey(m => m.ReceiverId);
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