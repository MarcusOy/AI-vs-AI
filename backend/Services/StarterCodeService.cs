using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;
using static AVA.API.Controllers.StarterCodeController;
using DocParser;
using AVA.API.Helpers;

namespace AVA.API.Services
{
    public interface IStarterCodeService
    {
        GameStarterCode Get(string id, string language);
    }

    public class StarterCodeService : IStarterCodeService
    {
        private readonly AVADbContext _dbContext;
        private readonly ILogger<StarterCodeService> _logger;

        public StarterCodeService(AVADbContext dbContext,
                            ILogger<StarterCodeService> logger)
        {
            _dbContext = dbContext;
            _logger = logger;
        }

        public GameStarterCode Get(string id, string language)
        {
            if (!Int32.TryParse(id, out var gameId))
                throw new InvalidOperationException("Must use an integer for the game id.");

            if (!Enum.TryParse(typeof(ProgrammingLanguage), language, true, out var l))
                throw new InvalidOperationException("Language must be either JavaScript or TypeScript");

            var starterCode = _dbContext.StarterCode
                .Where(c => c.GameId == gameId)
                .Where(c => c.Language == (ProgrammingLanguage)l)
                .ToList();

            if (starterCode.Count <= 0)
                throw new InvalidOperationException("No starter code for this game + language.");

            var helper = starterCode
                .FirstOrDefault(c => c.Type == StarterCodeType.Helper);
            var boilerplate = starterCode
                .FirstOrDefault(c => c.Type == StarterCodeType.Boilerplate);
            var docs = new List<FunctionDocumentation>();

            if (helper is not null)
            {
                var js = new JSDocParser();
                js.LoadText(helper.Code);
                var parsed = js.Parse()
                    .ExtractImplementations(helper.Code);

                docs = parsed.Functions.Select(f => new FunctionDocumentation
                {
                    Name = f.Name,
                    Description = f.Description,
                    Parameters = f.Parameters is not null
                        ? f.Parameters.Select(p => new FunctionParameter
                        {
                            Name = p.Name,
                            Description = p.Description,
                            Type = p.Type
                        }).ToList() : new List<FunctionParameter>(),
                    Return = f.Returns is not null
                        ? new FunctionParameter
                        {
                            Name = f.Returns.Name,
                            Description = f.Returns.Description,
                            Type = f.Returns.Type
                        } : null,
                    Body = f.Snippet
                }).ToList();
            }

            return new GameStarterCode
            {
                HelperCode = helper is not null ? helper.Code : null,
                Boilerplate = boilerplate is not null ? boilerplate.Code : null,
                Documentation = docs
            };
        }


    }
}
