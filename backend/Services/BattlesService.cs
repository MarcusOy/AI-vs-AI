using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;
using static AVA.API.Services.BattlesService;

namespace AVA.API.Services
{
    public interface IBattlesService
    {
        Battle Get(Guid id);
        Task<List<Battle>> GetAsync(GetBattlesParameters p);
        Task<BattleGame> GetBattleGameAsync(Guid battleId, int gameId);
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

        public async Task<List<Battle>> GetAsync(GetBattlesParameters p)
        {
            var q = _dbContext.Battles
                .Include(b => b.AttackingStrategy)
                .Include(b => b.DefendingStrategy)
                .Include(b => b.BattleGames)
                .OrderByDescending(b => b.UpdatedOn);

            if (p.UserId is not null)
            {
                if (p.CombatantType == CombatantType.Both)
                    q.Where(b => b.AttackingStrategy.CreatedByUserId == p.UserId
                              || b.DefendingStrategy.CreatedByUserId == p.UserId);
                else if (p.CombatantType == CombatantType.Attacker)
                    q.Where(b => b.AttackingStrategy.CreatedByUserId == p.UserId);
                else if (p.CombatantType == CombatantType.Defender)
                    q.Where(b => b.DefendingStrategy.CreatedByUserId == p.UserId);
            }

            if (p.StrategyId is not null)
            {
                if (p.CombatantType == CombatantType.Both)
                    q.Where(b => b.AttackingStrategy.Id == p.StrategyId
                              || b.DefendingStrategy.Id == p.StrategyId);
                else if (p.CombatantType == CombatantType.Attacker)
                    q.Where(b => b.AttackingStrategy.Id == p.StrategyId);
                else if (p.CombatantType == CombatantType.Defender)
                    q.Where(b => b.DefendingStrategy.Id == p.StrategyId);
            }

            return await q.ToListAsync();
        }

        public async Task<BattleGame> GetBattleGameAsync(Guid battleId, int gameNumber)
        {
            var g = await _dbContext.BattleGames
                .Include(g => g.Turns)
                .Where(g => g.BattleId == battleId)
                .FirstOrDefaultAsync(g => g.GameNumber == gameNumber);

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

        public class GetBattlesParameters
        {
            public Guid? StrategyId { get; set; }
            public Guid? UserId { get; set; }
            public CombatantType CombatantType { get; set; }
        }
        public enum CombatantType
        {
            Both = 0,
            Attacker = 1,
            Defender = 2,
        }
    }
}