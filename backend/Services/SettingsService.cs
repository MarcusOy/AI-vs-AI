namespace AVA.API.Services
{
    public class AVASettings
    {
        public string DisplayName { get; set; }
        public string DomainName { get; set; }
        public Jwt Jwt { get; set; }
        public Security Security { get; set; }
        public Notifications Notifications { get; set; }
    }

    public class Jwt
    {
        public string Key { get; set; }
        public string Issuer { get; set; }
        public string Audience { get; set; }
    }

    public class Security
    {
        public bool IsTotpEnabled { get; set; }
    }

    public class FileSystem
    {
        public string Persistant { get; set; }
        public string Temporary { get; set; }
    }
    public class Notifications
    {
        public string FcmId { get; set; }
        public string AppId { get; set; }
        public string ApiKey { get; set; }
    }
}