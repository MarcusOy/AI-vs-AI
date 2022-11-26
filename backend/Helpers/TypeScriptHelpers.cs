namespace AVA.API.Helpers
{
    using System;
    using System.IO;
    using CliWrap;
    using CliWrap.Buffered;

    public static class TypeScriptHelpers
    {
        public static async Task<string> Transpile(string ts)
        {
            var tempTs = Path.GetTempFileName();
            var tempJs = Path.GetTempFileName();

            try
            {
                await File.WriteAllTextAsync(tempTs, ts);

                await Cli.Wrap("tsc")
                    .WithArguments($"--out {tempJs} {tempTs}")
                    .WithStandardOutputPipe(PipeTarget.ToDelegate(Console.WriteLine))
                    .ExecuteBufferedAsync();

                var js = await File.ReadAllTextAsync(tempJs);
                return js;
            }
            catch (Exception ex)
            {
                await Console.Error.WriteLineAsync("Error trying to transpile TS to JS: ");
                await Console.Error.WriteLineAsync(ex.Message);
            }
            finally
            {
                File.Delete(tempTs);
                File.Delete(tempJs);
            }

            throw new InvalidOperationException("Unable to transpile TS to JS.");
        }
    }
}