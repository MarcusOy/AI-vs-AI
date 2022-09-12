using System.Collections.Specialized;
using System.Security.Authentication;
using Microsoft.Extensions.Options;
using OtpNet;
using QRCoder;
using Snappy.API.Data;
using Snappy.API.Helpers;
using Snappy.API.Models;

namespace Snappy.API.Services
{
    public interface ITwoFactorService
    {
        Task<bool> ResolveChallengeAsync(User user, string code);
        QRCodeData GetAuthQR(User user);
        string GetAuthQRBase64(User data);
        void AuthQRToTerminal(User data);
        void ResetTwoFactorAsync(User user);
    }
    public class TotpTwoFactorService : ITwoFactorService
    {
        private readonly SnappyDBContext _dbContext;
        private readonly SnappySettings _settings;
        private readonly ILogger<TotpTwoFactorService> _logger;
        private readonly HttpContext _context;

        public TotpTwoFactorService(SnappyDBContext dbContext,
                                    IOptions<SnappySettings> settings,
                                    ILogger<TotpTwoFactorService> logger,
                                    IHttpContextAccessor context)
        {
            _dbContext = dbContext;
            _settings = settings.Value;
            _logger = logger;
            _context = context.HttpContext;
        }

        public async Task<bool> ResolveChallengeAsync(User user, string code)
        {
            // If for some reason the user does not have a two factor key
            if (user.TwoFactorKey is null)
                throw new InvalidOperationException("User does not have two factor key.");

            // If code was not used already
            if (_dbContext.AuthTokens.Where(t => t.Token == code).Count() <= 0)
            {
                if (new Totp(Base32Encoding.ToBytes(user.TwoFactorKey))
                    .VerifyTotp(code, out long timeStep, new VerificationWindow(1, 1)))
                {
                    _dbContext.AuthTokens.Add(new AuthToken
                    {
                        Type = AuthTokenType.TwoFactor,
                        Token = code,
                        ExpiresOn = DateTime.UtcNow.AddMinutes(1),
                        UserId = user.Id
                    });
                    await _dbContext.SaveChangesAsync();
                    return true;
                }
                return false;
            }
            throw new AuthenticationException("Code already used.");
        }
        public QRCodeData GetAuthQR(User user)
        {
            if (user.TwoFactorKey is null)
                throw new InvalidOperationException("User does not have two factor key.");

            string baseUri = "otpauth://totp/";
            var query = new NameValueCollection {
                {"issuer", $"{_settings.DisplayName} - {_settings.DomainName}"},
                {"secret", user.TwoFactorKey}
            };
            string authUri = $"{baseUri}{user.Username}{GenerateQueryString(query)}";

            return new QRCodeGenerator().CreateQrCode(authUri, QRCodeGenerator.ECCLevel.Q);
        }
        public string GetAuthQRBase64(User user)
        {
            var data = GetAuthQR(user);
            var pngBytes = new PngByteQRCode(data).GetGraphic(20);
            return Convert.ToBase64String(pngBytes);
        }
        public void AuthQRToTerminal(User user)
        {
            var data = GetAuthQR(user);
            _logger.LogInformation($@"
Use the following QR code for 2FA:
{new AsciiQRCode(data).GetGraphic(1, "██", "  ", true, "\n")}
You can scan this QR code in apps such as Google Authenticator."
            );
        }
        public void ResetTwoFactorAsync(User user)
        {
            user.TwoFactorKey = SecurityHelpers.GenerateTwoFactorSecret();
        }
        private string GenerateQueryString(NameValueCollection collection)
        {
            var querystring = (
                from key in collection.AllKeys
                from value in collection.GetValues(key)
                select string.Format("{0}={1}",
                    key,
                    value)
            ).ToArray();
            return "?" + string.Join("&", querystring);
        }
    }
}