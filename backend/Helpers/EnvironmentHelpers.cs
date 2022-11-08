namespace AVA.API.Helpers
{
    using System;
    using System.IO;

    public static class EnvironmentHelpers
    {
        public static void LoadEnv(string filePath)
        {
            if (!File.Exists(filePath))
                return;

            foreach (var line in File.ReadAllLines(filePath))
            {
                var parts = line.Split(
                    '=',
                    StringSplitOptions.RemoveEmptyEntries);

                if (parts.Length < 2)
                    continue;

                var value = String.Join("=", parts.Skip(1).ToArray());
                Environment.SetEnvironmentVariable(parts[0], value);
            }
        }
    }
}