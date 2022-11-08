using Microsoft.EntityFrameworkCore;
using AVA.API.Data;
using AVA.API.Models;

namespace AVA.API.Services
{
    public interface IBugsService
    {
        List<BugReport> GetAll();
        BugReport Get(Guid id);
        Task<BugReport> CreateAsync(BugReport bugReport);
        Task<BugReport> DeleteAsync(Guid id);
    }

    public class BugsService : IBugsService
    {
        private readonly AVADbContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly ILogger<BugsService> _logger;

        public BugsService(AVADbContext dbContext,
                            IIdentityService identityService,
                            ILogger<BugsService> logger)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _logger = logger;
        }

        public List<BugReport> GetAll()
        {
            return _dbContext.BugReports
                .ToList();
        }

        public BugReport Get(Guid id)
        {
            BugReport b = _dbContext.BugReports
                .Include(b => b.CreatedByUser)
               .FirstOrDefault(b => b.Id == id);

            if (b is null)
                throw new InvalidOperationException($"BugReport id [{id}] not valid.");

            return b;
        }

        public async Task<BugReport> CreateAsync(BugReport bugReport)
        {
            // don't trust these fields
            bugReport.CreatedByUser = null;
            bugReport.CreatedByUserId = _identityService.CurrentUser.Id;

            await _dbContext.BugReports.AddAsync(bugReport);
            await _dbContext.SaveChangesAsync();

            return bugReport;
        }

        public async Task<BugReport> DeleteAsync(Guid id)
        {
            BugReport g = Get(id);

            _dbContext.Remove(g);
            await _dbContext.SaveChangesAsync();

            return g;
        }
    }
}
