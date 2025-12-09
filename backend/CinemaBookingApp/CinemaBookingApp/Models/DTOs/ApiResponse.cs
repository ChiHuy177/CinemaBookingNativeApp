using CinemaBookingApp.Excecptions;

namespace CinemaBookingApp.Models.DTOs
{
    public class ApiResponse<T>
    {
        public int Code { get; set; } = 1000;
        public string Message { get; set; } = "Success";
        public T Result { get; set; }

        public static ApiResponse<T> Success(T result) => new() { Result = result };
        public static ApiResponse<T> Fail(ErrorCode errorCode) => new() { Code = errorCode.Code, Message = errorCode.Message };

        //public static ApiResponse<T> Fail(ErrorCode errorCode, T errors) => new() { Code = errorCode.Code, Result = errors };
    }

}
