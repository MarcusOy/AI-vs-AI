using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using DocParser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AVA.API.Controllers;

public class StarterCodeController : Controller
{
    private readonly AVADbContext _dbContext;

    public StarterCodeController(AVADbContext dbContext)
    {
        _dbContext = dbContext;
    }
    [HttpGet, Route("/StarterCode/{id}/{language}"), Authorize]
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

        if (helper is not null)
        {
            var js = new JSDocParser();
            js.LoadText(helper.Code);
            var parsed = js.Parse(includeComments: true);
        }

        return new GameStarterCode
        {
            HelperCode = helper is not null ? helper.Code : null,
            Boilerplate = boilerplate is not null ? boilerplate.Code : null,
        };
    }

    public class GameStarterCode
    {
        public string HelperCode { get; set; }
        public string Boilerplate { get; set; }
        public List<FunctionDocumentation> Documentation { get; set; }
    }

    public class FunctionDocumentation
    {
        public string FunctionName { get; set; }
        public string FunctionDescription { get; set; }
    }
}