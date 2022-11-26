using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using System.Reflection;
using AVA.API.Models;
using System.Configuration;
using NuGet.Packaging;

namespace AVA.API.Services
{
    public interface IInitializationService
    {
        Task InitializeDatabase();
    }
    public class InitializationService : IInitializationService
    {
        private readonly AVADbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly ILogger<InitializationService> _logger;

        public InitializationService(AVADbContext dbContext,
                                     IIdentityService identityService,
                                     ILogger<InitializationService> logger)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _logger = logger;
        }
        public async Task InitializeDatabase()
        {
            // Database initial data checks
            using (_logger.BeginScope("AVA is checking the configured database..."))
            {
                _logger.LogInformation("AVA is checking the configured database...");
                // await Task.Delay(5000);

                // Ensure database and apply pending migrations
                _dbContext.Database.Migrate();

                // Get games and strategies from ./Data/init folder
                var (games, strategies) = await GetInitialGamesAndStrategies();

                // Ensure up-to-date database rows for each game and strategy
                await EnsureInitialGamesAndStrategies(games, strategies);

                _logger.LogInformation("Database is configured.");
            }
        }

        private async Task<(List<Game>, List<Strategy>)> GetInitialGamesAndStrategies()
        {
            var games = new List<Game>();
            var strategies = new List<Strategy>();

            // Get all games in init
            var gameFolders = Directory.GetDirectories("./Data/init/games");

            // For each game in init
            foreach (var gameDir in gameFolders)
            {
                // Create the Game object that we are mapping to
                var game = new Game();

                // Get the game id from path
                var gameIdStr = gameDir.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries)
                    .LastOrDefault();

                // Check if the id is valid
                if (!Int32.TryParse(gameIdStr, out var gameId))
                {
                    _logger.LogWarning($"The game located at {gameDir} has an invalid id. Make sure that each folder within ./init/games is an integer.");
                    continue;
                }
                game.Id = gameId;

                // Check if name is valid, then read it
                var nameFilePath = Path.Combine(gameDir, "name.txt");
                if (!File.Exists(nameFilePath))
                {
                    _logger.LogWarning($"The game located at {gameDir} has does not have a name. Make sure that each folder within ./init/games has a name.txt.");
                    continue;
                }

                game.Name = await File.ReadAllTextAsync(nameFilePath);

                // Check if short description is valid, then read it
                var shortDescriptionFilePath = Path.Combine(gameDir, "short_description.txt");
                if (!File.Exists(nameFilePath))
                {
                    _logger.LogWarning($"The game located at {gameDir} has does not have a short description. Make sure that each folder within ./init/games has a short_description.txt.");
                    continue;
                }
                game.ShortDescription = await File.ReadAllTextAsync(shortDescriptionFilePath);

                // Check if long description is valid, then read it
                var longDescriptionFilePath = Path.Combine(gameDir, "long_description.txt");
                if (!File.Exists(nameFilePath))
                {
                    _logger.LogWarning($"The game located at {gameDir} has does not have a long description. Make sure that each folder within ./init/games has a long_description.txt.");
                    continue;
                }
                game.LongDescription = await File.ReadAllTextAsync(longDescriptionFilePath);

                // Check if game has starter_code folder, then read it
                var starterCodeFolderPath = Path.Combine(gameDir, "starter_code");
                if (Directory.Exists(starterCodeFolderPath))
                {
                    var starterCode = Directory.GetFiles(starterCodeFolderPath);

                    game.StarterCode = new List<StarterCode>();

                    foreach (var file in starterCode)
                    {
                        var fileType = Path.GetFileNameWithoutExtension(file) == "helper"
                            ? StarterCodeType.Helper
                            : StarterCodeType.Boilerplate;
                        var language = Path.GetExtension(file) == ".js"
                            ? ProgrammingLanguage.JavaScript
                            : ProgrammingLanguage.TypeScript;

                        var code = await File.ReadAllTextAsync(file);

                        game.StarterCode.Add(new StarterCode
                        {
                            GameId = gameId,
                            Type = fileType,
                            Language = language,
                            Code = code
                        });
                    }
                }

                // Check if game has strategy folder, then read it
                var strategiesFolderPath = Path.Combine(gameDir, "strategies");
                if (Directory.Exists(strategiesFolderPath))
                {
                    var strategyFolders = Directory.GetDirectories(strategiesFolderPath);

                    foreach (var strategyDir in strategyFolders)
                    {
                        // Create the Strategy object that we are mapping to
                        var strategy = new Strategy
                        {
                            Status = StrategyStatus.Active,
                            Version = 1,
                            IsPrivate = false,
                            GameId = gameId,
                        };

                        // Get the strategy name from path
                        var strategyName = strategyDir.Split(Path.DirectorySeparatorChar, StringSplitOptions.RemoveEmptyEntries)
                            .LastOrDefault();
                        strategy.Name = strategyName;

                        // Check if id is valid, then read it
                        var idFilePath = Path.Combine(strategyDir, "id.txt");
                        if (!File.Exists(idFilePath))
                        {
                            _logger.LogWarning($"The strategy located at {strategyDir} has does not have an id. Make sure that this strategy has an id.txt.");
                            continue;
                        }
                        if (!Guid.TryParse(await File.ReadAllTextAsync(idFilePath), out var strategyId))
                        {
                            _logger.LogWarning($"The strategy located at {strategyDir} has does not have a valid id. Make sure that id.txt contains a Guid.");
                            continue;
                        }
                        strategy.Id = strategyId;

                        // Check if javascript file is valid, then read it
                        if (File.Exists(Path.Combine(strategyDir, "code.js")))
                        {
                            strategy.SourceCode = await File.ReadAllTextAsync(Path.Combine(strategyDir, "code.js"));
                            strategy.Language = ProgrammingLanguage.JavaScript;
                        }
                        else if (File.Exists(Path.Combine(strategyDir, "code.ts")))
                        {
                            strategy.SourceCode = await File.ReadAllTextAsync(Path.Combine(strategyDir, "code.ts"));
                            strategy.Language = ProgrammingLanguage.TypeScript;
                        }
                        if (strategy.SourceCode is null)
                        {
                            _logger.LogWarning($"The strategy located at {strategyDir} has does not have a code file. Make sure that this strategy contains a code.js or a code.ts.");
                            continue;
                        }

                        // Check if created_by file is valid, then read it
                        var createdByFilePath = Path.Combine(strategyDir, "created_by.txt");
                        if (!File.Exists(createdByFilePath))
                            strategy.CreatedByUserId = SeedData.SystemUserId;
                        else if (Guid.TryParse(await File.ReadAllTextAsync(createdByFilePath), out var createdById))
                            strategy.CreatedByUserId = createdById;
                        else
                        {
                            _logger.LogWarning($"The strategy located at {strategyDir} has does not have a valid created by user id. Make sure that created_by.txt contains a Guid.");
                            continue;
                        }

                        strategies.Add(strategy);
                    }
                }
                games.Add(game);
            }
            return (games, strategies);
        }

        private async Task EnsureInitialGamesAndStrategies(List<Game> games, List<Strategy> strategies)
        {
            var newGameIds = games.Select(g => g.Id);
            var newStrategies = strategies.Select(s => s.Id);
            var newStarterCode = games
                .Where(g => g.StarterCode is not null)
                .SelectMany(g => g.StarterCode).ToList();
            var originalGames = await _dbContext.Games
                .Where(g => newGameIds.Contains(g.Id))
                .ToListAsync();
            var originalStrategies = await _dbContext.Strategies
                .Where(g => newStrategies.Contains(g.Id))
                .ToListAsync();
            var originalStarterCodes = await _dbContext.StarterCode
                .ToListAsync();

            // Ensure games
            foreach (var game in games)
            {
                var originalGame = originalGames
                    .FirstOrDefault(g => g.Id == game.Id);

                // If the game doesn't exist in the database, just add it
                if (originalGame is null)
                {
                    _logger.LogInformation($"Game {game.Name} did not exist in database. Adding...");
                    _dbContext.Games.Add(game);
                    continue;
                }

                // If properties have changed, update in database
                if (game.Name != originalGame.Name
                 || game.ShortDescription != originalGame.ShortDescription
                 || game.LongDescription != originalGame.LongDescription)
                {
                    _logger.LogInformation($"Game {game.Name} changed. Updating...");
                    originalGame.Name = game.Name;
                    originalGame.ShortDescription = game.ShortDescription;
                    originalGame.LongDescription = game.LongDescription;
                    _dbContext.Games.Update(originalGame);
                }
            }

            // Ensure starter code
            foreach (var starterCode in newStarterCode)
            {
                var originalStarterCode = originalStarterCodes
                    .FirstOrDefault(c => c.GameId == starterCode.GameId
                        && c.Type == starterCode.Type
                        && c.Language == starterCode.Language);

                // If the starter code doesn't exist in the database, just add it
                if (originalStarterCode is null)
                {
                    _logger.LogInformation($"{starterCode.Type.ToString()} code written in {starterCode.Language.ToString()} for game id {starterCode.GameId} did not exist in database. Adding...");
                    _dbContext.StarterCode.Add(starterCode);
                    continue;
                }

                // If properties have changed, update in database
                if (starterCode.Code != originalStarterCode.Code)
                {
                    _logger.LogInformation($"{starterCode.Type.ToString()} code written in {starterCode.Language.ToString()} for game id {starterCode.GameId} changed. Updating...");
                    originalStarterCode.Code = starterCode.Code;
                    _dbContext.StarterCode.Update(originalStarterCode);
                }
            }

            // Ensure strategies
            foreach (var strategy in strategies)
            {
                var originalStrategy = originalStrategies
                    .FirstOrDefault(s => s.Id == strategy.Id);

                // If the strategy doesn't exist in the database, just add it
                if (originalStrategy is null)
                {
                    _logger.LogInformation($"Strategy {strategy.Name} did not exist in database. Adding...");
                    _dbContext.Strategies.Add(strategy);
                    continue;
                }

                // If properties have changed, update in database
                if (strategy.Name != originalStrategy.Name
                 || strategy.Language != originalStrategy.Language
                 || strategy.SourceCode != originalStrategy.SourceCode)
                {
                    _logger.LogInformation($"Strategy {strategy.Name} changed. Updating...");
                    originalStrategy.Name = strategy.Name;
                    originalStrategy.Language = strategy.Language;
                    originalStrategy.SourceCode = strategy.SourceCode;
                    _dbContext.Strategies.Update(originalStrategy);
                }
            }

            await _dbContext.SaveChangesAsync();
        }
    }
}
