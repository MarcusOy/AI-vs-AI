using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;

namespace AVA.API.Services
{
    public interface IBattlesService
    {
        Battle Get(Guid id);
        BattleGame GetBattleGame(Guid battleId, int gameId);

        Task<Battle> CreateAsync(Battle battle);
    }

    public class BattlesService : IBattlesService
    {
        private readonly AVADbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly ILogger<BattlesService> _logger;

        public BattlesService(AVADbContext dbContext,
                            IIdentityService identityService,
                            ILogger<BattlesService> logger)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _logger = logger;
        }

        public Battle Get(Guid id)
        {
            Battle b = _dbContext.Battles
                .Include(b => b.AttackingStrategy)
                .Include(b => b.DefendingStrategy)
                .Include(b => b.BattleGames)
               .FirstOrDefault(s => s.Id == id);

            if (b is null)
                throw new InvalidOperationException($"Battle id [{id}] not valid.");

            return b;
        }

        public BattleGame GetBattleGame(Guid battleId, int gameNumber)
        {
            var g = _dbContext.BattleGames
                .Include(g => g.Turns)
                .Where(g => g.BattleId == battleId)
                .FirstOrDefault(g => g.GameNumber == gameNumber);

            if (g is null)
                throw new InvalidOperationException($"Battle game number [{gameNumber}] within battle id [{battleId}] not valid.");

            return g;
        }

        public async Task<Battle> CreateAsync(Battle battle)
        {
            await _dbContext.AddAsync(battle);
            await _dbContext.SaveChangesAsync();

            return battle;
        }
    }
}