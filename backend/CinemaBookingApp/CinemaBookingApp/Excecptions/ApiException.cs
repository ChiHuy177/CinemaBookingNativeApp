namespace CinemaBookingApp.Excecptions
{
    public class ApiException : Exception
    {
        public ErrorCode ErrorCode { get; }

        public ApiException(ErrorCode errorCode) : base(errorCode.Message)
        {
            ErrorCode = errorCode;
        }
    }
}
