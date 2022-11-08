using System.Net;
using System.Security.Authentication;

namespace AVA.API.Middleware;

public class ExceptionMiddleware
{
    private readonly RequestDelegate _next;

    public ExceptionMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            context.Response.ContentType = "text/plain";

            if (ex is ApplicationException)
                context.Response.StatusCode = (int)HttpStatusCode.InternalServerError;
            else if (ex is InvalidOperationException || ex is FormatException)
                context.Response.StatusCode = (int)HttpStatusCode.BadRequest;
            else if (ex is AuthenticationException)
                context.Response.StatusCode = (int)HttpStatusCode.Unauthorized;
            // else
            //     throw ex;

            await context.Response.WriteAsync(ex.Message);
        }
    }
}