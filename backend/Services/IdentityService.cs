using System.IdentityModel.Tokens.Jwt;
using System.Security.Authentication;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using Snappy.API.Data;
using Snappy.API.Helpers;
using Snappy.API.Models;

namespace Snappy.API.Services
{
    public interface IIdentityService
    {
        Task<(User User, string TotpSecret)> Register(string firstName, string lastName, string username, string password, string publicKey);
        Task<(string AuthToken, string RefreshToken)> ActivateAccount(string username, string code);
        Task<(string AuthToken, string RefreshToken)> Authenticate(string username, string password, string code);
        Task<(string AuthToken, string RefreshToken)> Reauthenticate(string refreshToken);
        User CurrentUser { get; }
    }

    public class IdentityService : IIdentityService
    {
        private readonly HttpContext _context;
        private readonly ILogger<IdentityService> _logger;
        private readonly SnappyDBContext _dbContext;
        private readonly SnappySettings _settings;
        private readonly ITwoFactorService _twoFactorService;

        public IdentityService(IHttpContextAccessor context,
                               ILogger<IdentityService> logger,
                               SnappyDBContext dbContext,
                               IOptions<SnappySettings> settings,
                               ITwoFactorService twoFactorService)
        {
            _context = context.HttpContext;
            _logger = logger;
            _dbContext = dbContext;
            _settings = settings.Value;
            _twoFactorService = twoFactorService;
        }

        public async Task<(User User, string TotpSecret)> Register(string firstName, string lastName, string username, string password, string publicKey)
        {
            if (String.IsNullOrEmpty(username))
                throw new InvalidOperationException("Must provide a username.");
            if (String.IsNullOrEmpty(password))
                throw new InvalidOperationException("Must provide a password.");
            if (String.IsNullOrEmpty(publicKey))
                throw new InvalidOperationException("Must provide a public key.");

            var u = _dbContext.Users
                .FirstOrDefault(u => u.Username == username);

            if (u is not null)
                throw new AuthenticationException("User with provided username already exists.");

            var s = SecurityHelpers.GenerateSalt();
            var p = SecurityHelpers.GenerateHashedPassword(password, s.AsBytes);
            var t = SecurityHelpers.GenerateTwoFactorSecret();
            var newUser = new User
            {
                FirstName = firstName,
                LastName = lastName,
                Username = username,
                Password = p,
                Salt = s.AsString,
                PublicKey = publicKey,
                TwoFactorKey = t,
                Active = false,
            };

            await _dbContext.Users.AddAsync(newUser);
            await _dbContext.SaveChangesAsync();

            var totpQRCode = _twoFactorService.GetAuthQRBase64(newUser);
            return (newUser, totpQRCode);
        }
        public async Task<(string AuthToken, string RefreshToken)> ActivateAccount(string username, string code)
        {
            var u = _dbContext.Users
                .Where(u => u.Active == false)
                .FirstOrDefault(u => u.Username == username);

            if (u is null)
                throw new AuthenticationException("No user to activate under this username.");

            if (!await _twoFactorService.ResolveChallengeAsync(u, code))
                throw new AuthenticationException("Invalid two factor code.");

            u.Active = true;
            _dbContext.Update(u);
            await _dbContext.SaveChangesAsync();

            var newAuthToken = await GenerateAuthToken(u);
            var newRefreshToken = await GenerateRefreshToken(u);

            return (
                newAuthToken.Token,
                newRefreshToken.Token
            );
        }
        public async Task<(string AuthToken, string RefreshToken)> Authenticate(string username, string password, string code)
        {
            var u = _dbContext.Users
                .Where(u => u.Active)
                .FirstOrDefault(u => u.Username == username);

            if (u is null || u.Password != SecurityHelpers.GenerateHashedPassword(password, Convert.FromBase64String(u.Salt)))
                throw new AuthenticationException("Credentials not valid.");

            // If Totp is enabled, create challenge
            if (_settings.Security.IsTotpEnabled)
            {
                if (code is null || code == String.Empty)
                    throw new AuthenticationException("Please verify your login by providing a two factor code. |2FA_CHALLENGE|");

                if (!await _twoFactorService.ResolveChallengeAsync(u, code))
                    throw new AuthenticationException("Invalid two factor code.");
            }

            var newAuthToken = await GenerateAuthToken(u);
            var newRefreshToken = await GenerateRefreshToken(u);

            return (
                newAuthToken.Token,
                newRefreshToken.Token
            );
        }

        public async Task<(string AuthToken, string RefreshToken)> Reauthenticate(string refreshToken)
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

            return (
                newAuthToken.Token,
                newRefreshToken.Token
            );
        }

        public User CurrentUser
        {
            get
            {
                var userid = new Guid(_context.User.Claims
                        .FirstOrDefault(c => c.Type == ClaimTypes.NameIdentifier).Value);
                return _dbContext.Users
                    .FirstOrDefault(u => u.Id == userid);
            }
        }

        private async Task<(string Token, Guid EntityId)> GenerateAuthToken(User user)
        {
            if (user is null)
                throw new ArgumentNullException("Must pass a user to generate an auth token.");

            var key = new SymmetricSecurityKey(
                Encoding.UTF8.GetBytes(_settings.Jwt.Key));
            var claims = new List<Claim>
            {
                new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
                new Claim(ClaimTypes.Name, user.Username),
            };

            var expiry = DateTime.UtcNow.AddMinutes(15);

            var signingCredentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                _settings.Jwt.Issuer,
                _settings.Jwt.Audience,
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
}