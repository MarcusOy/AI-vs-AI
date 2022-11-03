using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;

namespace AVA.API.Services
{
    public interface IStrategiesService
    {
        List<Strategy> GetAll();
        Strategy Get(Guid id);
        Strategy GetStockStrategy(int stockToChoose);
        Task<Strategy> CreateAsync(Strategy strategy);
        Task<Strategy> UpdateAsync(Strategy strategy);
        Task<Strategy> SubmitAsync(Strategy strategy);
        Task<Strategy> DeleteAsync(Guid id);
    }

    public class StrategiesService : IStrategiesService
    {
        private readonly AVADbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly ILogger<StrategiesService> _logger;

        public StrategiesService(AVADbContext dbContext,
                            IIdentityService identityService,
                            ILogger<StrategiesService> logger)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _logger = logger;
        }

        public List<Strategy> GetAll()
        {
            return _dbContext.Strategies
                .ToList();
        }

        public Strategy Get(Guid id)
        {
            Strategy s = _dbContext.Strategies
                .Include(s => s.CreatedByUser)
                .Include(s => s.Game)
                .Include(s => s.AttackerBattles)
                .Include(s => s.DefenderBattles)
               .FirstOrDefault(s => s.Id == id);

            if (s is null)
                throw new InvalidOperationException($"Strategy id [{id}] not valid.");

            return s;
        }

        // assumes that we are reserving certain names as prototype names
        // stockToChoose (-1 = EasyAI   -2 = MedAI   -3 = HardAI)
        public Strategy GetStockStrategy(int stockToChoose)
        {
            // make sure stockToChoose is within bounds
            if (stocktoChoose < -3 || stocktoChoose > -1)
            {
                throw new InvalidOperationException($"Stock Strategy [{stockToChoose}] invalid.  Must be between [-1] and [-3]. ");
            }

            // TODO hardcode GUIDS of stockAI
            const GUID EASY_AI_GUID = GUID.NewGuid();
            const GUID MED_AI_GUID = GUID.NewGuid();
            const GUID HARD_AI_GUID = GUID.NewGuid();

            GUID strategyGUID;
            string strategyName;

            if (stocktoChoose == -1)
            {
                strategyGUID = EASY_AI_GUID;
                strategyName = "EasyAI";
            }
            else if (stocktoChoose == -2)
            {
                strategyGUID = MED_AI_GUID;
                strategyName = "MedAI";
            }
            else if (stocktoChoose == -3)
            {
                strategyGUID = HARD_AI_GUID;
                strategyName = "HardAI";
            }

            Strategy s = _dbContext.Strategies
               .FirstOrDefault(s => s.id == strategyGUID);

            if (s is null)
            {
                throw new InvalidOperationException($"Stock Strategy [{strategyName}] not found in database.");
            }

            return s;
        }

        public async Task<Strategy> CreateAsync(Strategy strategy)
        {
            var game = await _dbContext.Games
                .FirstOrDefaultAsync(g => g.Id == strategy.GameId);

            if (game is null)
                throw new InvalidOperationException("Invalid game id.");

            // don't trust these fields
            strategy.CreatedByUserId = _identityService.CurrentUser.Id;
            strategy.CreatedByUser = null;
            strategy.Version = 1;
            strategy.Status = StrategyStatus.Draft;
            strategy.AttackerBattles = null;
            strategy.DefenderBattles = null;
            strategy.Game = null;

            // populate source code with starter code
            //strategy.SourceCode = game.BoilerplateCode;

            await _dbContext.Strategies.AddAsync(strategy);
            await _dbContext.SaveChangesAsync();

            return strategy;
        }

        public async Task<Strategy> UpdateAsync(Strategy strategy)
        {
            var originalStrategy = await _dbContext.Strategies
                .Where(s => s.CreatedByUserId == _identityService.CurrentUser.Id)
                .FirstOrDefaultAsync(s => s.Id == strategy.Id);

            // trust these fields
            originalStrategy.Name = strategy.Name;
            originalStrategy.SourceCode = strategy.SourceCode;
            originalStrategy.Status = AVA.API.Models.StrategyStatus.Draft;

            _dbContext.Strategies.Update(originalStrategy);
            _dbContext.Update(originalStrategy);
            await _dbContext.SaveChangesAsync();

            return originalStrategy;
        }
        public async Task<Strategy> SubmitAsync(Strategy strategy)
        {
            var originalStrategy = await _dbContext.Strategies
                .Where(s => s.CreatedByUserId == _identityService.CurrentUser.Id)
                .FirstOrDefaultAsync(s => s.Id == strategy.Id);

            // trust these fields
            originalStrategy.Name = strategy.Name;
            originalStrategy.SourceCode = strategy.SourceCode;
            originalStrategy.Status = AVA.API.Models.StrategyStatus.Active;

            _dbContext.Strategies.Update(originalStrategy);
            _dbContext.Update(originalStrategy);
            await _dbContext.SaveChangesAsync();

            return originalStrategy;
        }
        public async Task<Strategy> DeleteAsync(Guid id)
        {
            Strategy g = Get(id);

            _dbContext.Strategies.Remove(g);
            await _dbContext.SaveChangesAsync();

            return g;
        }
    }
}
