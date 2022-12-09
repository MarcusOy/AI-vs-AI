using AVA.API.Data;
using AVA.API.Models;
using AVA.API.Services;
using DocParser;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using TypeGen.Core.TypeAnnotations;

namespace AVA.API.Controllers;

public class StarterCodeController : Controller
{
    private readonly AVADbContext _dbContext;
    private readonly IStarterCodeService _starterCodeService;

    public StarterCodeController(AVADbContext dbContext,
                                 IStarterCodeService starterCodeService)
    {
        _dbContext = dbContext;
        _starterCodeService = starterCodeService;
    }
    [HttpGet, Route("/StarterCode/{id}/{language}"), Authorize]
    public GameStarterCode Get(string id, string language)
        => _starterCodeService.Get(id, language);

    [ExportTsInterface]
    public class GameStarterCode
    {
        [TsOptional]
        public string HelperCode { get; set; }

        [TsOptional]
        public string Boilerplate { get; set; }

        [TsOptional]
        public List<FunctionDocumentation> Documentation { get; set; }
    }

    [ExportTsInterface]
    public class FunctionDocumentation
    {
        [TsOptional]
        public string Name { get; set; }
        [TsOptional]
        public string Description { get; set; }
        [TsOptional]
        public List<FunctionParameter> Parameters { get; set; }
        [TsOptional]
        public FunctionParameter Return { get; set; }
        [TsOptional]
        public string Body { get; set; }
    }

    [ExportTsInterface]
    public class FunctionParameter
    {
        [TsOptional]
        public string Name { get; set; }
        [TsOptional]
        public string Description { get; set; }
        [TsOptional]
        public string Type { get; set; }
    }


}