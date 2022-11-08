namespace AVA.API.Services
{
    public class AVASettings
    {
        public string Version { get; set; }
        public string ConnectionString { get; set; }
        public string JwtKey { get; set; }
        public RabbitMQ RabbitMQ { get; set; }
    }

    public class RabbitMQ
    {
        public string Host { get; set; }
        public string User { get; set; }
        public string Password { get; set; }
    }
}