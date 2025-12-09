using CinemaBookingApp.Excecptions;
using CinemaBookingApp.Models.DTOs;
using FluentValidation;
using System.Net;
using System.Text.Json;

namespace CinemaBookingApp.Middlewares
{
    public class GlobalExceptionMiddleware
    {
        private readonly RequestDelegate _next;

        public GlobalExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext context)
        {
            try
            {
                await _next(context);
            }
            catch (Exception ex)
            {
                await HandleExceptionAsync(context, ex);
            }
        }

        private async Task HandleExceptionAsync(HttpContext context, Exception exception)
        {
            context.Response.ContentType = "application/json";

            ApiResponse<object> response;
            int statusCode = (int)HttpStatusCode.InternalServerError;

            switch (exception)
            {
                case ApiException apiEx:
                    response = ApiResponse<object>.Fail(apiEx.ErrorCode);
                    statusCode = (int)apiEx.ErrorCode.StatusCode;
                    break;

                case ValidationException validationEx:
                    var errors = validationEx.Errors.Select(e => new { field = e.PropertyName, error = e.ErrorMessage });
                    response = new ApiResponse<object>
                    {
                        Code = ErrorCode.VALIDATION_ERROR.Code,
                        Message = "Validation failed",
                        Result = errors
                    };
                    statusCode = (int)HttpStatusCode.BadRequest;
                    break;

                default:
                    response = new ApiResponse<object>
                    {
                        Code = ErrorCode.UNKNOWN.Code,
                        Message = "An unexpected error occurred.",
                        Result = new { exception.Message, exception.StackTrace }
                    };
                    break;
            }

            context.Response.StatusCode = statusCode;
            await context.Response.WriteAsync(JsonSerializer.Serialize(response));
        }
    }
}
