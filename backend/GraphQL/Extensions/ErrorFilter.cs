using System.Collections.Generic;
using System.Collections.ObjectModel;
using HotChocolate;

namespace Snappy.API.GraphQL.Extensions
{
    public class ErrorFilter : IErrorFilter
    {
        public IError OnError(IError error)
        {
            // Adding error message
            var message = error.Exception is null
                ? error.Message
                : error.Exception.Message;

            // Adding extension codes
            var extensionDict = new Dictionary<string, object>();
            var errorCodeExtract = message.Split('|', '|');
            if (errorCodeExtract.Length > 1)
            {
                var extensionCode = errorCodeExtract[1];
                if (extensionCode is not null || extensionCode == string.Empty)
                {
                    message = message.Split('|', '|')[0];
                    extensionDict.Add("code", extensionCode);
                }
            }

            return error
                .WithMessage(message.Trim())
                .WithExtensions(new ReadOnlyDictionary<string, object>(extensionDict));
        }
    }
}