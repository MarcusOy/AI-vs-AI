using Microsoft.EntityFrameworkCore;
using Snappy.API.Data;

namespace Snappy.API.Services
{
    public interface IInitializationService
    {
        public void InitializeDatabase();
    }
    public class InitializationService : IInitializationService
    {
        private readonly SnappyDBContext _dbContext;
        private readonly IIdentityService _identityService;
        private readonly ITwoFactorService _twoFactorService;
        private readonly ILogger<InitializationService> _logger;

        public InitializationService(SnappyDBContext dbContext,
                                     IIdentityService identityService,
                                     ILogger<InitializationService> logger,
                                     ITwoFactorService twoFactorService)
        {
            _dbContext = dbContext;
            _identityService = identityService;
            _logger = logger;
            _twoFactorService = twoFactorService;
        }
        public void InitializeDatabase()
        {
            // Database initial data checks
            using (_logger.BeginScope("Snappy is checking the configured database..."))
            {
                // Ensure database and apply pending migrations
                // _dbContext.Database.EnsureCreated();
                _dbContext.Database.Migrate();
                // _dbContext.SaveChanges();

                // // Checking admin account
                // if (_dbContext.Users.FirstOrDefault(u => u.Username == "admin") == null)
                // {
                //     // Adding admin user and saving to get id
                //     var un = "admin";
                //     var p = SecurityHelpers.GenerateRandomPassword(16);
                //     var s = SecurityHelpers.GenerateSalt();
                //     var u = new User
                //     {
                //         Id = Guid.NewGuid(),
                //         Username = un,
                //         Password = SecurityHelpers.GenerateHashedPassword(p, s.AsBytes),
                //         Active = true,
                //         Salt = s.AsString,
                //         Group = _dbContext.Groups.FirstOrDefault(g => g.Name == "Administrator")
                //     };
                //     _dbContext.Users.Add(u);
                //     _dbContext.SaveChanges();

                //     // Adding a device for the server
                //     var d = new Device
                //     {
                //         Id = Guid.NewGuid(),
                //         Name = "Audex Server",
                //         User = u,
                //         DeviceType = _dbContext.DeviceTypes.FirstOrDefault(d => d.Name == "Audex Server")
                //     };
                //     _dbContext.Devices.Add(d);
                //     _dbContext.SaveChanges();

                //     // Starting Stack and Clip (as an example)
                //     _stackService.CreateStartingStackAsync(u.Id).Wait();
                //     _clipService.CreateStartingClipAsync(u.Id).Wait();
                //     _twoFactorService.ResetTwoFactorAsync(u);

                //     _dbContext.SaveChanges();

                //     // Display admin credentials to user
                //     _logger.LogInformation($@"
                //         Admin account was not initialized, so a new one has been created.
                //         Use the following account to login:

                //         Username: {un}
                //         Password: {p}
                //     ");
                //     _twoFactorService.AuthQRToTerminal(u);

                // }

            }
        }
    }
}
