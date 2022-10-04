using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using AVA.API.Data;
using AVA.API.Helpers;
using AVA.API.Models;

namespace AVA.API.Services
{
    public interface IIdentityService
    {
        Task<User> Register(string firstName, string lastName, string username, string password);
        Task<TokenPair> Authenticate(string username, string password);
        Task<TokenPair> Reauthenticate(string refreshToken);
        Task<User> UpdateAsync(User user);
        User CurrentUser { get; }
    }

    public class IdentityService : IIdentityService
    {
        private readonly HttpContext _context;
        private readonly ILogger<IdentityService> _logger;
        private readonly AVADbContext _dbContext;
        private readonly AVASettings _settings;
        public IdentityService(IHttpContextAccessor context,
                               ILogger<IdentityService> logger,
                               AVADbContext dbContext,
                               IOptions<AVASettings> settings)
        {
            _context = context.HttpContext;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
        }

        public async Task<User> Register(string firstName, string lastName, string username, string password)
        {
            if (String.IsNullOrEmpty(username))
                throw new InvalidOperationException("Must provide a username.");
            if (String.IsNullOrEmpty(password))
                throw new InvalidOperationException("Must provide a password.");

            var u = _dbContext.Users
                .FirstOrDefault(u => u.Username == username);

            if (u is not null)
                throw new AuthenticationException("User with provided username already exists.");

            var s = SecurityHelpers.GenerateSalt();
            var p = SecurityHelpers.GenerateHashedPassword(password, s.AsBytes);
            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Username = username,
                Password = p,
                Salt = s.AsString,
                Active = false,
            };

            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();

            return newUser;
        }
        public async Task<TokenPair> Authenticate(string username, string password)
        {
            var u = _dbContext.Users
                .Where(u => u.Active)
                .FirstOrDefault(u => u.Username == username);

            if (u is null || u.Password != SecurityHelpers.GenerateHashedPassword(password, Convert.FromBase64String(u.Salt)))
                throw new AuthenticationException("Credentials not valid.");

            var newAuthToken = await GenerateAuthToken(u);
            var newRefreshToken = await GenerateRefreshToken(u);

            return new TokenPair
            {
                AuthToken = newAuthToken.Token,
                RefreshToken = newRefreshToken.Token
            };
        }

        public async Task<TokenPair> Reauthenticate(string refreshToken)
        {
            var hash = SecurityHelpers.GenerateHash(refreshToken);
            var u = _dbContext.Users
                .Where(u => u.Active)
                .Include(u => u.Tokens)
                .SingleOrDefault(u => u.Tokens
                    .Any(t => t.Token == hash)
                );

            if (u is null)
                throw new AuthenticationException("Credential not valid.");

            var t = u.Tokens
                .Where(t => t.Type == "Refresh")
                .SingleOrDefault(t => t.Token == hash);

            if (t is null || !t.IsActive)
                throw new AuthenticationException("Refresh token not valid.");

            var newAuthToken = await GenerateAuthToken(u);
            var newRefreshToken = await GenerateRefreshToken(u);
            t.RevokedOn = DateTime.UtcNow;
            t.ReplacedByTokenId = newRefreshToken.EntityId;

            return new TokenPair
            {
                AuthToken = newAuthToken.Token,
                RefreshToken = newRefreshToken.Token
            };
        }

        public async Task<User> UpdateAsync(User user)
        {
            _dbContext.Update(user);
            await _dbContext.SaveChangesAsync();

            return user;
        }

        public User CurrentUser
        {
            get
            {
                if (!_context.User.Claims.Any())
                    throw new AuthenticationException("User is not logged in.");

                var userid = new Guid(_context.User.Claims
                        .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);

                if (userid == null)
                    throw new AuthenticationException("Malformed user. Please log in again");

                return _dbContext.Users
                    .FirstOrDefault(u => u.Id == userid);
            }
        }

        private async Task<(string Token, Guid EntityId)> GenerateAuthToken(User user)
        {
            if (user is null)
                throw new ArgumentNullException("Must pass a user to generate an auth token.");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.JwtKey));
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
            };

            var expiry = DateTime.UtcNow.AddMinutes(5);

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                "AVA",
                "AVA",
                claims,
                expires: expiry,
                signingCredentials: signingCredentials);

            var signedToken = new JwtSecurityTokenHandler().WriteToken(token);
            var e = await _dbContext.AuthTokens.AddAsync(new AuthToken
            {
                Type = AuthTokenType.Auth,
                Token = SecurityHelpers.GenerateHash(signedToken),
                ExpiresOn = expiry,
                CreatedOn = DateTime.UtcNow,
                User = user,
            });
            await _dbContext.SaveChangesAsync();

            return (signedToken, e.Entity.Id);
        }
        private async Task<(string Token, Guid EntityId)> GenerateRefreshToken(User user)
        {
            if (user is null)
                throw new ArgumentNullException("Must pass a user to generate a refresh token.");

            using (var crypto = RandomNumberGenerator.Create())
            {
                var randomBytes = new byte[64];
                crypto.GetBytes(randomBytes);
                var token = Convert.ToBase64String(randomBytes);

                var e = await _dbContext.AuthTokens.AddAsync(new AuthToken
                {
                    Type = AuthTokenType.Refresh,
                    Token = SecurityHelpers.GenerateHash(token),
                    ExpiresOn = DateTime.UtcNow.AddDays(7),
                    CreatedOn = DateTime.UtcNow,
                    User = user,
                });
                await _dbContext.SaveChangesAsync();

                return (token, e.Entity.Id);
            }
        }
    }

    public class TokenPair
    {
        public string AuthToken { get; set; }
        public string RefreshToken { get; set; }
    }
}