namespace AVA.API.Helpers
{
    using System;
    using System.IO;
    using CliWrap;
    using CliWrap.Buffered;
    using DocParser;

    public static class JavaScriptHelpers
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

        public static JSDocParsed ExtractImplementations(this JSDocParsed parsed, string jsCode)
        {
            for (var x = 0; x < parsed.Functions.Count; x++)
            {
                // initialize stack and start
                var stack = new Stack<char>();
                var functionHeader = $"function {parsed.Functions[x].Name}";
                var startingIndicies = jsCode.AllIndexesOf(functionHeader);
                var functionBody = new List<String>();
                foreach (var startingIndex in startingIndicies)
                {
                    var curr = startingIndex;

                    // locate first curly brace
                    while (jsCode[curr] != '{' && jsCode[curr] != ';')
                        curr++;

                    // keep going if not a function stub
                    if (jsCode[curr] == '{')
                    {

                        // add first curly brace to stack
                        stack.Push(jsCode[curr]);

                        // traverse to last curly brace, navigating
                        // through nested structures of curly braces
                        while (stack.Count > 0)
                        {
                            curr++;

                            if (jsCode[curr] == '{')
                                stack.Push('{');
                            else if (jsCode[curr] == '}')
                                stack.Pop();
                        }
                    }

                    // don't forget last char
                    curr++;

                    // extract function body
                    functionBody.Add(jsCode[startingIndex..curr]);
                }
                parsed.Functions[x].Snippet = String.Join("\n\n", functionBody);
            }

            return parsed;
        }

        public static IEnumerable<int> AllIndexesOf(this string str, string searchstring)
        {
            var foundIndicies = new List<int>();

            for (int i = str.IndexOf(searchstring); i > -1; i = str.IndexOf(searchstring, i + 1))
                foundIndicies.Add(i);

            return foundIndicies;
        }
    }
}