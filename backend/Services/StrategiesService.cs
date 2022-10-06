using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;

namespace AVA.API.Services
{
    public interface IStrategiesService
    {
        List<Strategy> GetAll();
        Strategy Get(Guid id);
        string GetStockStategyCode(string strategyName);
        Task<Strategy> CreateAsync(Strategy strategy);
        Task<Strategy> UpdateAsync(Strategy strategy);
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
               .FirstOrDefault(s => s.Id == id);

            if (s is null)
                throw new InvalidOperationException($"Strategy id [{id}] not valid.");

            return s;
        }

        // assumes that we are reserving certain names as prototype names
        public string GetStockStategyCode(string strategyName)
        {
            Strategy s = _dbContext.Strategies
               .FirstOrDefault(s => s.Name == strategyName);

            if (s is null)
                throw new InvalidOperationException($"Stock Strategy name [{strategyName}] not valid.");

            return s.SourceCode;
        }

        public async Task<Strategy> CreateAsync(Strategy strategy)
        {
            await _dbContext.AddAsync(strategy);
            await _dbContext.SaveChangesAsync();

            return strategy;
        }

        public async Task<Strategy> UpdateAsync(Strategy strategy)
        {
            _dbContext.Update(strategy);
            await _dbContext.SaveChangesAsync();

            return strategy;
        }

        public async Task<Strategy> DeleteAsync(Guid id)
        {
            Strategy g = Get(id);

            _dbContext.Remove(g);
            await _dbContext.SaveChangesAsync();

            return g;
        }
    }
}
