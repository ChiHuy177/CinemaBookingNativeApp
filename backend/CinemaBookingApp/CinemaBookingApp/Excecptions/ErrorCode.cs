using System.Net;

namespace CinemaBookingApp.Excecptions
{
    public class ErrorCode
    {
        public static readonly ErrorCode KEY_INVALID = new(9998, "Invalid message key", HttpStatusCode.BadRequest);
        public static readonly ErrorCode UNAUTHENTICATED = new(9999, "Unauthenticated", HttpStatusCode.Unauthorized);
        public static readonly ErrorCode UNAUTHORIZED = new(999, "You do not have permission", HttpStatusCode.Forbidden);
        public static readonly ErrorCode NOT_FOUND = new(1, "Object not found", HttpStatusCode.NotFound);
        public static readonly ErrorCode VALIDATION_ERROR = new(100, "Validation Errors", HttpStatusCode.BadRequest);
        public static readonly ErrorCode UNKNOWN = new(101, "Unknown Errors", HttpStatusCode.BadRequest);
        public static readonly ErrorCode PASSWORD_NOT_MATCH = new(2, "Password not match", HttpStatusCode.BadRequest);
        public static readonly ErrorCode EMAIL_EXISTED = new(3, "Email already exist", HttpStatusCode.BadRequest);
        public static readonly ErrorCode LOGIN_FAIL = new(4, "Wrong User Information", HttpStatusCode.BadRequest);
        public static readonly ErrorCode USER_NOT_ACTIVE = new(5, "User is not active", HttpStatusCode.Unauthorized);
        public static readonly ErrorCode BAD_REQUEST = new(6, "Bad Request", HttpStatusCode.BadRequest);
        public static readonly ErrorCode CODE_EXPIRED = new (7,"Coupon is expired",HttpStatusCode.BadRequest);
        public static readonly ErrorCode SERVER_ERROR = new(8, "Server errors", HttpStatusCode.InternalServerError);
        public static readonly ErrorCode VERIFICATION_CODE_NOT_FOUND= new (9,"Verification code is incorrect",HttpStatusCode.BadRequest);
        public static readonly ErrorCode UNAVAILABLE_SEATS = new(10, "Unavailable Seats", HttpStatusCode.BadRequest);
        public static readonly ErrorCode COUPON_USED = new(11, "Coupon is used", HttpStatusCode.BadRequest);


        public int Code { get; }
        public string Message { get; }
        public HttpStatusCode StatusCode { get; }

        private ErrorCode(int code, string message, HttpStatusCode statusCode)
        {
            Code = code;
            Message = message;
            StatusCode = statusCode;
        }

        public override string ToString() => $"{Code}: {Message}";
    }

}
