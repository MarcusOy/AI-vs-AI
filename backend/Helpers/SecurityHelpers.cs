using System;
using System.Security.Cryptography;
using Microsoft.AspNetCore.Cryptography.KeyDerivation;
using Microsoft.AspNetCore.Http;
using OtpNet;

namespace AVA.API.Helpers
{
    public static class SecurityHelpers
    {
        public static string GenerateRandomPassword(int length, string chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890-_")
        {
            using (var crypto = RandomNumberGenerator.Create())
            {
                byte[] data = new byte[length];

                // If chars.Length isn't a power of 2 then there is a bias if we simply use the modulus operator. The first characters of chars will be more probable than the last ones.
                // buffer used if we encounter an unusable random byte. We will regenerate it in this buffer
                byte[] buffer = null;

                // Maximum random number that can be used without introducing a bias
                int maxRandom = byte.MaxValue - ((byte.MaxValue + 1) % chars.Length);

                crypto.GetBytes(data);

                char[] result = new char[length];

                for (int i = 0; i < length; i++)
                {
                    byte value = data[i];

                    while (value > maxRandom)
                    {
                        if (buffer == null)
                        {
                            buffer = new byte[1];
                        }

                        crypto.GetBytes(buffer);
                        value = buffer[0];
                    }

                    result[i] = chars[value % chars.Length];
                }

                return new string(result);
            }
        }
        public static (byte[] AsBytes, string AsString) GenerateSalt()
        {
            byte[] salt = new byte[128 / 8];
            using (var rng = RandomNumberGenerator.Create())
            {
                rng.GetBytes(salt);
            }

            return (salt, Convert.ToBase64String(salt));
        }
        public static string GenerateHashedPassword(string password, byte[] salt)
        {
            return Convert.ToBase64String(KeyDerivation.Pbkdf2(
                password: password,
                salt: salt,
                prf: KeyDerivationPrf.HMACSHA512,
                iterationCount: 10000,
                numBytesRequested: 256 / 8));
        }
        public static string GenerateHash(string key)
        {
            using (var sha = SHA512.Create())
            {
                Byte[] bytes = System.Text.Encoding.UTF8.GetBytes(string.Concat(key));
                return Convert.ToBase64String(sha.ComputeHash(bytes));
            }
        }
        public static string GenerateTwoFactorSecret()
        {
            var secret = KeyGeneration.GenerateRandomKey(20);
            return Base32Encoding.ToString(secret);
        }

        public static string GetIPAddress(this HttpContext context)
        {
            if (context.Request.Headers.ContainsKey("X-Forwarded-For"))
                return context.Request.Headers["X-Forwarded-For"];
            else
                return context.Connection.RemoteIpAddress.MapToIPv4().ToString();
        }
    }
}