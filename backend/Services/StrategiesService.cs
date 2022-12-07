using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;

namespace AVA.API.Services
{
    public interface IStrategiesService
    {
        // List<Strategy> GetAll();
        Strategy Get(Guid id);
        Strategy GetStockStrategy(int stockToChoose);
        Task<Strategy> CreateAsync(Strategy strategy);
        Task<Strategy> UpdateAsync(Strategy strategy);
        Task<Strategy> SubmitAsync(Guid id);
        Task<Strategy> DeleteAsync(Guid id);

        String getStockName(int StockCodeInt);
        Guid getStockGuid(int StockCodeInt);
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

        // public List<Strategy> GetAll()
        // {
        //     return _dbContext.Strategies
        //         .ToList();
        // }

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

            // prevent others from seeing source code of private strategies
            if (s.CreatedByUserId != _identityService.CurrentUser.Id && s.IsPrivate)
                s.SourceCode = null;

            return s;
        }

        // assumes that we are reserving certain names as prototype names
        // stockToChoose (-1 = EasyAI   -2 = MedAI   -3 = HardAI)
        public Strategy GetStockStrategy(int stocktoChoose)
        {
            // make sure stockToChoose is within bounds
            if (stocktoChoose < -3 || stocktoChoose > -1)
            {
                throw new InvalidOperationException($"Stock Strategy [{stocktoChoose}] invalid.  Must be between [-1] and [-3]. ");
            }

            Guid strategyGUID = getStockGuid(stocktoChoose);
            string strategyName = getStockName(stocktoChoose);

            Strategy s = _dbContext.Strategies
               .FirstOrDefault(s => s.Id == strategyGUID);

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
            originalStrategy.Language = strategy.Language;
            originalStrategy.SourceCode = strategy.SourceCode;
            originalStrategy.Status = AVA.API.Models.StrategyStatus.Draft;
            originalStrategy.IsPrivate = strategy.IsPrivate;

            _dbContext.Strategies.Update(originalStrategy);
            await _dbContext.SaveChangesAsync();

            return originalStrategy;
        }
        public async Task<Strategy> SubmitAsync(Guid strategyId)
        {
            var originalStrategy = await _dbContext.Strategies
                .Where(s => s.CreatedByUserId == _identityService.CurrentUser.Id)
                .FirstOrDefaultAsync(s => s.Id == strategyId);

            // set strategy to active
            originalStrategy.Status = AVA.API.Models.StrategyStatus.Active;

            _dbContext.Strategies.Update(originalStrategy);
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

        // converts an integer StockCodeInt to the corresponding name of the stock AI
        public string getStockName(int stockCodeInt)
        {
            if (stockCodeInt == -1)
                return "Easy AI";
            else if (stockCodeInt == -2)
                return "Medium AI";
            else if (stockCodeInt == -3)
                return "Hard AI";
            else
                return "INVALID STOCK";
        }

        // converts an integer StockCodeInt to the corresponding Guid of the stock AI in the database
        public Guid getStockGuid(int stockCodeInt)
        {
            // TODO hardcode GUIDS of stockAI
            Guid EASY_AI_GUID = Guid.Empty;
            Guid MED_AI_GUID = Guid.Empty;
            Guid HARD_AI_GUID = Guid.Empty;

            if (stockCodeInt == -1)
                return EASY_AI_GUID;
            else if (stockCodeInt == -2)
                return MED_AI_GUID;
            else if (stockCodeInt == -3)
                return HARD_AI_GUID;
            else
                return Guid.Empty;
        }
    }
}
