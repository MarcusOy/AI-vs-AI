using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;

namespace AVA.API.Services
{
    public interface IGamesService
    {
        List<Game> GetAll();
        Game Get(int id);
        Task<Game> CreateAsync(Game game);
        Task<Game> UpdateAsync(Game game);
        Task<Game> DeleteAsync(int id);
    }

    public class GamesService : IGamesService
    {
        private readonly AVADbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly ILogger<GamesService> _logger;

        public GamesService(AVADbContext dbContext,
                            IIdentityService identityService,
                            ILogger<GamesService> logger)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _logger = logger;
        }

        public List<Game> GetAll()
        {
            return _dbContext.Games
                .ToList();
        }

        public Game Get(int id)
        {
            Game g = _dbContext.Games
                .Include(g => g.Strategies
                    .Where(s => s.CreatedByUserId == _identityService.CurrentUser.Id))
               .FirstOrDefault(g => g.Id == id);

            if (g is null)
                throw new InvalidOperationException($"Game id [{id}] not valid.");

            return g;
        }

        public async Task<Game> CreateAsync(Game game)
        {
            await _dbContext.AddAsync(game);
            await _dbContext.SaveChangesAsync();

            return game;
        }

        public async Task<Game> UpdateAsync(Game game)
        {
            _dbContext.Update(game);
            await _dbContext.SaveChangesAsync();

            return game;
        }

        public async Task<Game> DeleteAsync(int id)
        {
            Game g = Get(id);

            _dbContext.Remove(g);
            await _dbContext.SaveChangesAsync();

            return g;
        }
    }
}
